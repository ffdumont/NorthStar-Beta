const DEBUG_MODE = true; // Set to false to disable debug logs

function parseGPX(gpxString) {
  logDebug("📥 Starting GPX Parsing...");

  const xmlDoc = XmlService.parse(gpxString).getRootElement();
  logDebug(`📜 Parsed XML Root: ${xmlDoc.getName()}`);

  const metadata = extractMetadata(xmlDoc);
  const routePoints = extractRoutePoints(xmlDoc);

  logDebug(`🛠️ Extracted ${routePoints.length} route points.`);
  return { metadata, routePoints };
}

/**
 * Extracts route points (`rtept`) from GPX.
 * Ignores `<wpt>` since `rtept` already contains the correct sequence.
 */
function extractRoutePoints(xmlDoc) {
  const routeElement = xmlDoc.getChild("rte");
  if (!routeElement) {
    logDebug("❌ No <rte> (route) element found in GPX.");
    return [];
  }

  const routePoints = routeElement.getChildren("rtept").map(parseRoutePoint);
  logDebug(`🗺️ Found ${routePoints.length} route points.`);
  return routePoints;
}

/**
 * Parses a single route point.
 */
function extractRoutePoints(xmlDoc) {
  const namespace = xmlDoc.getNamespace();
  const routeElement = xmlDoc.getChild("rte", namespace);

  if (!routeElement) {
    logDebug(
      `❌ No <rte> (route) element found in GPX. Available elements: ${xmlDoc
        .getChildren()
        .map((e) => e.getName())}`
    );
    return [];
  }

  const routePoints = routeElement
    .getChildren("rtept", namespace)
    .map(parseRoutePoint);
  logDebug(`🗺️ Found ${routePoints.length} route points.`);
  return routePoints;
}

/**
 * Parses a single route point into an object.
 * @param {GoogleAppsScript.XML_Service.Element} rtept - The route point element.
 * @returns {Object} - Parsed route point.
 */
function parseRoutePoint(rtept) {
  const namespace = rtept.getNamespace(); // Get namespace for child elements

  const point = {
    name: rtept.getChildText("name", namespace) || "Unnamed",
    latitude: parseFloat(rtept.getAttribute("lat")?.getValue()),
    longitude: parseFloat(rtept.getAttribute("lon")?.getValue()),
    elevation: parseFloat(rtept.getChildText("ele", namespace) || 0),
    magneticVariation: parseFloat(rtept.getChildText("magvar", namespace) || 0),
  };

  logDebug(`📍 Parsed Route Point: ${JSON.stringify(point)}`);
  return point;
}

/**
 * Extracts metadata (creation date) from GPX.
 */
function extractMetadata(xmlDoc) {
  const namespace = xmlDoc.getNamespace(); // Get the GPX namespace
  const metadataElement = xmlDoc.getChild("metadata", namespace);

  if (!metadataElement) {
    logDebug("❌ Metadata element not found in GPX.");
    return { creationDate: "Unknown" };
  }

  const creationDate =
    metadataElement.getChildText("time", namespace) || "Unknown";
  logDebug(`📅 Extracted Creation Date: ${creationDate}`);

  return { creationDate };
}

/**
 * Logs messages only when DEBUG_MODE is enabled.
 */
function logDebug(message) {
  if (DEBUG_MODE) Logger.log(message);
}
