/**
 * Calculates the atmospheric pressure at a given altitude using the barometric formula.
 * This function assumes standard atmospheric conditions based on the International Standard Atmosphere (ISA).
 *
 * @param {number} altitudeFt - The altitude in feet.
 * @param {number} qnh - The sea level pressure in hPa (QNH).
 * @returns {number} - The calculated pressure at the given altitude in hPa, rounded to two decimal places.
 */
function calculateAltitudePressure(altitudeFt, qnh) {
  // Constants based on the International Standard Atmosphere (ISA)
  const T0 = 288.15; // Standard sea level temperature in Kelvin
  const L = 0.0065; // Standard temperature lapse rate in K/m
  const exponent = 5.256; // Derived from ISA

  // Convert altitude from feet to meters
  let altitudeM = altitudeFt * 0.3048;

  // Validate input values
  if (isNaN(altitudeFt) || isNaN(qnh) || altitudeFt < 0 || qnh <= 0) {
    console.warn(
      `⚠️ Invalid input for altitude or QNH: altitudeFt=${altitudeFt}, qnh=${qnh}`
    );
    return null;
  }

  // Apply the barometric formula
  let pressure = qnh * Math.pow(1 - (L * altitudeM) / T0, exponent);
  let roundedPressure = Number(pressure.toFixed(2)); // Ensure numeric output with two decimal places

  console.log(
    `📏 Calculated altitude pressure: Altitude = ${altitudeFt} ft, QNH = ${qnh} hPa → ${roundedPressure} hPa`
  );

  return roundedPressure;
}
