# Installation Guide

## 1. Create Apps Script project

Open the **Onboarding Issue List** spreadsheet, then go to:

```text
Extensions → Apps Script
```

Create these files in Apps Script and copy the matching code from this repository:

```text
Config.gs
Utils.gs
Main.gs
SyncVendor.gs
Dashboard.gs
Backup.gs
```

## 2. Check Config.gs

The spreadsheet IDs are already filled in:

```javascript
SOURCE_SPREADSHEET_ID: '1IRt4XWmdug7Rl_Po4NO3FsZqk0PpJpchO0F3D001Uzc'
TARGET_SPREADSHEET_ID: '1HMxXf_K009JKL8HfGEjXXmkLzJfJgTJN7g91oeMZaMk'
```

If you want backup, create a Google Drive folder and paste the folder ID here:

```javascript
BACKUP_FOLDER_ID: ''
```

The folder ID is the part between `/folders/` and the next `/` in the Google Drive URL.

## 3. First run

In Apps Script, run:

```javascript
syncNow
```

Google will ask for authorization. Allow access.

## 4. Create automatic sync trigger

Run:

```javascript
createSyncTrigger
```

This creates a sync trigger every 5 minutes.

## 5. Optional backup trigger

After filling `BACKUP_FOLDER_ID`, run:

```javascript
createBackupTrigger
```

This creates a daily backup trigger at around 2 AM.

## 6. Manual buttons/menu

After refreshing the spreadsheet, a menu named **Onboarding Automation** should appear.

It includes:

- Sync Now
- Backup Now
- Create 5-min Sync Trigger
- Create Daily Backup Trigger
- Delete All Project Triggers

## 7. Expected result

The target spreadsheet will automatically create vendor sheets based on the Vendor column in `Batch 2 Sites`.

Example:

```text
Byte
Noble
Normslab
Solutrust
Techlem
Terherny
```

New vendor names will create new sheets automatically.
