/**
 * Builds a flight plan from parsed GPX route data.
 * @param {Object} parsedGPXData - The parsed GPX data containing route points.
 * @returns {FlightPlan} - The constructed flight plan.
 */
function buildFlightPlan(parsedGPXData) {
  logDebug("✈️ Starting Flight Plan Construction...");

  const flightPlan = new FlightPlan();
  const state = {
    currentRoute: null,
    previousAirfield: null,
    previousWaypoint: null,
    airfieldMap: new Map(),
    waypointMap: new Map(),
  };

  parsedGPXData.routePoints.forEach((point, index) => {
    logDebug(`🔄 Processing Point #${index + 1}: ${JSON.stringify(point)}`);
    processRoutePoint(point, state, flightPlan);
  });

  logDebug(`✅ Flight Plan Built: ${flightPlan.routes.length} routes.`);
  logDebug(`📝 Final Flight Plan Name: ${flightPlan.name}`);

  if (DEBUG_MODE) {
    logFlightPlan(flightPlan); // ✅ Now logs flight plan in a structured format
  }

  return flightPlan;
}

/**
 * Processes a route point and updates the flight plan accordingly.
 * @param {Object} point - A route point from parsed GPX data.
 * @param {Object} state - The current flight plan building state.
 * @param {FlightPlan} flightPlan - The flight plan being constructed.
 */
function processRoutePoint(point, state, flightPlan) {
  if (isAirfield(point.name)) {
    logDebug(`🏁 Detected Airfield: ${point.name}`);
    handleAirfield(point, state, flightPlan);
  } else {
    logDebug(`📍 Processing Waypoint: ${point.name}`);
    handleWaypoint(point, state);
  }
}

/**
 * Handles airfield detection, avoids duplicates, and adds to the flight plan.
 * @param {Object} point - The airfield route point.
 * @param {Object} state - The current flight plan building state.
 * @param {FlightPlan} flightPlan - The flight plan being constructed.
 */
function handleAirfield(point, state, flightPlan) {
  let airfield = state.airfieldMap.get(point.name);

  if (!airfield) {
    airfield = parseAirfield(point);
    state.airfieldMap.set(point.name, airfield);
    logDebug(`🛬 Created New Airfield: ${JSON.stringify(airfield)}`);
  } else {
    logDebug(`🔄 Reusing Existing Airfield: ${airfield.fullDesignator}`);
  }

  flightPlan.addAirfield(airfield);

  if (!state.currentRoute) {
    logDebug(`🚀 Starting First Route from ${airfield.fullDesignator}`);
    state.currentRoute = new Route(airfield);
  } else {
    logDebug(
      `🛫 Route Completed: ${state.currentRoute.departureAirfield.fullDesignator} ➝ ${airfield.fullDesignator}`
    );
    state.currentRoute.setArrivalAirfield(airfield);
    flightPlan.addRoute(state.currentRoute);

    logDebug(`🚀 Starting New Route from ${airfield.fullDesignator}`);
    state.currentRoute = new Route(airfield);
  }

  state.previousAirfield = airfield;
  state.previousWaypoint = null;
}

/**
 * Handles waypoints and creates legs when appropriate, avoiding duplicates.
 * @param {Object} point - The waypoint route point.
 * @param {Object} state - The current flight plan building state.
 */
function handleWaypoint(point, state) {
  let waypoint = state.waypointMap.get(point.name);

  if (!waypoint) {
    waypoint = new Waypoint(
      point.name,
      point.latitude,
      point.longitude,
      point.magneticVariation
    );
    state.waypointMap.set(point.name, waypoint);
    logDebug(`📍 Created New Waypoint: ${JSON.stringify(waypoint)}`);
  } else {
    logDebug(`🔄 Reusing Existing Waypoint: ${waypoint.name}`);
  }

  if (state.previousWaypoint) {
    // ✅ Convert altitude to feet only when creating the Leg
    const legAltitudeFeet = convertMetersToFeet(
      state.previousWaypoint.elevation
    );
    const leg = new Leg(state.previousWaypoint, waypoint, legAltitudeFeet);
    logDebug(`🔗 Created Leg: ${leg.name} (Altitude: ${leg.altitude} ft)`);
    state.currentRoute.addLeg(leg);
  }

  // ✅ Store original elevation in meters (useful for reference or debugging)
  waypoint.elevation = point.elevation;
  state.previousWaypoint = waypoint;
}

/**
 * Checks if a route point is an airfield based on naming convention.
 * @param {string} routePointName - The name of the route point.
 * @returns {boolean} - True if the route point is an airfield.
 */
function isAirfield(routePointName) {
  return /^[A-Z]{4} - /.test(routePointName);
}

/**
 * Parses an airfield name into an `Airfield` object.
 * @param {Object} routePoint - The route point containing the airfield name.
 * @returns {Airfield} - Parsed airfield object.
 */
function parseAirfield(routePoint) {
  const match = routePoint.name.match(/^([A-Z]{4}) - (.+)$/);
  if (!match) throw new Error(`Invalid airfield format: ${routePoint.name}`);

  const airfield = new Airfield(
    match[1],
    match[2],
    routePoint.latitude,
    routePoint.longitude
  );
  logDebug(`✅ Parsed Airfield: ${JSON.stringify(airfield)}`);
  return airfield;
}
