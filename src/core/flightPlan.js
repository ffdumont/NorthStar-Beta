class FlightPlan {
  constructor() {
    this.routes = [];
    this.airfields = [];
    this.name = "";
    this.offBlockDateTime = this.getOffBlockDateTime(); // ✅ Retrieve off-block time on creation
  }

  /**
   * Adds a route to the flight plan.
   * @param {Route} route - The route to add.
   */
  addRoute(route) {
    this.routes.push(route);
  }

  /**
   * Adds an airfield to the flight plan, allowing multiple visits.
   * Updates the flight plan name dynamically.
   * @param {Airfield} airfield - The airfield to add.
   */
  addAirfield(airfield) {
    this.airfields.push(airfield);
    this.updateFlightPlanName();
    logDebug(`✈️ Added Airfield to FlightPlan: ${airfield.fullDesignator}`);
  }

  /**
   * Generates the flight plan name based on the actual sequence of visited airfields.
   */
  updateFlightPlanName() {
    this.name = this.airfields.map((a) => a.shortDesignator).join("-");
    logDebug(`📝 Updated Flight Plan Name: ${this.name}`);
  }

  /**
   * Retrieves the off-block date and time from the "Settings" sheet.
   * @returns {Date|null} - The off-block date/time or null if not found.
   */
  getOffBlockDateTime() {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
    if (!sheet) {
      logDebug("❌ 'Settings' sheet not found.");
      return null;
    }

    const value = sheet.getRange("offBlockDateTime").getValue();
    return value instanceof Date
      ? value
      : (logDebug("❌ Invalid off-block date/time."), null);
  }
}
