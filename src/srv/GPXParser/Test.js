/**
 * Runs tests for GPX file retrieval.
 * Validates whether the correct file is found or logs an error if missing.
 */
function testGPXFileFinder() {
  Logger.log("=== Running GPX File Finder Tests ===");

  const file = findGPXFileInDriveFromSettings();
  Logger.log(
    file ? `✅ Found file: ${file.getName()}` : "❌ No unique GPX file found."
  );

  Logger.log("✅ All tests completed.");
}
