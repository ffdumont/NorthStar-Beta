class Airfield {
  constructor(fullDesignator, fullName, latitude, longitude) {
    this.fullDesignator = fullDesignator; // e.g., LFXU
    this.shortDesignator = fullDesignator.slice(2, 4); // e.g., XU
    this.fullName = fullName; // e.g., "LES MUREAUX"
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
