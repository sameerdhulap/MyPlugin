//
//  WoosmapGeofenceMessage.swift
//  testproject
//
//  Created by apple on 10/08/21.
//

import UIKit

internal struct WoosmapGeofenceMessage {
    static let woosemapNotInitialized = "Woosmap not initialized"
    static let watchIDEmptyOrNull = "Watch id cannot be empty or null"
    static let regionInfoEmptyOrNull = "regionInfo cannot be empty or null"
    static let regionInfoDuplicateID = "regionid should be unique"
    static let invalidLocation = "Invalid location"
    static let invalidRegionType = "Provide valid region type (circle/isochrone)"
    static let searchpoiRequestInfoEmptyOrNull = "search poi Request cannot be empty or null"
    static let showingPermissionBox = "Showing permission box"
    static let cancel = "Cancel"
    static let setting = "Setting"
    static let replacePermission = "You already given location permission to app. Do you want to change it? Please modified it from settings at privacy -> location service -> %@"
    static let deniedPermission = "You are previously denied location permission to app. To change it? Please modified it from settings at privacy -> location service -> %@"
    static let samePermission = "Already allow permission for it"
    static let initialize = "OK"
    static let invalidGoogleKey = "Google key Not provided"
    static let invalidWoosmapKey = "Woosmap API key not provided"
    static let visitDeleted = "Deleted"
    static let zoiDeleted = "Deleted"
    static let locationDeleted = "Deleted"
    static let regionDeleted = "Deleted"
    static let poiDeleted = "Deleted"
    static let invalidProfile = "Invalid profile"
    static let invalidPOIRadius = "POI Radius should be an integer or a string"
    static let invalidSFMCCredentials = "Credentials cannot be empty"
    static let required_authenticationBaseURI = "Required key missing: authenticationBaseURI"
    static let required_restBaseURI = "Required key missing: restBaseURI"
    static let required_client_id = "Required key missing: client_id"
    static let required_client_secret = "Required key missing: client_secret"
    static let required_contactKey = "Required key missing: contactKey"
    static let required_regionid = "Region id cannot be empty or null"
    static let required_poiid = "POI id cannot be empty or null"
    static let required_locationid = "Location id cannot be empty or null"
    static let notfound_regionid = "Unable to fetch region info"
    static let regionid_notexist = "Region id invalid"
    static let notfound_locationid = "Unable to fetch location info"
    static let notfound_poiid = "Unable to fetch POI info"
    static let plugin_errorcode = 10001
    static let plugin_errorDomain = "WoosmapGeofencePlugin"
    static let plugin_parsingFailed = "Something wrong while processing data. Please check input parameters"
    static let invalid_profilesourcetype = "Provide valid source type type (local/external)"
    static let invalid_profilefile = "Invalid profile file"
}
