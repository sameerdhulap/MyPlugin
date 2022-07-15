//
//  WoosmapGeofenceService.swift
//  woosmapgeofencingsample
//
//  Created by apple on 02/08/21.
//

import Foundation
import UIKit
import CoreLocation
import WoosmapGeofencing
#if canImport(AirshipCore)
import AirshipCore
#endif

/// Geofence services
@objc(WoosmapGeofenceService) public class WoosmapGeofenceService: NSObject {

    /// Share object for WoosmapGeofenceService
    @objc static var shared: WoosmapGeofenceService? {
        get {
            return  _shared
        }
    }


    private static var _shared: WoosmapGeofenceService?
    private var woosmapKey: String = ""
    private var defaultProfile: String = ""
    private let dataLocation = DataLocation()
    private let dataPOI = DataPOI()
    private let dataDistance = DataDistance()
    private let dataRegion = DataRegion()
    private let dataVisit = DataVisit()
    private let airshipEvents = AirshipEvents()
    private let marketingCloudEvents = MarketingCloudEvents()

    private var defaultPOIRadius: String {
        get {
            let defaults = UserDefaults.standard
            let defaultPOIRadius = defaults.string(forKey: "WoosmapGeofenceService.poiradius") ?? ""
            return  defaultPOIRadius
        }
        set {
            let defaults = UserDefaults.standard
            defaults.set(newValue, forKey: "WoosmapGeofenceService.poiradius")
        }
    }

    /// Status of search api On/Off
    @objc public var searchAPIRequestEnable: Bool {
        get {
            return  WoosmapGeofencing.shared.getSearchAPIRequestEnable()
        }
        set {
            WoosmapGeofencing.shared.setSearchAPIRequestEnable(enable: newValue)

        }
    }

    /// Status of distance api On/Off
    @objc public var distanceAPIRequestEnable: Bool {
        get {
            return  WoosmapGeofencing.shared.getDistanceAPIRequestEnable()
        }
        set {
            WoosmapGeofencing.shared.setDistanceAPIRequestEnable(enable: newValue)

        }
    }

    /// status of CreationRegionEnable. On/Off
    @objc public var searchAPICreationRegionEnable: Bool {
        get {
            return  WoosmapGeofencing.shared.getSearchAPICreationRegionEnable()
        }
        set {
            WoosmapGeofencing.shared.setSearchAPICreationRegionEnable(enable: newValue)

        }
    }

    /// Status of HighfrequencyLocation Mode. On/Off
    @objc public var modeHighfrequencyLocation: Bool {
        get {
            return  WoosmapGeofencing.shared.getModeHighfrequencyLocation()
        }
        set {
            WoosmapGeofencing.shared.setModeHighfrequencyLocation(enable: newValue)
        }
    }

    /// Status of tracking state. On/Off
    @objc public var trackingState: Bool {
        get {
            return  WoosmapGeofencing.shared.getTrackingState()
        }
        set {
            WoosmapGeofencing.shared.setTrackingEnable(enable: newValue)
        }
    }

    // MARK: Application events

    /// This callback received when application become active
    @objc func appDidBecomeActive() {
        WoosmapGeofencing.shared.didBecomeActive()
    }

    /// This callback recived when application enter in background mode
    @objc func appDidEnterBackground() {
        if CLLocationManager.authorizationStatus() != .notDetermined {
            WoosmapGeofencing.shared.startMonitoringInBackground()
        }
    }

    /// This callback received when application is terminated
    @objc func appWillTerminate() {
        WoosmapGeofencing.shared.setModeHighfrequencyLocation(enable: false)
    }
    // MARK: Init

    /// Initialize woosGeofencing service with key saved in previous call
    private override init() {
        super.init()
        let defaults = UserDefaults.standard
        let woosmapKey = defaults.string(forKey: "WoosmapGeofenceService.woosmap") ?? ""
        let defaultProfile = defaults.string(forKey: "WoosmapGeofenceService.profile") ?? ""
        self.woosmapKey = woosmapKey
        self.defaultProfile = defaultProfile

        defaults.register(defaults: ["TrackingEnable": true,
                                     "ModeHighfrequencyLocation": false,
                                     "SearchAPIEnable": true,
                                     "DistanceAPIEnable": true,
                                     "searchAPICreationRegionEnable": true])

        self.activateGeofenceService()

    }

    /// Initialize service with keys and profile
    /// - Parameters:
    ///   - woosmapKey: key use for woosmap service
    ///   - configurationProfile: configuration profile
    private init(_ woosmapKey: String, _ configurationProfile: String) {
        super.init()
        self.woosmapKey = woosmapKey
        self.defaultProfile = configurationProfile

        // Save it on  prefrences
        let defaults = UserDefaults.standard
        defaults.set(woosmapKey, forKey: "WoosmapGeofenceService.woosmap")
        defaults.set(configurationProfile, forKey: "WoosmapGeofenceService.profile")

        defaults.register(defaults: ["TrackingEnable": true,
                                     "ModeHighfrequencyLocation": false,
                                     "SearchAPIEnable": true,
                                     "DistanceAPIEnable": true,
                                     "searchAPICreationRegionEnable": true])
        self.activateGeofenceService()
    }

    /// Static instance of woosGeofencing service
    /// - Parameters:
    ///   - woosmapKey: key use for woosmap service
    ///   - configurationProfile: configuration profile
    @objc public static func setup(woosmapKey: String, configurationProfile: String) {
        let group = DispatchGroup()
        group.enter()
        DispatchQueue.main.async {
            _shared = WoosmapGeofenceService.init( woosmapKey, configurationProfile)
            group.leave()
        }
        group.wait()
        
    }

    /// Creating instance for woosGeofencing service
    @objc public static func setup() {
        let group = DispatchGroup()
        group.enter()
        DispatchQueue.main.async {
            _shared = WoosmapGeofenceService.init( "", "")
            group.leave()
        }
        group.wait()
    }

    /// Setting up woosmap key
    /// - Parameter key: woosmap key
    /// - Throws: WoosGeofenceError incase of no key pass or empty
    public func setWoosmapAPIKey(key: String) throws {
        if key.trimmingCharacters(in: .whitespacesAndNewlines) == "" {
            throw WoosGeofenceError(WoosmapGeofenceMessage.invalidWoosmapKey)
        } else {
            self.woosmapKey = key
            let group = DispatchGroup()
            group.enter()
            DispatchQueue.main.async {
                WoosmapGeofencing.shared.setWoosmapAPIKey(key: self.woosmapKey)
                group.leave()
            }
            group.wait()
            let defaults = UserDefaults.standard
            defaults.set(key, forKey: "WoosmapGeofenceService.woosmap")
        }
    }

    /// Change tracking mode with new profile
    /// - Parameter profile: profile for tracking.   liveTracking / passiveTracking / visitsTracking
    /// - Throws: in case of wrong profile provided it return error invalidProfile
    public func startTracking(profile: String) throws {
        if let savedProfile = ConfigurationProfile(rawValue: profile) {
            let group = DispatchGroup()
            group.enter()
            DispatchQueue.main.async {
                WoosmapGeofencing.shared.startTracking(configurationProfile: savedProfile)
                group.leave()
            }
            group.wait()
            self.defaultProfile = profile
            let defaults = UserDefaults.standard
            defaults.set(profile, forKey: "WoosmapGeofenceService.profile")

        } else {
            self.defaultProfile = ""
            let defaults = UserDefaults.standard
            defaults.set(self.defaultProfile, forKey: "WoosmapGeofenceService.profile")
            throw WoosGeofenceError(WoosmapGeofenceMessage.invalidProfile)
        }
//        print ("Highfrequency \(WoosmapGeofencing.shared.getModeHighfrequencyLocation()) , TrackingState \(WoosmapGeofencing.shared.getTrackingState()) ")
    }

    /// Stop tracking
    public func stopTracking() {
        WoosmapGeofencing.shared.stopTracking()
    }

    /// activating WoosmapGeofencing with default parameters
    private func activateGeofenceService() {
        // Set private Woosmap key API
        WoosmapGeofencing.shared.setWoosmapAPIKey(key: woosmapKey)

        // Set delegate of protocol Location, POI and Distance
        WoosmapGeofencing.shared.getLocationService().locationServiceDelegate = dataLocation
        WoosmapGeofencing.shared.getLocationService().searchAPIDataDelegate = dataPOI
        WoosmapGeofencing.shared.getLocationService().distanceAPIDataDelegate = dataDistance
        WoosmapGeofencing.shared.getLocationService().regionDelegate = dataRegion

        // Enable Visit and set delegate of protocol Visit
        WoosmapGeofencing.shared.getLocationService().visitDelegate = dataVisit

        // Set delagate for Airship Cloud
        WoosmapGeofencing.shared.getLocationService().airshipEventsDelegate = airshipEvents


        // Set delagate for Marketing Cloud
        WoosmapGeofencing.shared.getLocationService().marketingCloudEventsDelegate = marketingCloudEvents
        if defaultPOIRadius != "" {
            WoosmapGeofencing.shared.setPoiRadius(radius: formatedRadius(radius: defaultPOIRadius))
        }

        if let savedProfile = ConfigurationProfile(rawValue: defaultProfile) {
            WoosmapGeofencing.shared.startTracking(configurationProfile: savedProfile)
        }
//        else{ //Default tracking
//            WoosmapGeofencing.shared.startTracking(configurationProfile: ConfigurationProfile.passiveTracking)
//        }
        // Check if the authorization Status of location Manager
        if CLLocationManager.authorizationStatus() != .notDetermined {
            WoosmapGeofencing.shared.startMonitoringInBackground()
        }

        NotificationCenter.default.addObserver(self,
                                               selector: #selector(appDidBecomeActive),
                                               name: UIApplication.didBecomeActiveNotification,
                                               object: nil)

        NotificationCenter.default.addObserver(self, selector: #selector(appDidEnterBackground), name: UIApplication.didEnterBackgroundNotification, object: nil)

        NotificationCenter.default.addObserver(self, selector: #selector(appWillTerminate), name: UIApplication.willTerminateNotification, object: nil)

        // MARK: Only  for testing
//          self.searchAPIRequestEnable = true
//          self.distanceAPIRequestEnable = true
//          self.searchAPICreationRegionEnable = true
//        print ("\(WoosmapGeofencing.shared.getModeHighfrequencyLocation()) \(WoosmapGeofencing.shared.getTrackingState()) ")
    }

    /// Adding  new  region
    /// - Parameters:
    ///   - identifier: Region id
    ///   - center: geoLocation point
    ///   - radius: radius of region
    ///   - type: String circle/isochrone
    /// - Returns: Status for reagion created or not and new region id from system
    public func addRegion(identifier: String, center: CLLocationCoordinate2D, radius: Int, type: String) -> (isCreate: Bool, identifier: String) {
        return WoosmapGeofencing.shared.locationService.addRegion(identifier: identifier, center: center, radius: radius, type:type)
    }

    /// Remove region from system
    /// - Parameter center: geoLocation point of region
    public func removeRegion(center: CLLocationCoordinate2D) {
        return WoosmapGeofencing.shared.locationService.removeRegion(center: center)
    }

    /// Remove region from system
    /// - Parameter identifier: region id assined for region
    public func removeRegion(identifier: String) {
        return WoosmapGeofencing.shared.locationService.removeRegion(identifier: identifier)
    }

    /// Get location information for geopoint from woos system
    /// - Parameters:
    ///   - location: geopoint for location
    ///   - locationId: id recorded for that location
    public func searchAPIRequest(location: CLLocationCoordinate2D, locationId: String = "") {
        // TODO: Missing implementation
        //WoosmapGeofencing.shared.getLocationService().searchAPIRequest(location: CLLocation.init(latitude: location.latitude, longitude: location.longitude), locationId: locationId)
    }
// TODO: Missing implementation
//    /// Get distnce between location point and origin
//    /// - Parameters:
//    ///   - locationOrigin: origin geolocation
//    ///   - coordinatesDest: destination  geolocation
//    ///   - locationId:  id recorded for that location
//    public func distanceAPIRequest(locationOrigin: CLLocationCoordinate2D, coordinatesDest: CLLocation, locationId: String = "") {
//        let latDest = coordinatesDest.coordinate.latitude
//        let lngDest = coordinatesDest.coordinate.longitude
//        let originLocation = CLLocation.init(latitude: locationOrigin.latitude,
//                                             longitude: locationOrigin.longitude)
//        WoosmapGeofencing.shared.getLocationService().distanceAPIRequest(locationOrigin: originLocation,
//                                                                         coordinatesDest: [(latDest, lngDest)],
//                                                                         locationId: locationId)
//    }
//
//    /// Get distnce between location point and origin
//    /// - Parameters:
//    ///   - locationOrigin: origin geolocation
//    ///   - locationId: id recorded for that location
//    public func distanceAPIRequest(locationOrigin: CLLocationCoordinate2D, locationId: String = "") {
//        if let poi = DataPOI().getPOIbyLocationID(locationId: locationId) {
//            let latDest = poi.latitude
//            let lngDest = poi.longitude
//            let originLocation = CLLocation.init(latitude: locationOrigin.latitude,
//                                                 longitude: locationOrigin.longitude)
//            WoosmapGeofencing.shared.getLocationService().distanceAPIRequest(locationOrigin: originLocation,
//                                                                             coordinatesDest: [(latDest, lngDest)],
//                                                                             locationId: locationId)
//        }
//
//    }

    /// List all locations capture by system
    /// - Returns: Array of location captured
    public func  getLocations() -> [Location] {
        let locations = DataLocation().readLocations()
        return locations
    }
    
    public func  getLocations(id:String) -> Location? {
        let locations = DataLocation().readLocations(id: id)
        return locations
    }

    /// List all POIs  capture by system
    /// - Returns: Array of POIs
    public func  getPOIs() -> [POI] {
        let poi = DataPOI().readPOI()
        return poi
    }
    
    /// List all POIs  capture by system
    /// - Returns: Array of POIs
    public func  getPOIs(id:String) -> POI? {
        let poi = DataPOI().readPOI(id: id)
        return poi
    }

    /// List all intrest zone capture by system
    /// - Returns: Array of zones
    public func  getZOIs() -> [ZOI] {
        let zoi = DataZOI().readZOIs()
        return zoi
    }

    /// List all region capture by system
    /// - Returns: Array of regions
    public func  getRegions() -> [Region] {
        var regions = DataRegion().readRegions()
        let IsochroneRegion = DataRegion().readIsochroneRegions()
        IsochroneRegion.forEach { item in
            let customRegion = Region()
            customRegion.identifier = item.identifier ?? "-"
            customRegion.latitude = item.latitude
            customRegion.longitude = item.longitude
            customRegion.radius = Double(item.radius)
            customRegion.type = item.type
            regions.append(customRegion)
        }
        
        if let locationService = WoosmapGeofencing.shared.locationService{
            if let customRegion = locationService.locationManager?.monitoredRegions{
                customRegion.forEach { item in
                    if(locationService.getRegionType(identifier: item.identifier) == LocationService.RegionType.custom){
                        let customRegion = Region()
                        customRegion.identifier = item.identifier
                        if let circleRegion = item as? CLCircularRegion{
                            customRegion.latitude = circleRegion.center.latitude
                            customRegion.longitude = circleRegion.center.longitude
                            customRegion.radius = circleRegion.radius
                            customRegion.type = "circle"
                        }
                        regions.append(customRegion)
                    }
                }
            }
        }
        return regions
    }
    
    
    /// Return region info
    /// - Parameter id: region id
    /// - Returns: Region
    public func  getRegions(id:String) -> Region? {
        if let locationService = WoosmapGeofencing.shared.locationService{
            if(locationService.getRegionType(identifier: id) == LocationService.RegionType.custom){
                if let customRegions = locationService.locationManager?.monitoredRegions{
                    if let watchRegion = customRegions.first(where: { item in
                        return item.identifier == id
                    }){
                        let customRegion = Region()
                        customRegion.identifier = watchRegion.identifier
                        if let circleRegion = watchRegion as? CLCircularRegion{
                            customRegion.latitude = circleRegion.center.latitude
                            customRegion.longitude = circleRegion.center.longitude
                            customRegion.radius = circleRegion.radius
                            customRegion.type = "circle"
                        }
                        return customRegion
                    }
                }
            }
        }
        
        if let  regions = DataRegion().readRegions(id: id){
            return regions
        }
        if let  regions = DataRegion().readIsochroneRegions(id: id){
            
            let customRegion = Region()
            customRegion.identifier = regions.identifier ?? "-"
            customRegion.latitude = regions.latitude
            customRegion.longitude = regions.longitude
            customRegion.radius = Double(regions.radius)
            customRegion.type = regions.type
            return customRegion
        }
        
        return nil
    }
    
    /// List all visits capture by system
    /// - Returns: Array of visits
    public func  getVisits() -> [Visit] {
        let visit = DataVisit().readVisits()
        return visit
    }

    /// Delete all visits from system
    public func  deleteVisits() {
        DataVisit().eraseVisits()
    }

    /// Delete all zois form system
    public func  deleteZoi() {
        DataZOI().eraseZOIs()
    }
    /// Delete all POI from system
    public func  deletePOI() {
        DataPOI().erasePOI()
    }

    /// Delete all location from system
    public func  deleteAllLocations() {
        DataLocation().eraseLocations()
        // Native SDK Works independently
        // DataPOI().erasePOI()
    }

    /// Delete all ZOI regions
    public func  deleteAllZoiRegion() {
        WoosmapGeofencing.shared.locationService.removeRegions(type: LocationService.RegionType.custom)
    }

    /// Delete all POI regions
    public func  deleteAllPoiRegion() {
        WoosmapGeofencing.shared.locationService.removeRegions(type: LocationService.RegionType.poi)
    }

    /// Delete regions by id
    /// - Parameter id: region id
    /// - Returns: deleted
    public func  deleteRegions(id:String) throws  {
        if isRegionIDExist(id: id){
            DataRegion().eraseRegions(id: id)
            WoosmapGeofencing.shared.locationService.removeRegion(identifier: id)
        }
        else{
            throw WoosGeofenceError(WoosmapGeofenceMessage.regionid_notexist )
        }
        
    }
    
    /// Delete all regions
    public func  deleteAllRegion() {
        DataRegion().eraseRegions()
        WoosmapGeofencing.shared.locationService.removeRegions(type: LocationService.RegionType.none)
    }

    @objc static public func mockdata() {
        if WoosmapGeofenceService.shared == nil {
            WoosmapGeofenceService.setup()
        }
        MockDataVisit().mockVisitData()
    }

    /// Setting up SFMCCredentials
    /// - Parameter credentials: Key/value pair for credentials settings
    /// - Throws: Error for required keys
    @objc public func setSFMCCredentials(credentials: [String: String]) throws {
        var requiredSatisfied = true
        if credentials["authenticationBaseURI"] == nil {
            requiredSatisfied = false
            throw WoosGeofenceError(WoosmapGeofenceMessage.required_authenticationBaseURI )
        }
        else if credentials["restBaseURI"] == nil {
            requiredSatisfied = false
            throw WoosGeofenceError(WoosmapGeofenceMessage.required_restBaseURI)
        }
        else if credentials["client_id"] == nil {
            requiredSatisfied = false
            throw WoosGeofenceError(WoosmapGeofenceMessage.required_client_id)
        }
        else if credentials["client_secret"] == nil {
            requiredSatisfied = false
            throw WoosGeofenceError(WoosmapGeofenceMessage.required_client_secret)
        }
        else if credentials["contactKey"] == nil {
            requiredSatisfied = false
            throw WoosGeofenceError(WoosmapGeofenceMessage.required_contactKey)
        }
        if requiredSatisfied {
            WoosmapGeofencing.shared.setSFMCCredentials(credentials: credentials)
        }
    }

    /// Setting POI redious
    /// - Parameter radius: integer or string for radius  value
    public func setPoiRadius(radius: String) {
        self.defaultPOIRadius = radius
        WoosmapGeofencing.shared.setPoiRadius(radius: formatedRadius(radius: radius))
    }

    /// Format String value to proper datatype
    /// - Parameter radius: radius of POI
    /// - Returns: Formatted radius
    private func formatedRadius (radius: String) -> Any {
        if let poiRadius = Int(radius){
            return poiRadius
        }
        else if let poiRadius = Double(radius){
            return poiRadius
        }
        else{
            return  radius
        }
    }
    private func isRegionIDExist(id: String) -> Bool{
        if let _ = getRegions(id: id){
            return true
        }
        return false
    }
    
    public func startCustomTracking(mode: String, source:String, completion: @escaping (_ Value: Bool, _ Error: WoosGeofenceError?)->()){
        let group = DispatchGroup()
        group.enter()
        DispatchQueue.main.async {
            if(mode == "local"){
                let bundle = Bundle.main //Bundle(for: Self.self)
                if let url = bundle.url(forResource: source, withExtension: nil){
                    let (status,errors) = WoosmapGeofencing.shared.startCustomTracking(url: url.absoluteString)
                    
                    if(status == false){
                        completion(false,WoosGeofenceError(errors[0]))
                    }
                    else{
                        completion(true,nil)
                    }
                }
                else{
                    completion(false,WoosGeofenceError(WoosmapGeofenceMessage.invalid_profilefile))
                }
            }
            else if(mode == "external"){
                let (status,errors) = WoosmapGeofencing.shared.startCustomTracking(url: source)
                if(status == false){
                    completion(false,WoosGeofenceError(errors[0]))
                }
                else{
                    completion(true,nil)
                }
            }
            else{
                completion(false,WoosGeofenceError(WoosmapGeofenceMessage.invalid_profilesourcetype))
            }
            group.leave()
        }
        group.wait()
    }
    
    public func startCustomTracking1(mode: String, source:String) throws{
            if(mode == "local"){
                let bundle = Bundle.main //Bundle(for: Self.self)
                if let url = bundle.url(forResource: source, withExtension: nil){
                    let (status,errors) = WoosmapGeofencing.shared.startCustomTracking(url: url.absoluteString)
                    if(status == false){
                        throw WoosGeofenceError(errors[0])
                    }
                }
                else{
                    throw WoosGeofenceError(WoosmapGeofenceMessage.invalid_profilefile)
                }
            }
            else if(mode == "external"){
                let (status,errors) = WoosmapGeofencing.shared.startCustomTracking(url: source)
                if(status == false){
                    throw WoosGeofenceError(errors[0])
                }
            }
            else{
                throw WoosGeofenceError(WoosmapGeofenceMessage.invalid_profilesourcetype )
            }
        
    }

}

/// WoosGeofense error
public struct WoosGeofenceError: Error {

    /// Error info
    let message: String

    /// Initialize
    /// - Parameter message: error detail text
    init(_ message: String) {
        self.message = message
    }

    /// Localized Description
    public var localizedDescription: String {
        return message
    }
}
