class Leg {
  constructor(fromWaypoint, toWaypoint, altitude) {
    this.fromWaypoint = fromWaypoint;
    this.toWaypoint = toWaypoint;
    this.name = `${fromWaypoint.name} - ${toWaypoint.name}`;
    this.altitude = altitude;
  }
}
