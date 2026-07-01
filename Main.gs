/**
 * =====================================================
 * Onboarding Automation System - Main Entry
 * =====================================================
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Onboarding Automation')
    .addItem('Sync Now', 'syncNow')
    .addItem('Backup Now', 'backupNow')
    .addSeparator()
    .addItem('Create 5-min Sync Trigger', 'createSyncTrigger')
    .addItem('Create Daily Backup Trigger', 'createBackupTrigger')
    .addItem('Delete All Project Triggers', 'deleteProjectTriggers')
    .addToUi();
}

function syncNow() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    SpreadsheetApp.getUi().alert('Sync is already running. Please try again later.');
    return;
  }

  const start = new Date();
  try {
    const result = syncVendorSheets();
    updateDashboard(result);
    SpreadsheetApp.getUi().alert(
      'Sync Completed\n\n' +
      'Vendors: ' + result.vendorCount + '\n' +
      'Records: ' + result.totalRecords + '\n' +
      'Updated: ' + result.updated + '\n' +
      'Skipped: ' + result.skipped + '\n' +
      'Duration: ' + ((new Date() - start) / 1000).toFixed(2) + ' sec'
    );
  } finally {
    lock.releaseLock();
  }
}

function syncNowSilent() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    const result = syncVendorSheets();
    updateDashboard(result);
  } finally {
    lock.releaseLock();
  }
}

function backupNow() {
  const file = backupOnboardingIssueList();
  if (file) {
    SpreadsheetApp.getUi().alert('Backup Completed\n\n' + file.getName());
  }
}

function createSyncTrigger() {
  deleteTriggerByFunction_('syncNowSilent');
  ScriptApp.newTrigger('syncNowSilent').timeBased().everyMinutes(5).create();
  SpreadsheetApp.getUi().alert('5-minute sync trigger created.');
}

function createBackupTrigger() {
  deleteTriggerByFunction_('backupOnboardingIssueList');
  ScriptApp.newTrigger('backupOnboardingIssueList').timeBased().everyDays(1).atHour(2).create();
  SpreadsheetApp.getUi().alert('Daily backup trigger created for around 2 AM.');
}

function deleteProjectTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  SpreadsheetApp.getUi().alert('All project triggers deleted.');
}

function deleteTriggerByFunction_(functionName) {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}
