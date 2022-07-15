/**
 * A class that represents the POI object.
 * @classdesc A class that represents the POI object.
 * @constructs Poi
 * @param {Object} jsonData A json object representing the POI.
 * @param {string} city The name of the city the POI belongs to.
 * @param {string} idstore A unique identifier for the POI.
 * @param {name} name The name of the POI.
 * @param {number} date The datetime stamp.
 * @param {number} distance The distance between the POI and the user's location.
 * @param {number} duration The duration to travel to the POI from the user's location.
 * @param {number} latitude The latitude of the POI.
 * @param {string} locationid Location id of the POI.
 * @param {number} longitude The longitude of the POI.
 * @param {string} zipcode The zip code of the POI.
 * @param {number} radius The radius of the POI.
 * @param {string} address The address of the POI.
 * @param {string} countrycode The countrycode of the POI.
 * @param {string} tags The tags for the POI.
 * @param {string} types The types of the POI.
 * @param {string} contact The contact for the POI.
 */
class Poi {
  Jsondata: object;
  City: string;
  Idstore: string;
  Name: string;
  Date: number;
  Distance: number;
  Duration: number;
  Latitude: number;
  Locationid: string;
  Longitude: number;
  Zipcode: string;
  Radius: number;
  Countrycode: string;
  Tags: string;
  Types: string;
  Contact: string;
  Address: string;
  constructor(
    jsondata: object,
    city: string,
    idstore: string,
    name: string,
    date: number,
    distance: number,
    duration: number,
    latitude: number,
    locationid: string,
    longitude: number,
    zipcode: string,
    radius: number,
    address: string,
    countrycode: string,
    tags: string,
    types: string,
    contact: string
  ) {
    this.Jsondata = jsondata;
    this.City = city;
    this.Idstore = idstore;
    this.Name = name;
    this.Date = date;
    this.Distance = distance;
    this.Duration = duration;
    this.Latitude = latitude;
    this.Locationid = locationid;
    this.Longitude = longitude;
    this.Zipcode = zipcode;
    this.Radius = radius;
    this.Idstore = idstore;
    this.Countrycode = countrycode;
    this.Tags = tags;
    this.Types = types;
    this.Contact = contact;
    this.Address = address;
  }
  /**
   * Converts json object to an object of type Poi.
   * @param {Object} json The json representation of the Poi.
   * @returns Object
   * @memberof Poi
   */
  static jsonToObj(json: any) {
    return new Poi(
      json.jsondata,
      json.city,
      json.idstore,
      json.name,
      json.date,
      json.distance,
      json.duration,
      json.latitude,
      json.locationid,
      json.longitude,
      json.zipcode,
      json.radius,
      json.address,
      json.countrycode,
      json.tags,
      json.types,
      json.contact
    );
  }
}
export default Poi;
