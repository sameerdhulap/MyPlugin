/**
 * @classdesc A class that represents the Airship object.
 * @constructs Airship
 * @param {string} name The name of the custom event.
 * @param {string} properties The attributes of the POI such as `name`, `address`, `zipCode` etc.
 */
class Airship {
  Name: String;
  Properties: String;
  constructor(name: String, properties: String) {
    this.Name = name;
    this.Properties = properties;
  }
  /**
   * Converts json object to an object of type Airship.
   * @param {Object} json The json representation of Airship.
   * @returns Object
   * @memberof Airship
   */
  static jsonToObj(json: any) {
    return new Airship(json.name, json.properties);
  }
}
module.exports = Airship;
