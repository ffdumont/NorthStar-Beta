/**
 * Represents a complete flight plan with routes and airfields.
 */
class FlightPlan {
  constructor() {
    /** @type {Route[]} Stores all routes in the flight plan. */
    this.routes = [];

    /** @type {Airfield[]} Stores unique airfields visited during the flight. */
    this.airfields = [];

    /** @type {string} The computed name of the flight plan, based on airfield short designators. */
    this.name = "";
  }

  /**
   * Adds a route to the flight plan.
   * @param {Route} route - The route to add.
   */
  addRoute(route) {
    this.routes.push(route);
  }

  /**
   * Adds an airfield to the flight plan, ensuring uniqueness.
   * Updates the flight plan name dynamically.
   * @param {Airfield} airfield - The airfield to add.
   */
  addAirfield(airfield) {
    this.airfields.push(airfield);
    this.updateFlightPlanName();

    logDebug(`✈️ Added Airfield to FlightPlan: ${airfield.fullDesignator}`);
  }

  /**
   * Generates the flight plan name by chaining all airfield short designators.
   */
  updateFlightPlanName() {
    this.name = this.airfields.map((a) => a.shortDesignator).join("-");
    logDebug(`📝 Updated Flight Plan Name: ${this.name}`);
  }
}
