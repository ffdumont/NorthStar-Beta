function testFetchWeatherData() {
  const lat = 48.9917;
  const lon = 1.9097;

  // ✅ Retrieve offBlockDateTime from the flight plan
  const flightPlan = new FlightPlan();
  const offBlockDateTime = flightPlan.offBlockDateTime;

  if (offBlockDateTime) {
    const temperature = fetchWeatherData(
      lat,
      lon,
      offBlockDateTime,
      "temperature_2m"
    );
    const pressure = fetchWeatherData(
      lat,
      lon,
      offBlockDateTime,
      "pressure_msl"
    );

    logDebug(
      `🌡️ Temperature at off-block time (${offBlockDateTime.toISOString()}): ${temperature}°C`
    );
    logDebug(
      `🌬️ Pressure at off-block time (${offBlockDateTime.toISOString()}): ${pressure} hPa`
    );
  } else {
    logDebug("❌ Off-block date/time is not set. Cannot fetch weather data.");
  }
}
