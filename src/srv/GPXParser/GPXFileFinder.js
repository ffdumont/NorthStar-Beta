/**
 * Finds the GPX file based on the date stored in the spreadsheet's named range.
 * Uses `getGPXGenerationDateTime()` to get the date and searches the corresponding file.
 * @returns {GoogleAppsScript.Drive.File|null} - The found GPX file or null if not found.
 */
function findGPXFileInDriveFromSettings() {
  try {
    const gpxDate = getGPXGenerationDateTime();
    return gpxDate ? findGPXFileInDrive(gpxDate) : null;
  } catch (error) {
    Logger.log(error.message);
    return null;
  }
}
/**
 * Retrieves the GPX generation date-time from the named range "gpxGenerationDateTime" in the "Settings" sheet.
 * Ensures the value is a valid Date object before returning it.
 * @returns {Date|null} - The retrieved Date object or null if invalid/missing.
 */
function getGPXGenerationDateTime() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  if (!sheet) return Logger.log("❌ 'Settings' sheet not found."), null;

  const value = sheet.getRange("gpxGenerationDateTime").getValue();
  return value instanceof Date
    ? value
    : (Logger.log("❌ Invalid GPX date-time."), null);
}
/**
 * Finds the GPX file in Google Drive based on a given date.
 * It locates the correct folder and searches for a filename that matches the expected pattern.
 * @param {string|Date} dateString - The date to search for (ISO string or Date object).
 * @returns {GoogleAppsScript.Drive.File|null} - The found GPX file or null if not found.
 */
function findGPXFileInDrive(dateString) {
  const folder = getSheetFolder();
  if (!folder)
    return Logger.log("❌ Error: Could not determine the parent folder."), null;
  return findFileByPattern(folder, formatFilenamePattern(dateString));
}
/**
 * Generates the GPX filename pattern based on a given date.
 * Expected output: "YYYYMMDD_HHMM_LogNav"
 * @param {string|Date} dateString - The date input (ISO string or Date object).
 * @returns {string|null} - The formatted filename pattern or null if the date is invalid.
 */
function formatFilenamePattern(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime()))
    return Logger.log(`❌ Invalid date value: ${dateString}`), null;

  return (
    `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(date.getDate()).padStart(2, "0")}` +
    `_${String(date.getHours()).padStart(2, "0")}${String(
      date.getMinutes()
    ).padStart(2, "0")}_LogNav`
  );
}
/**
 * Retrieves the Google Drive folder where the active spreadsheet is stored.
 * @returns {GoogleAppsScript.Drive.Folder|null} - The folder object or null if not found.
 */
function getSheetFolder() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetFile = DriveApp.getFileById(sheet.getId());
  const parents = sheetFile.getParents();
  return parents.hasNext() ? parents.next() : null;
}
/**
 * Searches for a GPX file matching the given filename pattern within a folder.
 * @param {GoogleAppsScript.Drive.Folder} folder - The Drive folder to search in.
 * @param {string} pattern - The filename pattern to match (prefix-based).
 * @returns {GoogleAppsScript.Drive.File|null} - The first matching file or null if not found.
 */
function findFileByPattern(folder, pattern) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    if (file.getName().startsWith(pattern)) return file; // ✅ Return first match immediately
  }
  Logger.log(`❌ No matching file found: ${pattern}`);
  return null;
}
