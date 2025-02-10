/**
 * Updates wind data for all routes in the flight plan.
 * Iterates through each route and updates wind information for each leg.
 *
 * @param {Array} routes - The list of routes in the flight plan.
 * @param {Date} dateTime - The date and time for retrieving wind data.
 * @returns {Array} - The updated list of routes with wind data added.
 */
function updateRoutesWindData(routes, dateTime) {
  if (!Array.isArray(routes)) {
    console.error(
      "❌ Error: 'routes' is not an array or is undefined.",
      routes
    );
    return [];
  }

  console.log(
    `🔄 Updating wind data for ${routes.length} routes at ${dateTime}`
  );
  return routes.map(updateRouteWindData.bind(null, dateTime));
}

/**
 * Updates wind data for a single route by processing each leg.
 *
 * @param {Date} dateTime - The date and time for retrieving wind data.
 * @param {Object} route - The route object containing legs.
 * @returns {Object} - The updated route with wind data added to each leg.
 */
function updateRouteWindData(dateTime, route) {
  if (!Array.isArray(route.legs)) {
    console.warn(
      "⚠️ Warning: 'legs' is not an array or undefined in route:",
      route
    );
    return route;
  }

  console.log(`🔹 Processing route: ${route.name}, Legs: ${route.legs.length}`);
  return {
    ...route,
    legs: route.legs.map(updateLegWindData.bind(null, dateTime)),
  };
}

/**
 * Updates wind data for a single leg by fetching wind speed and direction.
 *
 * @param {Date} dateTime - The date and time for retrieving wind data.
 * @param {Object} leg - The leg object to update with wind data.
 * @returns {Object} - The updated leg with wind data added.
 */
function updateLegWindData(dateTime, leg) {
  if (!leg.midpoint) {
    console.warn("⚠️ Warning: Missing midpoint data for leg:", leg);
    return { ...leg, windSpeed: null, windDirection: null };
  }

  const { latitude, longitude, altitudePressure } = leg.midpoint;
  const roundedPressure = roundToNearestPressure(altitudePressure);

  // Define API variables for wind data retrieval
  const windSpeedVar = `wind_speed_${roundedPressure}hPa`;
  const windDirectionVar = `wind_direction_${roundedPressure}hPa`;

  console.log(
    `📍 Fetching wind data for leg at midpoint: Lat ${latitude}, Lon ${longitude}, Pressure ${roundedPressure} hPa`
  );

  // Fetch wind speed and direction
  const windSpeed = fetchWeatherData(
    latitude,
    longitude,
    dateTime,
    windSpeedVar
  );
  const windDirection = fetchWeatherData(
    latitude,
    longitude,
    dateTime,
    windDirectionVar
  );

  console.log(
    `✅ Wind Data: Speed = ${windSpeed} km/h, Direction = ${windDirection}°`
  );

  return {
    ...leg,
    windSpeed,
    windDirection,
  };
}
