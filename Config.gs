/**
 * =====================================================
 * Onboarding Automation System - Config
 * =====================================================
 * Update this file only when spreadsheet IDs or layout settings change.
 */
const CONFIG = {
  SOURCE_SPREADSHEET_ID: '1IRt4XWmdug7Rl_Po4NO3FsZqk0PpJpchO0F3D001Uzc',
  TARGET_SPREADSHEET_ID: '1HMxXf_K009JKL8HfGEjXXmkLzJfJgTJN7g91oeMZaMk',
  SOURCE_SHEET_NAME: 'Batch 2 Sites',

  HEADER_ROW: 2,
  DATA_START_ROW: 3,

  // Fallback column positions, 1-based. The script will prefer header names when possible.
  LOCATION_COLUMN: 2, // B
  VENDOR_COLUMN: 4,   // D

  REQUIRED_HEADERS: [
    'Location',
    'Postal Code',
    'Vendor',
    'DIV',
    'Rack Loc',
    'Fibre cable',
    'Singtel ONT',
    'Singtel Box',
    'Cert Loaded?',
    'SDWan Loaded?',
    'Remarks',
    'Have cert?',
    'Onboarded'
  ],

  // These columns are editable in vendor sheets.
  // Existing values are preserved on later sync runs.
  EDITABLE_VENDOR_HEADERS: [
    'Fibre cable',
    'Singtel ONT',
    'Singtel Box',
    'Remarks'
  ],

  // These columns are protected in vendor sheets.
  PROTECTED_VENDOR_HEADERS: [
    'Location',
    'Postal Code',
    'Vendor',
    'DIV',
    'Rack Loc',
    'Cert Loaded?',
    'SDWan Loaded?',
    'Have cert?',
    'Onboarded'
  ],

  DASHBOARD_SHEET_NAME: 'Dashboard',

  // Sheets listed here will never be treated as vendor sheets.
  // Sheet1 is included to protect the default blank tab in a new spreadsheet.
  SYSTEM_SHEETS: ['Dashboard', 'Sheet1'],

  // If false, vendor sheets with no current data are cleared but not deleted.
  DELETE_UNUSED_VENDOR_SHEETS: false,

  SMART_SYNC: true,

  // Backup settings. Fill BACKUP_FOLDER_ID when you want automatic backup.
  BACKUP_FOLDER_ID: '',
  BACKUP_KEEP_DAYS: 30,
  BACKUP_FILE_PREFIX: 'Onboarding Issue List Backup',

  TIMEZONE: 'Asia/Singapore'
};
