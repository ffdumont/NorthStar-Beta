/**
 * Calculates the altitude pressure for each leg in all routes.
 * Iterates through each route and updates the altitude pressure for each leg.
 *
 * @param {Array} routes - The list of routes in the flight plan.
 * @returns {Array} - The updated list of routes with calculated altitude pressures.
 */
function calculateLegAltitudePressure(routes) {
  if (!Array.isArray(routes)) {
    console.error(
      "❌ Error: 'routes' is not an array or is undefined.",
      routes
    );
    return [];
  }

  console.log(`🔄 Calculating altitude pressure for ${routes.length} routes.`);
  return routes.map(updateRouteLegs);
}

/**
 * Updates the altitude pressure for all legs in a route.
 *
 * @param {Object} route - The route object containing legs.
 * @returns {Object} - The updated route with altitude pressures added to each leg.
 */
function updateRouteLegs(route) {
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
    legs: route.legs.map(updateLegPressure),
  };
}

/**
 * Updates the altitude pressure for a single leg.
 *
 * @param {Object} leg - The leg object to update with altitude pressure.
 * @returns {Object} - The updated leg with calculated altitude pressure.
 */
function updateLegPressure(leg) {
  const { altitude, pressure_msl: qnh } = leg;

  if (altitude === undefined || qnh === undefined) {
    console.warn("⚠️ Warning: Missing altitude or pressure_msl for leg:", leg);
    return { ...leg, altitudePressure: null };
  }

  const altitudePressure = calculateAltitudePressure(altitude, qnh);
  console.log(
    `📏 Calculated altitudePressure for altitude ${altitude} ft: ${altitudePressure} hPa`
  );

  return {
    ...leg,
    altitudePressure,
  };
}

/**
 * Calculates the pressure at a given altitude using the barometric formula.
 *
 * @param {number} altitude - The altitude in feet.
 * @param {number} qnh - The sea level pressure in hPa (QNH).
 * @returns {number} - The calculated pressure at the given altitude.
 */
function calculateAltitudePressure(altitude, qnh) {
  const T0 = 288.15; // Standard sea level temperature in Kelvin
  const L = 0.0065; // Standard temperature lapse rate in K/m
  const exponent = 5.256; // Derived from ISA

  const altitudeM = altitude * 0.3048; // Convert feet to meters
  const pressure = qnh * Math.pow(1 - (L * altitudeM) / T0, exponent);

  return Number(pressure.toFixed(2)); // Return numeric value with 2 decimal places
}

/**
 * Rounds a given pressure to the nearest standard atmospheric level.
 *
 * @param {number} pressure - The pressure in hPa to be rounded.
 * @returns {number} - The nearest standard pressure level.
 */
function roundToNearestPressure(pressure) {
  const pressureLevels = [
    1000, 950, 925, 900, 850, 800, 750, 700, 650, 600, 550, 500, 450, 400, 350,
    300, 275, 250, 225, 200, 175, 150, 125, 100, 70, 50, 30, 20, 10,
  ];

  const rounded = pressureLevels.reduce((prev, curr) =>
    Math.abs(curr - pressure) < Math.abs(prev - pressure) ? curr : prev
  );

  console.log(
    `🔄 Rounded ${pressure} hPa to nearest standard level: ${rounded} hPa`
  );
  return rounded;
}
