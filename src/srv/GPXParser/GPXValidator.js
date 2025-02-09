function validateGPXFile(gpxString) {
  const xmlDoc = XmlService.parse(gpxString).getRootElement();

  const namespaceURI = xmlDoc.getNamespace()?.getURI();
  const creatorValue = xmlDoc.getAttribute("creator")?.getValue()?.trim();

  Logger.log(`🛠️ Namespace URI: ${namespaceURI}`);
  Logger.log(`🛠️ Creator: ${creatorValue}`);

  const isValid =
    namespaceURI === "http://www.topografix.com/GPX/1/1" &&
    creatorValue?.toLowerCase().includes("skydreamsoft");

  if (!isValid)
    Logger.log("❌ Invalid GPX file: Incorrect namespace or creator");

  return isValid;
}
