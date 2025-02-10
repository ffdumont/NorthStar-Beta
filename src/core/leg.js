class Leg {
  /**
   * Creates a new Leg between two waypoints.
   * @param {Waypoint} fromWaypoint - The starting waypoint.
   * @param {Waypoint} toWaypoint - The ending waypoint.
   * @param {number} altitude - The altitude of the leg (already converted to feet).
   */
  constructor(fromWaypoint, toWaypoint, altitude) {
    this.fromWaypoint = fromWaypoint;
    this.toWaypoint = toWaypoint;
    this.name = `${fromWaypoint.name} ➝ ${toWaypoint.name}`;
    this.altitude = altitude;

    // Compute additional properties
    this.midpoint = this.computeMidpoint();
    this.lengthNM = this.computeLegLengthNM();
    this.trueHeading = this.computeTrueHeading();
    this.magneticVariation = this.computeMagneticVariation(); // ✅ NEW
  }

  /**
   * Computes the geographic midpoint of the leg.
   * @returns {{latitude: number, longitude: number}}
   */
  computeMidpoint() {
    const lat1 = this.degToRad(this.fromWaypoint.latitude);
    const lon1 = this.degToRad(this.fromWaypoint.longitude);
    const lat2 = this.degToRad(this.toWaypoint.latitude);
    const lon2 = this.degToRad(this.toWaypoint.longitude);

    const Bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
    const By = Math.cos(lat2) * Math.sin(lon2 - lon1);

    const midLat = Math.atan2(
      Math.sin(lat1) + Math.sin(lat2),
      Math.sqrt((Math.cos(lat1) + Bx) ** 2 + By ** 2)
    );
    const midLon = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

    return {
      latitude: this.radToDeg(midLat),
      longitude: this.radToDeg(midLon),
    };
  }

  /**
   * Computes the length of the leg in nautical miles using the Haversine formula.
   * @returns {number}
   */
  computeLegLengthNM() {
    const R = 3440.065; // Earth radius in nautical miles
    const lat1 = this.degToRad(this.fromWaypoint.latitude);
    const lon1 = this.degToRad(this.fromWaypoint.longitude);
    const lat2 = this.degToRad(this.toWaypoint.latitude);
    const lon2 = this.degToRad(this.toWaypoint.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in nautical miles
  }

  /**
   * Computes the true heading (initial bearing) from the starting waypoint to the destination.
   * @returns {number}
   */
  computeTrueHeading() {
    const lat1 = this.degToRad(this.fromWaypoint.latitude);
    const lon1 = this.degToRad(this.fromWaypoint.longitude);
    const lat2 = this.degToRad(this.toWaypoint.latitude);
    const lon2 = this.degToRad(this.toWaypoint.longitude);

    const dLon = lon2 - lon1;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    return (this.radToDeg(Math.atan2(y, x)) + 360) % 360; // Normalize to 0-360
  }

  /**
   * Computes the magnetic variation for the leg as the average of its waypoints.
   * @returns {number}
   */
  computeMagneticVariation() {
    return (
      (this.fromWaypoint.magneticVariation +
        this.toWaypoint.magneticVariation) /
      2
    );
  }

  /**
   * Converts degrees to radians.
   * @param {number} degrees
   * @returns {number}
   */
  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Converts radians to degrees.
   * @param {number} radians
   * @returns {number}
   */
  radToDeg(radians) {
    return radians * (180 / Math.PI);
  }
}
