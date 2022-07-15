/**
 * A class that represents the Region object.
 * @classdesc A class that represents the Region object.
 * @constructs Region
 * @param {number} date The datetime stamp.
 * @param {boolean} didEnter A boolean value indicating whether the region was entered.
 * @param {string} identifier An alphanumeric unique identifier for the region.
 * @param {number} latitude The latitude of the region.
 * @param {number} longitude The longitude of the region.
 * @param {number} radius The radius of the region in meters.
 * @param {boolean} frompositiondetection Determines whether the user's cuurent position is inside the region.
 */
class Region {
  Date: number;
  Didenter: boolean;
  Identifier: string;
  Latitude: number;
  Longitude: number;
  Radius: number;
  Frompositiondetection: boolean;
  constructor(
    date: number,
    didenter: boolean,
    identifier: string,
    latitude: number,
    longitude: number,
    radius: number,
    frompositiondetection: boolean
  ) {
    this.Date = date;
    this.Didenter = didenter;
    this.Identifier = identifier;
    this.Latitude = latitude;
    this.Longitude = longitude;
    this.Radius = radius;
    this.Frompositiondetection = frompositiondetection;
  }
  /**
   * Converts json object to an object of type Region.
   * @param {Object} json The json representation of the region.
   * @returns Object
   * @memberof Region
   */
  static jsonToObj(json: any) {
    return new Region(
      json.date,
      json.didenter,
      json.identifier,
      json.latitude,
      json.longitude,
      json.radius,
      json.frompositiondetection
    );
  }
}
export default Region;
