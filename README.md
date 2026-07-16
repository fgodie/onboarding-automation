# Onboarding Automation

Google Apps Script automation for synchronizing **Batch 2 Sites** into vendor-specific sheets inside **Onboarding Issue List**.

## Status

`v1.0 Stable`

## Features

- Automatically create Vendor sheets
- Synchronize source data into Vendor sheets
- Preserve editable Vendor columns
- Protect source-controlled columns
- Preserve formatting after initial setup
- Preserve dropdowns and checkboxes after initial setup
- Backfill blank source values from Vendor sheets
- Record backfill actions in **Sync Log**
- Dashboard support
- Backup support
- LockService protection

## Files

```text
Config.gs
Utils.gs
Main.gs
SyncVendor.gs
Dashboard.gs
Backup.gs
INSTALL.md
```

## First Run

1. Copy all `.gs` files into Google Apps Script.
2. Run:

```javascript
syncNow()
```

3. After confirming the first sync is successful, run:

```javascript
createSyncTrigger()
```

This creates the automatic 5-minute synchronization trigger.