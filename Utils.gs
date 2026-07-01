/**
 * =====================================================
 * Onboarding Automation System - Utilities
 * =====================================================
 */

function oaOpenSpreadsheet_(spreadsheetId, label) {
  if (!spreadsheetId) {
    throw new Error(label + ' spreadsheet ID is missing.');
  }
  return SpreadsheetApp.openById(spreadsheetId);
}

function oaGetSheet_(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  return sheet;
}

function oaFormatDate_(date) {
  return Utilities.formatDate(date || new Date(), CONFIG.TIMEZONE || Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function oaNormalizeText_(value) {
  return String(value == null ? '' : value).trim().replace(/\s+/g, ' ');
}

function oaNormalizeHeader_(value) {
  return oaNormalizeText_(value).toLowerCase();
}

function oaNormalizeVendor_(value) {
  return oaNormalizeText_(value);
}

function oaSafeSheetName_(name) {
  let safe = oaNormalizeVendor_(name).replace(/[\\\/\?\*\[\]\:]/g, '-');
  if (!safe) safe = 'Unknown Vendor';
  return safe.slice(0, 100);
}

function oaBuildHeaderMap_(headers) {
  const map = {};
  headers.forEach(function(header, index) {
    const key = oaNormalizeHeader_(header);
    if (key) map[key] = index;
  });
  return map;
}

function oaFindHeaderIndex_(headerMap, headerName, fallbackIndex) {
  const key = oaNormalizeHeader_(headerName);
  if (Object.prototype.hasOwnProperty.call(headerMap, key)) {
    return headerMap[key];
  }
  return fallbackIndex;
}

function oaMd5_(value) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(value));
  return digest.map(function(byte) {
    const normalized = (byte + 256) % 256;
    return ('0' + normalized.toString(16)).slice(-2);
  }).join('');
}

function oaHashRows_(rows) {
  return oaMd5_(JSON.stringify(rows));
}

function oaEnsureSheetSize_(sheet, minRows, minColumns) {
  if (sheet.getMaxRows() < minRows) {
    sheet.insertRowsAfter(sheet.getMaxRows(), minRows - sheet.getMaxRows());
  }
  if (sheet.getMaxColumns() < minColumns) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), minColumns - sheet.getMaxColumns());
  }
}

function oaCopyColumnWidths_(sourceSheet, targetSheet, sourceStartCol, targetStartCol, columnCount) {
  oaEnsureSheetSize_(targetSheet, targetSheet.getMaxRows(), targetStartCol + columnCount - 1);
  for (let i = 0; i < columnCount; i++) {
    targetSheet.setColumnWidth(targetStartCol + i, sourceSheet.getColumnWidth(sourceStartCol + i));
  }
}

function oaCopyHeaderFormat_(sourceSheet, targetSheet, sourceStartCol, targetStartCol, columnCount) {
  oaEnsureSheetSize_(targetSheet, CONFIG.HEADER_ROW, targetStartCol + columnCount - 1);
  sourceSheet
    .getRange(CONFIG.HEADER_ROW, sourceStartCol, 1, columnCount)
    .copyTo(targetSheet.getRange(CONFIG.HEADER_ROW, targetStartCol, 1, columnCount), SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
}

function oaCopyDataValidations_(sourceSheet, targetSheet, sourceStartCol, targetStartCol, rowCount, columnCount) {
  if (rowCount < 1) return;
  oaEnsureSheetSize_(targetSheet, CONFIG.DATA_START_ROW + rowCount - 1, targetStartCol + columnCount - 1);
  const sourceRange = sourceSheet.getRange(CONFIG.DATA_START_ROW, sourceStartCol, 1, columnCount);
  const rules = sourceRange.getDataValidations()[0];
  for (let colOffset = 0; colOffset < columnCount; colOffset++) {
    const rule = rules[colOffset];
    if (rule) {
      targetSheet.getRange(CONFIG.DATA_START_ROW, targetStartCol + colOffset, rowCount, 1).setDataValidation(rule);
    }
  }
}

function oaClearDataOnly_(sheet, startRow, startCol, columnCount) {
  const lastRow = sheet.getLastRow();
  if (lastRow >= startRow) {
    sheet.getRange(startRow, startCol, lastRow - startRow + 1, columnCount).clearContent();
  }
}

function oaEnsureFilter_(sheet, startRow, startCol, rowCount, columnCount) {
  const existing = sheet.getFilter();
  if (existing) existing.remove();
  sheet.getRange(startRow, startCol, Math.max(rowCount, 1), columnCount).createFilter();
}

function oaIsSystemSheet_(sheetName) {
  return (CONFIG.SYSTEM_SHEETS || []).indexOf(sheetName) !== -1;
}

function oaGetScriptProperty_(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function oaSetScriptProperty_(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, String(value));
}

function oaDeleteScriptProperty_(key) {
  PropertiesService.getScriptProperties().deleteProperty(key);
}
