# Changelog

## 1.6.0 - 2025-03-09
Required backend version: 1.6+

### Changes
- Added sport managers
- Changed CI testing from Travis to GitHub Actions
- Fixed empty result in the last line of Sius data
- Updated SheetJS version and changed repository
- Improved decimal checking for result values
- Ignore case in organization name matching
- Added custom sortKey for PRS results
- Added new header for Sius-parser

## 1.5.0 - 2024-12-16
Required backend version: 1.5+

### Changes
- Added info page to list judge merits
- Allow linking athletes as event contacts
- Added listing of past applied events
- Improved event and competition information
- Added required tags to forms
- Added scrolling to event contacts after posting event
- Added list of event roles to Athlete information

## 1.4.0 - 2024-06-21
Required backend version: 1.4+

### Changes
- Added listing of Athlete's licenses and merits
- Added judge and licensed to Athlete search
- Fixed editPermission when loading competition

## 1.3.0 - 2023-12-17
Required backend version: 1.3+

### Changes
- Add support for competition calendar
- Add support for area managers
- Fix file upload when file type is unspecified
- Improved competition type matching in Pelias import
- Fix invalid numbers in position
- Allow different team name separators
- Allow setting historical records in UI
- Add edit mode links to Django admin site
- Fix foreign athlete organizations in Pelias import
- Use first result by default when finding multiple external athletes
- Add Finnish translations to SIUS import
- Fix media result positions in practical
- Update package versions

## 1.2.0 - 2022-07-09
Required backend version: 1.2+

### Changes
- Add support for statistic links
- Add athlete information check
- Add Pelias import
- Add new result sort keys
- Check case-insensitive organization abbreviations in import
- Warn about missing licence when importing results
- Update package versions
- Style changes to support new prettier defaults

## 1.1.0 - 2021-01-31

### Changes
- Added support for multiline partial results in SIUS data
- Fixed category value in SIUS import form
- Changed media results to require logged on user, not edit permissions
- Fixed year depending tests

## 1.0.0 - 2020-11-16
Required backend version: 1.0+

### Changes
- Added support for text based partial results
- Added custom ordering for silhouette sport
- Fixed default value for group results
- Changed file import to check only extensions
- Check for missing headers in file import
- Improved errors messages
- Updated versions of required packages

## 0.3.0 - 2020-08-14
Required backend version: 0.4+

### Changes
- Refactored API shared API calls to use mixin
- Added missing translations
- Added competition type information page
- Improved error messages for different failures

## 0.2.0 - 2020-08-11
Required backend version: 0.3+

### Changes
- Added missing result info to result details
- Fixed use of name from result object instead of name from athlete object
- Updated dependencies
- Added saving locale and edit mode to local storage
- Result import updates
  - Fixed numeric category codes
  - Added dry run option
  - Added wtype option for Mustaruuti results
  - Added improved Excel import headers
  - Added improved team member information
  - Added nested partial results
  - Fixed importing empty result
- Various UI improvements and fixes
- Changed group results primarily by elimination_category
- Added empty results columns filtering in results list
- Ignore DNS/DNF/DSQ in final result group
- Fixed media results
- Limit external and historical organizations in views
- Added travis config
- Updated tests

## 0.1.0 - 2020-02-17
Initial public version