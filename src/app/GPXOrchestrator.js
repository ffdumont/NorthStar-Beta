function orchestrateGPXProcessing() {
  Logger.log("🚀 Starting GPX Processing...");

  const gpxString = loadGPXFile() || exitProcess("❌ GPX file not found.");
  const parsedGPXData =
    validateAndParseGPX(gpxString) || exitProcess("❌ GPX validation failed.");
  const flightPlan = buildAndLogFlightPlan(parsedGPXData);

  Logger.log("✅ GPX Processing Completed Successfully!");
  return flightPlan;
}

/**
 * Logs an error and exits the process.
 * @param {string} message - The error message to log.
 * @returns {null} - Always returns null to stop execution.
 */
function exitProcess(message) {
  Logger.log(message);
  return null;
}

/**
 * Loads the GPX file from Google Drive.
 * @returns {string|null} - GPX content as string or null if not found.
 */
function loadGPXFile() {
  const gpxFile = findGPXFileInDriveFromSettings();
  if (!gpxFile) {
    Logger.log("❌ No valid GPX file found.");
    return null;
  }

  Logger.log(`📂 GPX File Found: ${gpxFile.getName()}`);
  return gpxFile.getBlob().getDataAsString();
}

/**
 * Validates and parses GPX content.
 * @param {string} gpxString - Raw GPX XML content.
 * @returns {Object|null} - Parsed GPX data or null if validation fails.
 */
function validateAndParseGPX(gpxString) {
  if (!validateGPXFile(gpxString)) {
    Logger.log("❌ GPX validation failed.");
    return null;
  }

  Logger.log("✅ GPX file is valid!");
  const parsedGPXData = parseGPX(gpxString);
  Logger.log(`🛠️ Parsed ${parsedGPXData.routePoints.length} route points.`);
  return parsedGPXData;
}

/**
 * Builds the flight plan from parsed GPX data and logs results.
 * @param {Object} parsedGPXData - Parsed GPX data.
 * @returns {FlightPlan} - The built flight plan.
 */
function buildAndLogFlightPlan(parsedGPXData) {
  const flightPlan = buildFlightPlan(parsedGPXData);
  Logger.log(`✈️ Flight plan built with ${flightPlan.routes.length} routes.`);
  return flightPlan;
}
