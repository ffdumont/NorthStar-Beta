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
/**
 * Logs the flight plan in a readable format.
 * @param {FlightPlan} flightPlan - The flight plan to log.
 */
function logFlightPlan(flightPlan) {
  logDebug("📝 ======= FLIGHT PLAN SUMMARY =======");
  logDebug(`✈️ Flight Plan Name: ${flightPlan.name}`);
  logDebug(
    `🛬 Airfields Visited: ${flightPlan.airfields
      .map((a) => a.fullDesignator)
      .join(" → ")}`
  );
  logDebug(`📍 Number of Routes: ${flightPlan.routes.length}`);

  flightPlan.routes.forEach((route, index) => {
    logDebug(
      `\n🔹 Route #${index + 1}: ${route.departureAirfield.fullDesignator} ➝ ${
        route.arrivalAirfield.fullDesignator
      }`
    );
    logDebug(
      `   🛫 Departure: ${route.departureAirfield.fullName} (${route.departureAirfield.fullDesignator})`
    );
    logDebug(
      `   🛬 Arrival: ${route.arrivalAirfield.fullName} (${route.arrivalAirfield.fullDesignator})`
    );
    logDebug(`   🛤️ Number of Legs: ${route.legs.length}`);

    route.legs.forEach((leg, legIndex) => {
      logDebug(
        `      🔗 Leg #${legIndex + 1}: ${leg.fromWaypoint.name} ➝ ${
          leg.toWaypoint.name
        } (Alt: ${leg.altitudeFeet} ft)`
      );
    });
  });

  logDebug("📝 ======= END OF FLIGHT PLAN =======");
}
