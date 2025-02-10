/**
 * Fetches weather data for a given latitude, longitude, and date/time.
 * Calls the weather API, retrieves the response, and extracts the required variable.
 *
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @param {Date} dateTime - Date and time to retrieve data for.
 * @param {string} variable - The weather variable to fetch (e.g., "wind_speed_950hPa").
 * @returns {number|null} - The closest hourly weather value or null if not found.
 */
function fetchWeatherData(latitude, longitude, dateTime, variable) {
  const url = buildWeatherApiUrl(latitude, longitude, dateTime, variable);
  logDebug(`🌍 Fetching weather data from: ${url}`);

  const data = fetchWeatherApiResponse(url);
  if (!data) {
    logDebug(`❌ No data returned from API for variable: ${variable}`);
    return null;
  }

  const value = extractWeatherValue(data, dateTime, variable);
  logDebug(`✅ Extracted ${variable}: ${value}`);
  return value;
}

/**
 * Constructs the Open-Meteo API URL for the requested location, date, and variable.
 *
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @param {Date} dateTime - Date to retrieve data for.
 * @param {string} variable - The requested weather variable.
 * @returns {string} - The constructed API URL.
 */
function buildWeatherApiUrl(latitude, longitude, dateTime, variable) {
  const dateStr = dateTime.toISOString().split("T")[0]; // Extract YYYY-MM-DD
  return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${variable}&wind_speed_unit=kn&start_date=${dateStr}&end_date=${dateStr}&models=meteofrance_seamless`;
}

/**
 * Fetches and parses the weather API response.
 *
 * @param {string} url - The API endpoint to fetch data from.
 * @returns {Object|null} - The parsed JSON response or null if the request fails.
 */
function fetchWeatherApiResponse(url) {
  try {
    const response = UrlFetchApp.fetch(url);
    const jsonResponse = JSON.parse(response.getContentText());
    logDebug(`✅ API response received successfully.`);
    return jsonResponse;
  } catch (error) {
    logDebug(`❌ Weather API request failed: ${error.message}`);
    return null;
  }
}

/**
 * Extracts the requested weather variable from the API response.
 * Searches for the closest available hourly weather data.
 *
 * @param {Object} data - The API response JSON.
 * @param {Date} dateTime - The requested time.
 * @param {string} variable - The weather variable to extract (e.g., "wind_speed_950hPa").
 * @returns {number|null} - The closest hourly weather value or null if not found.
 */
function extractWeatherValue(data, dateTime, variable) {
  const roundedHour = roundToClosestHour(dateTime);
  const timeIndex = data.hourly?.time?.findIndex((timeStr) =>
    timeStr.endsWith(`T${roundedHour}:00`)
  );

  if (timeIndex !== -1) {
    const value = data.hourly?.[variable]?.[timeIndex] ?? null;
    if (value !== null) {
      logDebug(`✅ Found ${variable} for ${roundedHour}:00 → ${value}`);
    } else {
      logDebug(`⚠️ No value available for ${variable} at ${roundedHour}:00`);
    }
    return value;
  } else {
    logDebug(`❌ No weather data found for ${variable} at ${roundedHour}:00`);
    return null;
  }
}

/**
 * Rounds a given Date object to the closest hour.
 * If the minutes are ≥30, rounds up to the next hour.
 *
 * @param {Date} dateTime - The date and time to round.
 * @returns {string} - The rounded hour as "HH" (24-hour format).
 */
function roundToClosestHour(dateTime) {
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const roundedHour = minutes >= 30 ? hours + 1 : hours;
  return String(roundedHour).padStart(2, "0");
}

/**
 * Logs debugging messages with a timestamp.
 * Useful for monitoring and debugging API calls and data extraction.
 *
 * @param {string} message - The message to log.
 */
function logDebug(message) {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
}
