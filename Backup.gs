/**
 * =====================================================
 * Onboarding Automation System - Backup
 * =====================================================
 * Creates a timestamped copy of the target spreadsheet in a
 * configured Google Drive folder.
 */

function backupOnboardingIssueList() {
  if (!CONFIG.BACKUP_FOLDER_ID) {
    throw new Error('BACKUP_FOLDER_ID is empty in Config.gs.');
  }

  const targetFile = DriveApp.getFileById(CONFIG.TARGET_SPREADSHEET_ID);
  const folder = DriveApp.getFolderById(CONFIG.BACKUP_FOLDER_ID);
  const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE || Session.getScriptTimeZone(), 'yyyy-MM-dd HH-mm');
  const backupName = CONFIG.BACKUP_FILE_PREFIX + ' ' + timestamp;

  const copy = targetFile.makeCopy(backupName, folder);

  oaSetScriptProperty_('LAST_BACKUP_TIME', oaFormatDate_(new Date()));
  oaSetScriptProperty_('LAST_BACKUP_FILE', copy.getName());

  updateBackupStatusOnDashboard_(copy.getName());
  return copy;
}

function updateBackupStatusOnDashboard_(fileName) {
  const targetSS = oaOpenSpreadsheet_(CONFIG.TARGET_SPREADSHEET_ID, 'Target');
  const sheet = targetSS.getSheetByName(CONFIG.DASHBOARD_SHEET_NAME);
  if (!sheet) return;

  sheet.getRange('A11').setValue('Last Backup');
  sheet.getRange('B11').setValue(oaGetScriptProperty_('LAST_BACKUP_TIME'));
  sheet.getRange('A12').setValue('Backup File');
  sheet.getRange('B12').setValue(fileName || oaGetScriptProperty_('LAST_BACKUP_FILE'));
  sheet.getRange('A11:A12').setFontWeight('bold');
  sheet.autoResizeColumns(1, 2);
}
