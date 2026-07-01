/**
 * =====================================================
 * Onboarding Automation System - Vendor Sync
 * =====================================================
 * Reads Batch 2 Sites and syncs rows into vendor-specific
 * sheets in the Onboarding Issue List spreadsheet.
 */

function syncVendorSheets() {
  const startedAt = new Date();
  const sourceSS = oaOpenSpreadsheet_(CONFIG.SOURCE_SPREADSHEET_ID, 'Source');
  const targetSS = oaOpenSpreadsheet_(CONFIG.TARGET_SPREADSHEET_ID, 'Target');
  const sourceSheet = oaGetSheet_(sourceSS, CONFIG.SOURCE_SHEET_NAME);

  const source = oaReadSourceData_(sourceSheet);
  const groups = oaGroupRowsByVendor_(source);
  const result = oaCreateSyncResult_(startedAt);

  Object.keys(groups).sort().forEach(function(vendorName) {
    const group = groups[vendorName];
    const action = oaSyncOneVendor_(targetSS, sourceSheet, vendorName, source, group);

    result.vendorCount += 1;
    result.totalRecords += group.rows.length;
    result.vendorRows.push({
      vendor: vendorName,
      records: group.rows.length,
      action: action,
      lastSync: new Date()
    });

    if (action === 'created') result.created += 1;
    if (action === 'updated') result.updated += 1;
    if (action === 'skipped') result.skipped += 1;
    if (action === 'cleared') result.cleared += 1;
  });

  oaHandleUnusedVendorSheets_(targetSS, groups, source.exportColumnCount, result);

  result.finishedAt = new Date();
  result.durationSeconds = (result.finishedAt - result.startedAt) / 1000;
  oaSetScriptProperty_('LAST_VENDOR_SYNC', oaFormatDate_(result.finishedAt));
  oaSetScriptProperty_('LAST_VENDOR_SYNC_HASH', oaHashRows_(source.exportRows));

  return result;
}

function oaReadSourceData_(sourceSheet) {
  const lastRow = sourceSheet.getLastRow();
  const lastColumn = sourceSheet.getLastColumn();

  if (lastRow < CONFIG.DATA_START_ROW) {
    throw new Error('No source data found in ' + CONFIG.SOURCE_SHEET_NAME);
  }

  const allHeaders = sourceSheet.getRange(CONFIG.HEADER_ROW, 1, 1, lastColumn).getValues()[0];
  const headerMap = oaBuildHeaderMap_(allHeaders);

  const locationIndex = oaFindHeaderIndex_(headerMap, 'Location', CONFIG.LOCATION_COLUMN - 1);
  const vendorIndex = oaFindHeaderIndex_(headerMap, 'Vendor', CONFIG.VENDOR_COLUMN - 1);
  const onboardedIndex = oaFindHeaderIndex_(headerMap, 'Onboarded', lastColumn - 1);

  const rawRows = sourceSheet
    .getRange(CONFIG.DATA_START_ROW, 1, lastRow - CONFIG.DATA_START_ROW + 1, lastColumn)
    .getValues();

  const exportHeaders = allHeaders.slice(locationIndex, onboardedIndex + 1);
  const exportRows = rawRows
    .filter(function(row) {
      return oaNormalizeText_(row[locationIndex]) !== '';
    })
    .map(function(row) {
      return row.slice(locationIndex, onboardedIndex + 1);
    });

  return {
    allHeaders: allHeaders,
    rawRows: rawRows,
    headerMap: headerMap,
    locationIndex: locationIndex,
    vendorIndex: vendorIndex,
    exportStartColumn: locationIndex + 1,
    exportHeaders: exportHeaders,
    exportRows: exportRows,
    exportColumnCount: exportHeaders.length
  };
}

function oaGroupRowsByVendor_(source) {
  const groups = {};

  source.rawRows.forEach(function(row) {
    const location = oaNormalizeText_(row[source.locationIndex]);
    if (!location) return;

    const vendor = oaNormalizeVendor_(row[source.vendorIndex]);
    if (!vendor) return;

    const safeVendor = oaSafeSheetName_(vendor);
    if (!groups[safeVendor]) {
      groups[safeVendor] = {
        vendor: safeVendor,
        rows: []
      };
    }

    groups[safeVendor].rows.push(row.slice(source.locationIndex, source.locationIndex + source.exportColumnCount));
  });

  return groups;
}

function oaSyncOneVendor_(targetSS, sourceSheet, vendorName, source, group) {
  let sheet = targetSS.getSheetByName(vendorName);
  const isNewSheet = !sheet;

  if (!sheet) {
    sheet = targetSS.insertSheet(vendorName);
  }

  const newHash = oaHashRows_(group.rows);
  const propertyKey = oaVendorHashKey_(vendorName);
  const oldHash = oaGetScriptProperty_(propertyKey);

  if (CONFIG.SMART_SYNC && oldHash === newHash && !isNewSheet) {
    return 'skipped';
  }

  oaPrepareVendorSheet_(sheet, sourceSheet, source, isNewSheet);
  oaClearDataOnly_(sheet, CONFIG.DATA_START_ROW, 1, source.exportColumnCount);

  if (group.rows.length > 0) {
    sheet.getRange(CONFIG.DATA_START_ROW, 1, group.rows.length, source.exportColumnCount).setValues(group.rows);
    oaCopyDataValidations_(sourceSheet, sheet, source.exportStartColumn, 1, group.rows.length, source.exportColumnCount);
  }

  oaEnsureFilter_(sheet, CONFIG.HEADER_ROW, 1, Math.max(group.rows.length + 1, 2), source.exportColumnCount);
  oaSetScriptProperty_(propertyKey, newHash);

  return isNewSheet ? 'created' : 'updated';
}

function oaPrepareVendorSheet_(sheet, sourceSheet, source, isNewSheet) {
  const currentHeader = sheet.getRange(CONFIG.HEADER_ROW, 1, 1, source.exportColumnCount).getValues()[0];
  const needsHeader = isNewSheet || currentHeader.join('') === '';

  if (needsHeader) {
    sheet.getRange(CONFIG.HEADER_ROW, 1, 1, source.exportColumnCount).setValues([source.exportHeaders]);
    oaCopyHeaderFormat_(sourceSheet, sheet, source.exportStartColumn, 1, source.exportColumnCount);
    oaCopyColumnWidths_(sourceSheet, sheet, source.exportStartColumn, 1, source.exportColumnCount);
    sheet.setFrozenRows(CONFIG.HEADER_ROW);
  }
}

function oaHandleUnusedVendorSheets_(targetSS, currentGroups, columnCount, result) {
  const currentNames = Object.keys(currentGroups);

  targetSS.getSheets().forEach(function(sheet) {
    const name = sheet.getName();
    if (oaIsSystemSheet_(name)) return;
    if (currentNames.indexOf(name) !== -1) return;

    if (CONFIG.DELETE_UNUSED_VENDOR_SHEETS) {
      targetSS.deleteSheet(sheet);
      oaDeleteScriptProperty_(oaVendorHashKey_(name));
      result.deleted += 1;
    } else {
      oaClearDataOnly_(sheet, CONFIG.DATA_START_ROW, 1, columnCount);
      oaDeleteScriptProperty_(oaVendorHashKey_(name));
      result.cleared += 1;
    }
  });
}

function oaCreateSyncResult_(startedAt) {
  return {
    startedAt: startedAt,
    finishedAt: null,
    durationSeconds: 0,
    vendorCount: 0,
    totalRecords: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    cleared: 0,
    deleted: 0,
    vendorRows: []
  };
}

function oaVendorHashKey_(vendorName) {
  return 'VENDOR_HASH_' + oaMd5_(vendorName);
}
