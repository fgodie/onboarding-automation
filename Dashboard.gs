/**
 * =====================================================
 * Onboarding Automation System - Dashboard
 * =====================================================
 */

function updateDashboard(syncResult) {
  const targetSS = oaOpenSpreadsheet_(CONFIG.TARGET_SPREADSHEET_ID, 'Target');
  let sheet = targetSS.getSheetByName(CONFIG.DASHBOARD_SHEET_NAME);
  if (!sheet) {
    sheet = targetSS.insertSheet(CONFIG.DASHBOARD_SHEET_NAME, 0);
  }

  const result = syncResult || oaBuildDashboardResultFromSheets_(targetSS);
  sheet.clearContents();

  sheet.getRange('A1').setValue('Onboarding Automation Dashboard');
  sheet.getRange('A3').setValue('Last Sync');
  sheet.getRange('B3').setValue(result.finishedAt ? oaFormatDate_(result.finishedAt) : oaGetScriptProperty_('LAST_VENDOR_SYNC'));
  sheet.getRange('A4').setValue('Total Vendors');
  sheet.getRange('B4').setValue(result.vendorCount);
  sheet.getRange('A5').setValue('Total Records');
  sheet.getRange('B5').setValue(result.totalRecords);
  sheet.getRange('A6').setValue('Created');
  sheet.getRange('B6').setValue(result.created || 0);
  sheet.getRange('A7').setValue('Updated');
  sheet.getRange('B7').setValue(result.updated || 0);
  sheet.getRange('A8').setValue('Skipped');
  sheet.getRange('B8').setValue(result.skipped || 0);
  sheet.getRange('A9').setValue('Cleared');
  sheet.getRange('B9').setValue(result.cleared || 0);

  sheet.getRange('D3').setValue('Vendor');
  sheet.getRange('E3').setValue('Records');
  sheet.getRange('F3').setValue('Action');
  sheet.getRange('G3').setValue('Last Sync');

  const rows = (result.vendorRows || []).sort(function(a, b) {
    return String(a.vendor).localeCompare(String(b.vendor));
  }).map(function(item) {
    return [
      item.vendor,
      item.records,
      item.action || '',
      item.lastSync ? oaFormatDate_(item.lastSync) : ''
    ];
  });

  if (rows.length > 0) {
    sheet.getRange(4, 4, rows.length, 4).setValues(rows);
  }

  sheet.getRange('A1:G1').setFontWeight('bold');
  sheet.getRange('A3:A9').setFontWeight('bold');
  sheet.getRange('D3:G3').setFontWeight('bold');
  sheet.autoResizeColumns(1, 7);
}

function oaBuildDashboardResultFromSheets_(targetSS) {
  const vendorRows = [];
  let totalRecords = 0;

  targetSS.getSheets().forEach(function(sheet) {
    const name = sheet.getName();
    if (oaIsSystemSheet_(name)) return;

    const records = Math.max(sheet.getLastRow() - CONFIG.DATA_START_ROW + 1, 0);
    totalRecords += records;
    vendorRows.push({
      vendor: name,
      records: records,
      action: '',
      lastSync: null
    });
  });

  return {
    finishedAt: null,
    vendorCount: vendorRows.length,
    totalRecords: totalRecords,
    created: 0,
    updated: 0,
    skipped: 0,
    cleared: 0,
    vendorRows: vendorRows
  };
}
