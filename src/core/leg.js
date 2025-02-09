class Leg {
  constructor(fromWaypoint, toWaypoint, altitudeMeters) {
    this.fromWaypoint = fromWaypoint;
    this.toWaypoint = toWaypoint;
    this.name = `${fromWaypoint.name} - ${toWaypoint.name}`;
    this.altitudeFeet = convertMetersToFeet(altitudeMeters);
  }
}
