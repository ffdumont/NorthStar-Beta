/**
 * Orchestrates the entire flight plan processing workflow.
 * Steps include:
 * 1. Loading and parsing the GPX file.
 * 2. Fetching weather data for each leg's midpoint.
 * 3. Calculating legs' altitude pressure.
 * 4. Fetching wind data for each leg.
 *
 * @returns {Object|null} - The processed flight plan or null if any step fails.
 */
function orchestrateFlightPlanProcessing() {
  logDebug("🚀 Starting Flight Plan Processing...");

  // ✅ Step 1: Load and parse GPX
  const gpxString = loadGPXFile() || exitProcess("❌ GPX file not found.");
  const parsedGPXData =
    validateAndParseGPX(gpxString) || exitProcess("❌ GPX validation failed.");
  const flightPlan = buildAndLogFlightPlan(parsedGPXData);

  // ✅ Step 2: Fetch weather data for each leg
  fetchWeatherForLegs(flightPlan);
  logDebug("✅ GPX Processing Completed Successfully!");

  // ✅ Step 3: Calculate legs' altitude pressure
  flightPlan.routes = calculateLegAltitudePressure(flightPlan.routes);

  // ✅ Step 4: Fetch wind data for each leg
  flightPlan.routes = updateRoutesWindData(
    flightPlan.routes,
    flightPlan.offBlockDateTime
  );

  logDebug("✅ Flight plan processing complete!");
  return flightPlan;
}

/**
 * Logs an error and exits the process.
 * @param {string} message - The error message to log.
 * @returns {null} - Always returns null to stop execution.
 */
function exitProcess(message) {
  logDebug(message);
  return null;
}

/**
 * Loads the GPX file from Google Drive.
 * @returns {string|null} - GPX content as string or null if not found.
 */
function loadGPXFile() {
  const gpxFile = findGPXFileInDriveFromSettings();
  if (!gpxFile) {
    logDebug("❌ No valid GPX file found.");
    return null;
  }

  logDebug(`📂 GPX File Found: ${gpxFile.getName()}`);
  return gpxFile.getBlob().getDataAsString();
}

/**
 * Validates and parses GPX content.
 * @param {string} gpxString - Raw GPX XML content.
 * @returns {Object|null} - Parsed GPX data or null if validation fails.
 */
function validateAndParseGPX(gpxString) {
  if (!validateGPXFile(gpxString)) {
    logDebug("❌ GPX validation failed.");
    return null;
  }

  logDebug("✅ GPX file is valid!");
  const parsedGPXData = parseGPX(gpxString);
  logDebug(`🛠️ Parsed ${parsedGPXData.routePoints.length} route points.`);
  return parsedGPXData;
}

/**
 * Builds the flight plan from parsed GPX data and logs results.
 * @param {Object} parsedGPXData - Parsed GPX data.
 * @returns {Object} - The built flight plan.
 */
function buildAndLogFlightPlan(parsedGPXData) {
  const flightPlan = buildFlightPlan(parsedGPXData);
  logDebug(`✈️ Flight plan built with ${flightPlan.routes.length} routes.`);
  return flightPlan;
}

/**
 * Fetches weather data for each leg's midpoint at the off-block time.
 *
 * @param {Object} flightPlan - The flight plan containing legs.
 */
function fetchWeatherForLegs(flightPlan) {
  const offBlockDateTime = flightPlan.offBlockDateTime;
  if (!offBlockDateTime) {
    logDebug("❌ Off-block time not set. Skipping weather retrieval.");
    return;
  }

  logDebug("🌦️ Fetching weather data for each leg's midpoint...");

  flightPlan.routes.forEach((route) => {
    route.legs.forEach((leg) => {
      if (!leg.midpoint) {
        logDebug(`⚠️ Skipping leg ${leg.name}, missing midpoint.`);
        return;
      }

      const { latitude, longitude } = leg.midpoint;

      // ✅ Fetch temperature and pressure for leg's midpoint at off-block time
      leg.temperature_2m = fetchWeatherData(
        latitude,
        longitude,
        offBlockDateTime,
        "temperature_2m"
      );
      leg.pressure_msl = fetchWeatherData(
        latitude,
        longitude,
        offBlockDateTime,
        "pressure_msl"
      );

      logDebug(
        `🌡️ Leg ${leg.name} → Temp: ${leg.temperature_2m}°C, Pressure: ${leg.pressure_msl} hPa`
      );
    });
  });

  logDebug("✅ Weather data retrieval complete.");
}
