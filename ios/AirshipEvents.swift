//
//  AirshipEvents.swift
//  Sample
//
//

import Foundation
import CoreLocation
import WoosmapGeofencing
#if canImport(AirshipCore)
  import AirshipCore
#endif

class AirshipData {
    var eventname: String = ""
    var properties: [String: Any]

    required init(eventname: String, properties: [String: Any]) {
        self.eventname = eventname
        self.properties = properties
    }
}

public class AirshipEvents: AirshipEventsDelegate {

    public init() {}

    public func regionEnterEvent(regionEvent: [String: Any], eventName: String) {
        #if canImport(AirshipCore)
        var result: AirshipData = AirshipData.init(eventname: eventName, properties: regionEvent)
        NotificationCenter.default.post(name: .airshipEvent, object: self, userInfo: ["Airship": result])
        #endif
    }

    public func regionExitEvent(regionEvent: [String: Any], eventName: String) {
        #if canImport(AirshipCore)
        var result: AirshipData = AirshipData.init(eventname: eventName, properties: regionEvent)
        NotificationCenter.default.post(name: .airshipEvent, object: self, userInfo: ["Airship": result])
        #endif
    }

    public func visitEvent(visitEvent: [String: Any], eventName: String) {
        #if canImport(AirshipCore)
        var result: AirshipData = AirshipData.init(eventname: eventName, properties: regionEvent)
        NotificationCenter.default.post(name: .airshipEvent, object: self, userInfo: ["Airship": result])
        #endif
    }

    public func poiEvent(POIEvent: [String: Any], eventName: String) {
        #if canImport(AirshipCore)
        var result: AirshipData = AirshipData.init(eventname: eventName, properties: regionEvent)
        NotificationCenter.default.post(name: .airshipEvent, object: self, userInfo: ["Airship": result])
        #endif
    }

    public func ZOIclassifiedEnter(regionEvent: [String: Any], eventName: String) {
        #if canImport(AirshipCore)
        var result: AirshipData = AirshipData.init(eventname: eventName, properties: regionEvent)
        NotificationCenter.default.post(name: .airshipEvent, object: self, userInfo: ["Airship": result])
        #endif
    }

    public func ZOIclassifiedExit(regionEvent: [String: Any], eventName: String) {
        #if canImport(AirshipCore)
        var result: AirshipData = AirshipData.init(eventname: eventName, properties: regionEvent)
        NotificationCenter.default.post(name: .airshipEvent, object: self, userInfo: ["Airship": result])
        #endif
    }
}

extension Notification.Name {
    static let airshipEvent = Notification.Name("airshipEvent")
}
