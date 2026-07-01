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

  DASHBOARD_SHEET_NAME: 'Dashboard',

  SYSTEM_SHEETS: ['Dashboard'],

  DELETE_UNUSED_VENDOR_SHEETS: false,

  SMART_SYNC: true,

  BACKUP_FOLDER_ID: '',
  BACKUP_KEEP_DAYS: 30,
  BACKUP_FILE_PREFIX: 'Onboarding Issue List Backup',

  TIMEZONE: 'Asia/Singapore'
};
