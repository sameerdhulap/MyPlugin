//
//  DataDistance.swift
//  Sample
//
//

import Foundation
import CoreLocation
import WoosmapGeofencing
import SwiftUI

public class DataDistance: DistanceAPIDelegate {
    
    public init() {}

    public func distanceAPIResponse(distance: [Distance]) {

        distance.forEach({ distanceElement in
            let distance = distanceElement.distance
            let duration = distanceElement.duration
                let result: DistanceResponseResult = DistanceResponseResult.init(distance: distance, duration: duration)
                    NotificationCenter.default.post(name: .distanceCalculated, object: self, userInfo: ["Distance": result])
                    // print(distance?.value ?? 0)
                    // print(duration?.text ?? 0)
        })
    }

    public func distanceAPIError(error: String) {
        print(error)
    }

}
extension Notification.Name {
    static let distanceCalculated = Notification.Name("POIDistanceCalculated")
}

class DistanceResponseResult {
    var distance: Int
    var duration: Int
    required init(distance: Int, duration: Int) {
        self.distance = distance
        self.duration = duration
    }
}
class DistanceResponseError {
    var locationId: String = ""
    var error: String
    required init(locationId: String, error: String ) {
        self.locationId = locationId
        self.error = error
    }
}
