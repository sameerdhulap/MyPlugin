import CoreLocation
import WoosmapGeofencing

@objc(PluginGeofencing)
class PluginGeofencing: RCTEventEmitter {
    
    /// Location routing to check location permission
    private var  templocationChecker: CLLocationManager!
    
    /// List of location watch collected by plugin
    private var  locationWatchStack: [String: String] = [:]
    
    /// List of poi watch collected by plugin
    private var  poiWatchStack: [String: String] = [:]
    
    /// List all callback collect by Search api call
    private var  searchAPICallStack: [String: String] = [:]
    
    /// List all distance watch collected by plugin
    private var  distanceWatchStack: [String: String] = [:]
    
    /// List all callback collect by Distance api call
    private var  distanceAPICallStack: [String: String] = [:]
    
    /// List all region callback collected by plugin
    private var  regionWatchStack: [String: String] = [:]
    
    /// List all visit callback collected by plugin
    private var  visitWatchStack: [String: String] = [:]
    
    /// List all airship callback collected by plugin
    private var  airshipWatchStack: [String: String] = [:]
    
    /// List all marketing callback collected by plugin.
    private var  marketingWatchStack: [String: String] = [:]
    
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String]! {
        return ["geolocationDidChange",
                "geolocationError",
                "woosmapgeofenceRegionDidChange",
                "woosmapgeofenceRegionError"]
    }
    
    override init() {
        super.init()
        templocationChecker = CLLocationManager()
        templocationChecker.delegate = self
        templocationChecker.desiredAccuracy = kCLLocationAccuracyBest
        locationWatchStack = [:]
        poiWatchStack = [:]
        searchAPICallStack = [:]
        regionWatchStack = [:]
        visitWatchStack = [:]
        distanceWatchStack = [:]
        distanceAPICallStack = [:]
        airshipWatchStack = [:]
        marketingWatchStack = [:]
    }
    
    //MARK: Private method
    private func showWoomapError(_ msg: String) -> NSError {
        var result: [String: Any] = [:]
        result["message"] = msg
        let resultError: NSError = NSError(domain: WoosmapGeofenceMessage.plugin_errorDomain, code: WoosmapGeofenceMessage.plugin_errorcode,userInfo: result)
        return resultError
    }
    
    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }
    
    
    @objc(initialize:withResolver:withRejecter:)
    func initialize(command: NSDictionary, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void{
        
        guard let initparameters = command as? [String: String?] else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.plugin_parsingFailed,
                   showWoomapError(WoosmapGeofenceMessage.plugin_parsingFailed))
            return
        }
        var isCallUnsuccessfull = false
        var privateKeyWoosmapAPI = ""
        
        if let keyWoosmapAPI = initparameters["privateKeyWoosmapAPI"] as? String {
            privateKeyWoosmapAPI = keyWoosmapAPI
        }
        
        if let trackingProfile = initparameters["trackingProfile"] as? String {
            if ConfigurationProfile(rawValue: trackingProfile) != nil {
                WoosmapGeofenceService.setup(woosmapKey: privateKeyWoosmapAPI,  configurationProfile: trackingProfile)
                
            } else {
                isCallUnsuccessfull = true
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.invalidProfile,
                       showWoomapError(WoosmapGeofenceMessage.invalidProfile))
                
            }
            
        } else {
            WoosmapGeofenceService.setup(woosmapKey: privateKeyWoosmapAPI, configurationProfile: "")
        }
        if(isCallUnsuccessfull == false){
            resolve(WoosmapGeofenceMessage.initialize)
        }
    }
    
    
    @objc(getPermissionsStatus:withRejecter:)
    func getPermissionsStatus(resolve: RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        let authorizationStatus: CLAuthorizationStatus
        if #available(iOS 14, *) {
            let manager = CLLocationManager()
            authorizationStatus = manager.authorizationStatus
        } else {
            authorizationStatus = CLLocationManager.authorizationStatus()
        }
        var str: String = "UNKNOWN"
        switch authorizationStatus {
        case .denied:
            str = "DENIED"
        case .restricted:
            str = "DENIED"
        case .authorizedAlways:
            str = "GRANTED_BACKGROUND"
        case .authorizedWhenInUse:
            str = "GRANTED_FOREGROUND"
        default:
            str = "UNKNOWN"
        }
        resolve(str)
    }
    
    /// Updating new woosmap key
    /// - Parameter command: -
    @objc(setWoosmapApiKey:withResolver:withRejecter:)
    func setWoosmapApiKey(command: NSArray, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void{
        
        if let woosmapkey = command[0] as? String {
            if WoosmapGeofenceService.shared != nil {
                do {
                    try WoosmapGeofenceService.shared?.setWoosmapAPIKey(key: woosmapkey)
                    resolve(WoosmapGeofenceMessage.initialize)
                } catch let error as WoosGeofenceError {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           error.localizedDescription,
                           showWoomapError(error.localizedDescription))
                } catch {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           error.localizedDescription,
                           showWoomapError(error.localizedDescription))
                }
            } else {
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.woosemapNotInitialized,
                       showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
            }
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.invalidWoosmapKey,
                   showWoomapError(WoosmapGeofenceMessage.invalidWoosmapKey))
        }
    }
    
    @objc(startTracking:withResolver:withRejecter:)
    func startTracking(command: NSArray, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void{
        
        if let profileName = command[0] as? String {
            if WoosmapGeofenceService.shared != nil {
                do {
                    try WoosmapGeofenceService.shared?.startTracking(profile: profileName)
                    resolve(WoosmapGeofenceMessage.initialize)
                } catch let error as WoosGeofenceError {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           error.localizedDescription,
                           showWoomapError(error.localizedDescription))
                } catch {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           error.localizedDescription,
                           showWoomapError(error.localizedDescription))
                }
            } else {
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.woosemapNotInitialized,
                       showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
            }
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.invalidWoosmapKey,
                   showWoomapError(WoosmapGeofenceMessage.invalidWoosmapKey))
        }
    }
    
    /// Stop woosgeolocationservice
    /// - Parameter command: -
    
    
    /// Stop woosgeolocationservice
    /// - Parameters:
    ///   - resolve: return message on sucessfull call
    ///   - reject: never called but to manage compatiblity with android promise it is part of plugin
    @objc(stopTracking:withRejecter:)
    func stopTracking (resolve: RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) {
        if WoosmapGeofenceService.shared != nil {
            WoosmapGeofenceService.shared?.stopTracking()
            resolve(WoosmapGeofenceMessage.initialize)
        }
        else{
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Showing location permission popup on screen
    /// - Parameters:
    ///   - command: background mode  true for background access and false for forground access
    ///   - resolve: return message on sucessfull call
    ///   - reject: return error on function call
    @objc(requestPermissions:withResolver:withRejecter:)
    func requestPermissions(command: NSArray, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock){
        // The requestAlwaysAuthorization will show prompt only for the first time. From then onwards, no prompts are shown.
        // https://developer.apple.com/documentation/corelocation/cllocationmanager/1620551-requestalwaysauthorization
        
        if let backgoundMode = command[0] as? Bool {
            let status = CLLocationManager.authorizationStatus()
            
            if backgoundMode {
                if status == .notDetermined {
                    self.templocationChecker.requestAlwaysAuthorization()
                } else if status == .authorizedAlways {
                    resolve(WoosmapGeofenceMessage.samePermission)
                } else {
                    resolve(WoosmapGeofenceMessage.showingPermissionBox)
                    DispatchQueue.main.async {
                        let appname: String = Bundle.main.infoDictionary?[kCFBundleNameKey as String] as? String ?? ""
                        var alertInfo: String = ""
                        if status == .denied {
                            alertInfo = String(format: WoosmapGeofenceMessage.deniedPermission, appname)
                        } else {
                            alertInfo = String(format: WoosmapGeofenceMessage.replacePermission, appname)
                        }
                        let alert = UIAlertController(title: "", message: alertInfo, preferredStyle: UIAlertController.Style.alert)
                        alert.addAction(UIAlertAction(title: WoosmapGeofenceMessage.cancel, style: UIAlertAction.Style.default, handler: nil))
                        alert.addAction(UIAlertAction(title: WoosmapGeofenceMessage.setting, style: UIAlertAction.Style.default, handler: { _ in
                            if let settingsUrl = URL(string: UIApplication.openSettingsURLString) {
                                UIApplication.shared.open(settingsUrl, options: [:], completionHandler: nil)
                            }
                        }))
                        var rootViewController = UIApplication.shared.keyWindow?.rootViewController
                        if let navigationController = rootViewController as? UINavigationController {
                            rootViewController = navigationController.viewControllers.first
                        }
                        if let tabBarController = rootViewController as? UITabBarController {
                            rootViewController = tabBarController.selectedViewController
                        }
                        rootViewController?.present(alert, animated: true, completion: nil)
                    }
                }
            } else {
                if status == .notDetermined {
                    self.templocationChecker.requestWhenInUseAuthorization()
                } else if status == .authorizedWhenInUse {
                    resolve(WoosmapGeofenceMessage.samePermission)
                } else {
                    resolve(WoosmapGeofenceMessage.showingPermissionBox)
                    DispatchQueue.main.async {
                        let appname: String = Bundle.main.infoDictionary?[kCFBundleNameKey as String] as? String ?? ""
                        var alertInfo: String = ""
                        if status == .denied {
                            alertInfo = String(format: WoosmapGeofenceMessage.deniedPermission, appname)
                        } else {
                            alertInfo = String(format: WoosmapGeofenceMessage.replacePermission, appname)
                        }
                        let alert = UIAlertController(title: "", message: alertInfo, preferredStyle: UIAlertController.Style.alert)
                        alert.addAction(UIAlertAction(title: WoosmapGeofenceMessage.cancel, style: UIAlertAction.Style.default, handler: nil))
                        alert.addAction(UIAlertAction(title: WoosmapGeofenceMessage.setting, style: UIAlertAction.Style.default, handler: { _ in
                            if let settingsUrl = URL(string: UIApplication.openSettingsURLString) {
                                UIApplication.shared.open(settingsUrl, options: [:], completionHandler: nil)
                            }
                        }))
                        var rootViewController = UIApplication.shared.keyWindow?.rootViewController
                        if let navigationController = rootViewController as? UINavigationController {
                            rootViewController = navigationController.viewControllers.first
                        }
                        if let tabBarController = rootViewController as? UITabBarController {
                            rootViewController = tabBarController.selectedViewController
                        }
                        rootViewController?.present(alert, animated: true, completion: nil)
                    }
                    
                }
                
            }
            
        }
    }
    
    
    
    /// Adding Location watch
    /// - Parameters:
    ///   - watchid: Reference Watch ID
    ///   - resolve: return reference watchid  on successfully call
    ///   - reject: return error info
    @objc(watchLocation:withResolver:withRejecter:)
    func watchLocation(watchid: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if WoosmapGeofenceService.shared != nil {
            locationWatchStack[watchid] = watchid
            if locationWatchStack.count == 1 {
                NotificationCenter.default.addObserver(
                    self,
                    selector: #selector(newLocationAdded(_:)),
                    name: .newLocationSaved,
                    object: nil)
            }
            resolve(watchid)
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
        
    }
    
    
    /// Clear location watch for given id
    /// - Parameters:
    ///   - watchid: Reference to clear watch
    ///   - resolve: return Reference watchid  on successfully call
    ///   - reject: return error info
    @objc(clearLocationWatch:withResolver:withRejecter:)
    func clearLocationWatch(watchid: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        
        if let _ = locationWatchStack[watchid] {
            locationWatchStack.removeValue(forKey: watchid)
        }
        if locationWatchStack.count == 0 {
            // remove delegate watch
            NotificationCenter.default.removeObserver(self, name: .newLocationSaved, object: nil)
        }
        resolve(watchid)
    }
    
    /// Clear all location callback
    /// - Parameters:
    ///   - resolve: return Reference watchid  on successfully call
    ///   - reject: return error info
    @objc(clearAllLocationWatch:withRejecter:)
    func clearAllLocationWatch(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        locationWatchStack.removeAll()
        if locationWatchStack.count == 0 {
            // remove delegate watch
            NotificationCenter.default.removeObserver(self, name: .newLocationSaved, object: nil)
        }
        resolve("00000-00000-0000")
    }
    
    
    /// Adding Region watch
    /// - Parameters:
    ///   - watchid: Reference Watch ID
    ///   - resolve: return reference watchid  on successfully call
    ///   - reject: return error info
    @objc(watchRegions:withResolver:withRejecter:)
    func watchRegions(watchid: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if WoosmapGeofenceService.shared != nil {
            regionWatchStack[watchid] = watchid
            if regionWatchStack.count == 1 {
                NotificationCenter.default.addObserver(
                    self,
                    selector: #selector(didEventPOIRegion(_:)),
                    name: .didEventPOIRegion,
                    object: nil)
            }
            resolve(watchid)
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
        
    }
    
    /// Clear Region watch for given id
    /// - Parameters:
    ///   - watchid: Reference to clear watch
    ///   - resolve: return Reference watchid  on successfully call
    ///   - reject: return error info
    @objc(clearRegionsWatch:withResolver:withRejecter:)
    func clearRegionsWatch(watchid: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        
        if let _ = regionWatchStack[watchid] {
            regionWatchStack.removeValue(forKey: watchid)
        }
        if regionWatchStack.count == 0 {
            // remove delegate watch
            NotificationCenter.default.removeObserver(self, name: .didEventPOIRegion, object: nil)
        }
        resolve(watchid)
    }
    
    /// Clear all region callback
    /// - Parameters:
    ///   - resolve: return Reference watchid  on successfully call
    ///   - reject: return error info
    @objc(clearAllRegionsWatch:withRejecter:)
    func clearAllRegionsWatch(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        regionWatchStack.removeAll()
        if regionWatchStack.count == 0 {
            // remove delegate watch
            NotificationCenter.default.removeObserver(self, name: .didEventPOIRegion, object: nil)
        }
        resolve("00000-00000-0000")
    }
    
    
    /// Add a region that you want to monitor. Method will accept an object with the following attributes:
    /// regionId - Id of the region
    /// lat - Latitude
    /// lng - Longitude
    /// radius - Radius in meters
    /// type - circle/isochrone
    /// - Parameters:
    ///   - regioninfo: regioninfo description
    ///   - resolve: return Reference watchid  on successfully call
    ///   - reject: return error info
    @objc(addRegion:withResolver:withRejecter:)
    func addRegion(regioninfo:NSDictionary, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if WoosmapGeofenceService.shared != nil {
            if let regioninfo = regioninfo as? [String: Any] {
                var regionid = UUID().uuidString
                var radius = 100
                var lat: Double = 0
                var lng: Double = 0
                var regiontype:String = ""
                if let inputregionId = regioninfo["regionId"] as? String {
                    regionid = inputregionId
                }
                if let inputCoordinate = regioninfo["lat"]  as? String {
                    lat = Double(inputCoordinate) ?? 0
                } else if let inputCoordinate = regioninfo["lat"]  as? Double {
                    lat = inputCoordinate
                }
                if let inputCoordinate = regioninfo["lng"]  as? String {
                    lng = Double(inputCoordinate) ?? 0
                } else if let inputCoordinate = regioninfo["lng"]  as? Double {
                    lng = inputCoordinate
                }
                if let inputradius = regioninfo["radius"]  as? String {
                    radius = Int(inputradius) ?? 0
                } else if let inputradius = regioninfo["radius"]  as? Int {
                    radius = inputradius
                }
                
                if let inputtype = regioninfo["type"]  as? String {
                    regiontype = inputtype
                }
                
                if lat == 0 || lng == 0 {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           WoosmapGeofenceMessage.invalidLocation,
                           showWoomapError(WoosmapGeofenceMessage.invalidLocation))
                } else if !(regiontype == "circle" || regiontype == "isochrone") {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           WoosmapGeofenceMessage.invalidRegionType,
                           showWoomapError(WoosmapGeofenceMessage.invalidRegionType))
                } else {
                    let coordinate: CLLocationCoordinate2D = CLLocationCoordinate2D.init(latitude: lat, longitude: lng)
                    
                    let (regionIsCreated, identifier) = WoosmapGeofenceService.shared!.addRegion(identifier: regionid, center: coordinate, radius: radius, type: regiontype)
                    var result: [AnyHashable: Any] = [:]
                    result["regionid"] = identifier
                    result["iscreated"] = regionIsCreated
                    if(regionIsCreated) {
                        resolve(result["regionid"])
                    }
                    else{
                        reject(WoosmapGeofenceMessage.plugin_errorDomain,
                               WoosmapGeofenceMessage.regionInfoDuplicateID,
                               showWoomapError(WoosmapGeofenceMessage.regionInfoDuplicateID))
                    }
                }
            } else {
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.regionInfoEmptyOrNull,
                       showWoomapError(WoosmapGeofenceMessage.regionInfoEmptyOrNull))
            }
            
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Added SFMC Credentials to SDK
    /// - Parameters:
    ///   - credentials: SFMC Credentials object
    ///   - resolve: return Reference watchid  on successfully call
    ///   - reject: return error info
    @objc(setSFMCCredentials:withResolver:withRejecter:)
    func setSFMCCredentials (credentials: NSDictionary, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if WoosmapGeofenceService.shared != nil {
            if let credentials = credentials as? [String: String] {
                do {
                    try WoosmapGeofenceService.shared?.setSFMCCredentials(credentials: credentials)
                    resolve(WoosmapGeofenceMessage.initialize)
                } catch let error as WoosGeofenceError {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           error.localizedDescription,
                           showWoomapError(error.localizedDescription))
                } catch {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           error.localizedDescription,
                           showWoomapError(error.localizedDescription))
                }
            } else {
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.invalidSFMCCredentials,
                       showWoomapError(WoosmapGeofenceMessage.invalidSFMCCredentials))
            }
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// you create a geofence around a POI, manually define the radius value (100.0) or choose the user_properties subfield that corresponds to radius value of the geofence ("radiusPOI").
    /// - Parameters:
    ///   - radius: radius enum or number in meters
    ///   - resolve:  return Ok  on successfully call
    ///   - reject: return error info
    @objc(setPoiRadius:withResolver:withRejecter:)
    func setPoiRadius (radius: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if WoosmapGeofenceService.shared != nil {
            var userInputRadiusValue: String = ""
            if let radius = Int32(radius) {
                userInputRadiusValue =  String(radius)
            }
            else if let radius = Double(radius) {
                userInputRadiusValue =  String(radius)
            }
            else{
                userInputRadiusValue = radius
            }
            
            if(userInputRadiusValue != ""){
                WoosmapGeofenceService.shared?.setPoiRadius(radius: userInputRadiusValue)
                resolve(WoosmapGeofenceMessage.initialize)
                
            } else {
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.invalidPOIRadius,
                       showWoomapError(WoosmapGeofenceMessage.invalidPOIRadius))
            }
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Fetch All region
    /// - Parameters:
    ///   - resolve: return list of Array with region info
    ///   - reject: return error info
    @objc(getAllRegions:withRejecter:)
    func getAllRegions(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            let capturedRegions = objWoos.getRegions()
            var result: [[AnyHashable: Any]] = []
            
            for item in capturedRegions {
                result.append(formatRegionData(woosdata: item))
            }
            resolve(result);
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Fetch  region
    /// - Parameters:
    ///   - regionid: regionid to fetch
    ///   - resolve: return  region info
    ///   - reject: error info
    @objc(getRegions:withResolver:withRejecter:)
    func getRegions(regionid:String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            if(regionid != ""){
                if let capturedRegions = objWoos.getRegions(id:regionid){
                    resolve(formatRegionData(woosdata: capturedRegions));
                }
                else{
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           WoosmapGeofenceMessage.notfound_regionid,
                           showWoomapError(WoosmapGeofenceMessage.notfound_regionid))
                }
            }
            else{
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.required_regionid,
                       showWoomapError(WoosmapGeofenceMessage.required_regionid))
            }
            
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Clear All regions from DB
    /// - Parameters:
    ///   - resolve: return regionDeleted
    ///   - reject: error info
    @objc(removeAllRegions:withRejecter:)
    func removeAllRegions(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            objWoos.deleteAllRegion()
            resolve(WoosmapGeofenceMessage.regionDeleted);
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Remove region with ID
    /// - Parameters:
    ///   - regionid: region id
    ///   - resolve:  return regionDeleted
    ///   - reject: error info
    @objc(removeRegion:withResolver:withRejecter:)
    func removeRegion(regionid:String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            if(regionid != ""){
                do{
                    try objWoos.deleteRegions(id: regionid)
                    resolve(WoosmapGeofenceMessage.regionDeleted);
                }
                catch let error as WoosGeofenceError {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           error.localizedDescription,
                           showWoomapError(error.localizedDescription))
                } catch {
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           error.localizedDescription,
                           showWoomapError(error.localizedDescription))
                }
            }
            else{
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.required_regionid,
                       showWoomapError(WoosmapGeofenceMessage.required_regionid))
            }
            
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Fetch all locations
    /// - Parameters:
    ///   - resolve: List of Array with location info
    ///   - reject: error info
    @objc(getAllLocations:withRejecter:)
    func getAllLocations(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            let capturedLocations = objWoos.getLocations()
            var result: [[AnyHashable: Any]] = []
            
            for item in capturedLocations {
                result.append(formatLocationData(woosdata: item))
            }
            resolve(result);
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Fetch Location info for given id
    /// - Parameters:
    ///   - locationid: id of location
    ///   - resolve: Location info
    ///   - reject: Error Info
    @objc(getLocation:withResolver:withRejecter:)
    func getLocation(locationid:String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            if(locationid != ""){
                if let capturedPOIs = objWoos.getLocations(id:locationid){
                    resolve(formatLocationData(woosdata: capturedPOIs));
                }
                else{
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           WoosmapGeofenceMessage.notfound_locationid,
                           showWoomapError(WoosmapGeofenceMessage.notfound_locationid))
                }
            }
            else{
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.required_regionid,
                       showWoomapError(WoosmapGeofenceMessage.required_regionid))
            }
            
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Get All Pois
    /// - Parameters:
    ///   - resolve: List of Array of POI info
    ///   - reject: Error info
    @objc(getAllPois:withRejecter:)
    func getAllPois(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            let capturedRegions = objWoos.getPOIs()
            var result: [[AnyHashable: Any]] = []
            for item in capturedRegions {
                result.append(formatPOIData(woosdata: item))
            }
            resolve(result);
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Get POI info by ID
    /// - Parameters:
    ///   - poiid: id of POI
    ///   - resolve: POI info
    ///   - reject: Error Info
    @objc(getPoi:withResolver:withRejecter:)
    func getPoi(poiid:String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            if(poiid != ""){
                if let capturedRegions = objWoos.getPOIs(id:poiid){
                    resolve(formatPOIData(woosdata: capturedRegions));
                }
                else{
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           WoosmapGeofenceMessage.notfound_poiid,
                           showWoomapError(WoosmapGeofenceMessage.notfound_poiid))
                }
            }
            else{
                reject(WoosmapGeofenceMessage.plugin_errorDomain,
                       WoosmapGeofenceMessage.required_poiid,
                       showWoomapError(WoosmapGeofenceMessage.required_poiid))
            }
            
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Clear all Location from DB
    /// - Parameters:
    ///   - resolve: Deleted
    ///   - reject: Error Info
    @objc(removeAllLocations:withRejecter:)
    func removeAllLocations(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            objWoos.deleteAllLocations()
            resolve(WoosmapGeofenceMessage.locationDeleted);
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    /// Clear all POIs from DB
    /// - Parameters:
    ///   - resolve: Deleted
    ///   - reject: Error Info
    @objc(removeAllPois:withRejecter:)
    func removeAllPois(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            objWoos.deletePOI()
            resolve(WoosmapGeofenceMessage.poiDeleted);
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    // MARK: Custom Tracking

    /// Start User defined tracking
    /// - Parameters:
    ///   - mode: local/external
    ///   - source: URL or from local resource
    ///   - resolve: Success
    ///   - reject: Error Info
    @objc(startCustomTracking:source:withResolver:withRejecter:)
    func startCustomTracking(mode:String,
                             source:String,
                             resolve:@escaping RCTPromiseResolveBlock,
                             reject:@escaping RCTPromiseRejectBlock) {
        if let objWoos = WoosmapGeofenceService.shared  {
            objWoos.startCustomTracking(mode: mode, source: source, completion: { Value, Error in
                if let functionError = Error{
                    reject(WoosmapGeofenceMessage.plugin_errorDomain,
                           functionError.localizedDescription,
                           self.showWoomapError(functionError.localizedDescription))
                }
                else{
                    if(Value){
                        resolve(WoosmapGeofenceMessage.initialize);
                    }
                }
            });
        } else {
            reject(WoosmapGeofenceMessage.plugin_errorDomain,
                   WoosmapGeofenceMessage.woosemapNotInitialized,
                   showWoomapError(WoosmapGeofenceMessage.woosemapNotInitialized))
        }
    }
    
    
    // MARK: Events
    @objc func newLocationAdded(_ notification: Notification) {
        if let location = notification.userInfo?["Location"] as? Location {
            if(locationWatchStack.count>0){
                sendEvent(withName: "geolocationDidChange", body: formatLocationData(woosdata:location))
            }
        }
    }
    
    @objc func didEventPOIRegion(_ notification: Notification) {
        if let region = notification.userInfo?["Region"] as? Region {
            sendEvent(withName: "woosmapgeofenceRegionDidChange", body: formatRegionData(woosdata:region))
        }
    }
    
    // MARK: Supporting functions
    private func formatLocationData(woosdata: Location) -> [AnyHashable: Any] {
        var result: [AnyHashable: Any] = [:]
        if let date = woosdata.date {
            result["date"] = date.timeIntervalSince1970 * 1000
        } else {
            result["date"] = 0
        }
        result["latitude"] = woosdata.latitude
        result["locationdescription"] = woosdata.locationDescription
        result["locationid"] = woosdata.locationId
        result["longitude"] = woosdata.longitude
        return result
    }
    private func formatPOIData(woosdata: POI) -> [AnyHashable: Any] {
        var result: [AnyHashable: Any] = [:]
        if let data = woosdata.jsonData {
            do {
                let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
                result["jsondata"] = json
            } catch { print("Invalid JSON format") }
        }
        result["city"] = woosdata.city
        result["idstore"] = woosdata.idstore
        result["name"] = woosdata.name
        if let date = woosdata.date {
            result["date"] = date.timeIntervalSince1970 * 1000
        } else {
            result["date"] = 0
        }
        result["distance"] = woosdata.distance
        result["duration"] = woosdata.duration ?? "-"
        result["latitude"] = woosdata.latitude
        result["locationid"] = woosdata.locationId
        result["longitude"] = woosdata.longitude
        result["zipcode"] = woosdata.zipCode
        result["radius"] = woosdata.radius
        result["address"] = woosdata.address
        result["countrycode"] = woosdata.countryCode
        result["tags"] = woosdata.tags
        result["types"] = woosdata.types
        result["contact"] = woosdata.contact
        return result
    }
    private func formatZOIData(woosdata: ZOI) -> [AnyHashable: Any] {
        var result: [AnyHashable: Any] = [:]
        result["accumulator"] = woosdata.accumulator
        result["age"] = woosdata.age
        result["covariance_det"] = woosdata.covariance_det
        result["duration"] = woosdata.duration
        if let date = woosdata.endTime {
            result["endtime"] = date.timeIntervalSince1970 * 1000
        } else {
            result["endtime"] = 0
        }
        result["idvisits"] = woosdata.idVisits
        result["latmean"] = woosdata.latMean
        result["lngmean"] = woosdata.lngMean
        result["period"] = woosdata.period
        result["prior_probability"] = woosdata.prior_probability
        result["starttime"] = woosdata.startTime
        result["weekly_density"] = woosdata.weekly_density
        result["wktpolygon"] = woosdata.wktPolygon
        result["x00covariance_matrix_inverse"] = woosdata.x00Covariance_matrix_inverse
        result["x01covariance_matrix_inverse"] = woosdata.x01Covariance_matrix_inverse
        result["x10covariance_matrix_inverse"] = woosdata.x10Covariance_matrix_inverse
        result["x11covariance_matrix_inverse"] = woosdata.x11Covariance_matrix_inverse
        return result
    }
    private func formatVisitData(woosdata: Visit) -> [AnyHashable: Any] {
        var result: [AnyHashable: Any] = [:]
        result["accuracy"] = woosdata.accuracy
        if let date = woosdata.date {
            result["date"] = date.timeIntervalSince1970 * 1000
        } else {
            result["date"] = 0
        }
        if let date = woosdata.arrivalDate {
            result["arrivaldate"] = date.timeIntervalSince1970 * 1000
        } else {
            result["arrivaldate"] = 0
        }
        if let date = woosdata.departureDate {
            result["departuredate"] = date.timeIntervalSince1970 * 1000
        } else {
            result["departuredate"] = 0
        }
        result["latitude"] = woosdata.latitude
        result["longitude"] = woosdata.longitude
        return result
    }
    private func formatRegionData(woosdata: Region) -> [AnyHashable: Any] {
        var result: [AnyHashable: Any] = [:]
        result["date"] = woosdata.date.timeIntervalSince1970 * 1000
        //            if let date = woosdata.date {
        //                result["date"] = date.timeIntervalSince1970 * 1000
        //            } else {
        //                result["date"] = 0
        //            }
        result["didenter"] = woosdata.didEnter
        result["identifier"] = woosdata.identifier
        result["latitude"] = woosdata.latitude
        result["longitude"] = woosdata.longitude
        result["radius"] = woosdata.radius
        result["frompositiondetection"] = woosdata.fromPositionDetection
        return result
    }
    
    private func formatDistanceData(woosdata: DistanceResponseResult) -> [AnyHashable: Any] {
        var result: [AnyHashable: Any] = [:]
        result["locationid"] = ""//woosdata.locationId
        result["distance"] = String(woosdata.distance)
        result["duration"] = String(woosdata.duration)
        return result
    }
    
    private func formatAirshipData(woosdata: AirshipData) -> [AnyHashable: Any] {
        var result: [AnyHashable: Any] = [:]
        result["name"] = woosdata.eventname
        var propertiesFormat: [AnyHashable: Any] = [:]
        woosdata.properties.keys.forEach { airshipkey in
            if let value = woosdata.properties[airshipkey] as? Date {
                propertiesFormat[airshipkey] = value.timeIntervalSince1970 * 1000
            } else if let value = woosdata.properties[airshipkey] as? Double {
                propertiesFormat[airshipkey] = value
            } else if let value = woosdata.properties[airshipkey] as? Int {
                propertiesFormat[airshipkey] = value
            } else if let value = woosdata.properties[airshipkey] as? Int32 {
                propertiesFormat[airshipkey] = value
            } else if let value = woosdata.properties[airshipkey] as? Bool {
                propertiesFormat[airshipkey] = value
            } else if let value = woosdata.properties[airshipkey] as? String {
                propertiesFormat[airshipkey] = value
            } else {
                propertiesFormat[airshipkey] = woosdata.properties[airshipkey]
            }
        }
        result["properties"] = propertiesFormat
        return result
    }
    
    private func formatMarketingData(woosdata: MarketingData) -> [AnyHashable: Any] {
        var result: [AnyHashable: Any] = [:]
        result["name"] = woosdata.eventname
        var propertiesFormat: [AnyHashable: Any] = [:]
        woosdata.properties.keys.forEach { marketingkey in
            if let value = woosdata.properties[marketingkey] as? Date {
                propertiesFormat[marketingkey] = value.timeIntervalSince1970 * 1000
            } else if let value = woosdata.properties[marketingkey] as? Double {
                propertiesFormat[marketingkey] = value
            } else if let value = woosdata.properties[marketingkey] as? Int {
                propertiesFormat[marketingkey] = value
            } else if let value = woosdata.properties[marketingkey] as? Int32 {
                propertiesFormat[marketingkey] = value
            } else if let value = woosdata.properties[marketingkey] as? Bool {
                propertiesFormat[marketingkey] = value
            } else if let value = woosdata.properties[marketingkey] as? String {
                propertiesFormat[marketingkey] = value
            } else {
                propertiesFormat[marketingkey] = woosdata.properties[marketingkey]
            }
        }
        result["properties"] = propertiesFormat
        return result
    }
}



extension PluginGeofencing:CLLocationManagerDelegate{
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else {
            return
        }
        print(location)
    }
    
    private func locationManager(manager: CLLocationManager, didFailWithError error: NSError) {
        print(error)
    }
    
}
