//
//  DataRegion.swift
//  Sample
//

import Foundation

import Foundation
import UIKit
import CoreLocation
import WoosmapGeofencing

public class DataRegion: RegionsServiceDelegate {

    public init() {}

    public func updateRegions(regions: Set<CLRegion>) {
        NotificationCenter.default.post(name: .updateRegions, object: self, userInfo: ["Regions": regions])
    }

    public func didEnterPOIRegion(POIregion: Region) {
        NotificationCenter.default.post(name: .didEventPOIRegion, object: self, userInfo: ["Region": POIregion])
    }

    public func didExitPOIRegion(POIregion: Region) {
        NotificationCenter.default.post(name: .didEventPOIRegion, object: self, userInfo: ["Region": POIregion])
    }

    public func workZOIEnter(classifiedRegion: Region) {
        NotificationCenter.default.post(name: .didEventPOIRegion, object: self, userInfo: ["Region": classifiedRegion])
    }

    public func homeZOIEnter(classifiedRegion: Region) {
        NotificationCenter.default.post(name: .didEventPOIRegion, object: self, userInfo: ["Region": classifiedRegion])
    }
    
    /// Read POI Regions
    /// - Returns: Region info
    public func readRegions() -> [Region] {
        return Regions.getAll()
    }
    
    /// Read POI Regions
    /// - Parameter id: Identifier
    /// - Returns: Region info
    public func readRegions(id:String) -> Region? {
        return Regions.getRegionFromId(id: id)
    }
    
    /// Read Isochrone Regions
    /// - Returns: Region info
    public func readIsochroneRegions() -> [RegionIsochrone] {
        return RegionIsochrones.getAll()
    }
    
    /// Read Isochrone Regions
    /// - Parameter id: Identifier
    /// - Returns: Region info
    public func readIsochroneRegions(id:String) -> RegionIsochrone? {
        return RegionIsochrones.getRegionFromId(id: id)
    }
    
    /// Erase All Regions
    public func eraseRegions() {
        Regions.deleteAll()
        RegionIsochrones.deleteAll()
    }
    
    /// Erase Regions by ID
    /// - Parameter id: Identifier
    public func eraseRegions(id:String) {
        RegionIsochrones.removeRegionIsochrone(id: id)
    }
        
}

extension Notification.Name {
    static let updateRegions = Notification.Name("updateRegions")
    static let didEventPOIRegion = Notification.Name("didEventPOIRegion")

}
