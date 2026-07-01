# Onboarding Automation

Google Apps Script automation for synchronizing **Batch 2 Sites** into vendor-specific sheets inside **Onboarding Issue List**.

## Status

`v1.0 stable` review completed.

## Features

- Read data from `Batch 2 Sites`
- Group rows by Vendor
- Automatically create vendor sheets
- Sync source columns from `Location` to `Onboarded`
- Smart Sync using hash comparison
- Preserve header formatting and column widths on first setup
- Copy dropdown/data validation from the source sheet
- Provide a simple Dashboard
- Optional backup module
- LockService to prevent two sync runs at the same time

## Spreadsheet setup

### Source spreadsheet

- Spreadsheet ID: `1IRt4XWmdug7Rl_Po4NO3FsZqk0PpJpchO0F3D001Uzc`
- Source sheet: `Batch 2 Sites`
- Header row: `2`
- Data start row: `3`
- Location column: `B`
- Vendor column: `D`

### Target spreadsheet

- Spreadsheet ID: `1HMxXf_K009JKL8HfGEjXXmkLzJfJgTJN7g91oeMZaMk`
- Vendor sheets are created automatically.
- Vendor sheet header row: `2`
- Vendor data start row: `3`

## Source columns

The source data starts from column B:

1. Location
2. Postal Code
3. Vendor
4. DIV
5. Rack Loc
6. Fibre cable
7. Singtel ONT
8. Singtel Box
9. Cert Loaded?
10. SDWan Loaded?
11. Remarks
12. Have cert?
13. Onboarded

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

## First run

Copy all `.gs` files into Apps Script, then run:

```javascript
syncNow
```

After the first successful test, run:

```javascript
createSyncTrigger
```

This creates the 5-minute automatic sync trigger.
