/**
 * Checks if a route point is an airfield based on naming convention.
 * @param {string} routePointName - The name of the route point.
 * @returns {boolean} - True if it's an airfield.
 */
function isAirfield(routePointName) {
  return /^[A-Z]{4} - /.test(routePointName); // Matches "LFXU - LES MUREAUX"
}

/**
 * Parses an airfield name into an `Airfield` object.
 * @param {Object} routePoint - Route point containing the airfield name.
 * @returns {Airfield} - Parsed airfield object.
 */
function parseAirfield(routePoint) {
  const match = routePoint.name.match(/^([A-Z]{4}) - (.+)$/);
  if (!match) throw new Error(`Invalid airfield format: ${routePoint.name}`);

  return new Airfield(
    match[1],
    match[2],
    routePoint.latitude,
    routePoint.longitude
  );
}

function convertMetersToFeet(meters) {
  return Math.round(meters * 3.28084);
}
