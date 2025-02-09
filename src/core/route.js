class Route {
  constructor(departureAirfield) {
    this.departureAirfield = departureAirfield;
    this.arrivalAirfield = null; // Set later when found
    this.legs = [];
  }

  setArrivalAirfield(airfield) {
    this.arrivalAirfield = airfield;
  }

  addLeg(leg) {
    this.legs.push(leg);
  }
}
