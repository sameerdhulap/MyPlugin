![woosmap](https://avatars.githubusercontent.com/u/1203240?s=200&v=4)

# react-native-plugin-geofencing

This react-native plugin extends the functionality offered by the Woosmap Geofencing Mobile SDKs. Find more about the Woosmap Geofencing SDK

## Installation

```sh
npm install @woosmap/react-native-plugin-geofencing
```

**Adding the platform**

For iOS

- **info.plist**: Please check info.plist updated with following keys
  - NSLocationAlwaysAndWhenInUseUsageDescription
  - NSLocationAlwaysUsageDescription
  - NSLocationWhenInUseUsageDescription
  - UIBackgroundModes

  ```
  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>Used to test the library</string>
  <key>NSLocationAlwaysUsageDescription</key>
  <string>Used to test the library</string>
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>Used to test the library</string>
  <key>UIBackgroundModes</key>
  <array>
    <string>location</string>
  </array>

  ```

- **Podfile**: configure to use ```use_frameworks!``` and ```platform :ios, '12.0'```
if you are using **M1 Mac** Update pod post installation like

```
  post_install do |installer|
 installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
          config.build_settings["ONLY_ACTIVE_ARCH"] = "NO"
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
      end
    end
  end
```

### Supported Platforms ###

---

- iOS
- Android

### Modules

---
- **WoosmapGeofencing**: Woosmap contains methods to monitor location, regions.

### Objects(Read Only)

---
- **Location**: Represents the location object
- **POI**: Represents Point of Interest
- **Region**: Represents a geographical region/geofence
- **Visit**: Represents a visit to a location/POI
- **ZOI**: Represents Zone of Interest
- **Airship**: Contains custom data related to Airship implementation
- **MarketingCloud**: Contains custom data related to third party marketing cloud implementation

## Usage

``` javascript
import WoosmapGeofencing from 'react-native-plugin-geofencing';

// ...

```

### Check and request permissions

---
Before initializing the SDK it is required that you request for required location permissions.

To check if the location permissions are granted by the user call `getPermissionsStatus` method.

``` javascript
WoosmapGeofencing.getPermissionsStatus()
      .then((status: string) => {
        console.log(status);
      })
      .catch((error: any) => {
         alert('message: ' + error.message);
      });
```

Parameter status will be a string, one of:
- `GRANTED_BACKGROUND` : User has granted location access even when app is not running in the foreground.
- `GRANTED_FOREGROUND` : Location access is granted only while user is using the app.
- `DENIED`: Location access is denied.
- `UNKNOWN`: Without providing or denying any permission then it will return unknown.

**_Please note_**: Plugin will not work as expected if location access is denied.

**Requesting location access**
To request location access call `requestPermissions` method of the plugin. This will result in displaying location access permission dialog. This method accepts a boolean parameter `isBackground`. If this parameter is set to true, then plugin will ask for background location access. Code snippet below asks for background location access.

``` javascript
WoosmapGeofencing.requestPermissions(props.background)
      .then((status: string) => {
        console.log(status);
      })
      .catch((error: any) => {
         alert('message: ' + error.message);
      });

```

### Initializing the plugin

---

Plugin can be initialized by simply calling `initialize` method.

``` javascript
var woosmapSettings = {
    privateKeyWoosmapAPI: "<<WOOSMAP_KEY>>",
    trackingProfile: "liveTracking"
};
WoosmapGeofencing.initialize(woosmapSettings)
      .then((value: string) => {
        console.log(value);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

Both configuration options `privateKeyWoosmapAPI` and `trackingProfile` are optional. You can also initialize the plugin by passing null configuration.

```
await WoosmapGeofencing.initialize();
```

You can also set the Woosmap API key later by calling `setWoosmapApiKey` method.

``` javascript
WoosmapGeofencing.setWoosmapApiKey(<privateKeyWoosmapAPI>)
      .then((value: string) => {
        console.log(value);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

### Tracking

---

Once you have initialized the plugin and the user has authorized location permissions, you can start tracking the user’s location.

To start tracking, call:

``` javascript
WoosmapGeofencing.startTracking('liveTracking')
      .then((result: string) => {
        console.log(value);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });

```

To stop tracking, call:

``` javascript
WoosmapGeofencing.stopTracking()
      .then((value: any) => {
        console.log(value);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

Method `startTracking` accepts only following tracking profiles

- **liveTracking**
- **passiveTracking**
- **visitsTracking**

### Tracking profile properties

---

| Property | liveTracking | passiveTracking | visitsTracking
| ----------- | ----------- | ----------- | ----------- |
| trackingEnable | true | true | true
| foregroundLocationServiceEnable | true | false | false
| modeHighFrequencyLocation | true | false | false
| visitEnable | false | false | true
| classificationEnable | false | false | true
| minDurationVisitDisplay | null | null | 300
| radiusDetectionClassifiedZOI | null | null | 50
| distanceDetectionThresholdVisits | null | null | 25
| currentLocationTimeFilter | 0 | 0 | 0
| currentLocationDistanceFilter | 0 | 0 | 0
| accuracyFilter | 100 | 100 | 100
| searchAPIEnable | false | true | false
| searchAPICreationRegionEnable | false | true | false
| searchAPITimeFilter | 0 | 0 | 0
| searchAPIDistanceFilter | 0 | 0 | 0
| distanceAPIEnable | false | false | false
| modeDistance | null | null | null
| outOfTimeDelay | 300 | 300 | 300
| DOUBLEOfDayDataDuration | 30 | 30 | 30

### Listening to events

---

**Location**

To listen to location, call `watchLocation` method. Method will invoke callback and pass a location object as a parameter. Method will return a watchId . This id can be used to remove a callback.

``` javascript
const callback = (value: Location) => {
      alert('message: ' + JSON.stringify(value));
  };

WoosmapGeofencing.watchLocation(callback)
     .then((watchRef: string) => {
       //Keep watchRef, it requires when you wish to remove location watch.
       console.log('Watch added');
     })
     .catch((error: any) => {
       alert('message: ' + error.message);
     });
```

To stop getting location updates:

``` javascript
WoosmapGeofencing.clearLocationWatch(watchID)
      .then((watchRef: string) => {
        console.log(watchRef);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

**Define the radius value**

When you create a Geofence around a POI (previously imported from Woosmap), manually define the radius value:

```javascript
WoosmapGeofencing.setPoiRadius("100")
      .then((value: string) => {
        console.log(value);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

or choose the user_properties subfield that corresponds to radius value of the Geofence:

```javascript
WoosmapGeofencing.setPoiRadius("radiusPOI")
      .then((value: string) => {
        console.log(value);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

**Regions**

Call `watchRegions` method to track Regions. Method will invoke a callback with Region object. Method will return a watch id which can be used later to remove the callback.

``` javascript
WoosmapGeofencing.watchRegions(callback)
      .then((watchRef: string) => {
        //Keep watchRef, it requires when you wish to remove region watch.
        console.log('Watch added');
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

To remove watch:

``` javascript
WoosmapGeofencing.clearRegionsWatch(watchID)
      .then((watchRef: string) => {
        console.log(watchRef);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

### Initialize Salesforce MarketingCloud Connector

---

The SDK needs some input like credentials and object key to perform the API call to Salesforce Marketing Cloud API.

**Input to initialize the SFMC connector**<br/>

| Parameters                             | Description                                                                                               | Required |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------- |
| authenticationBaseURI                  | Authentication Base URI                                                                                   | Required |
| restBaseURI                            | REST Base URI                                                                                             | Required |
| client\_id                             | client\_id (journey\_read and list\_and\_subscribers\_read rights are required)                           | Required |
| client\_secret                         | client\_secret (journey\_read and list\_and\_subscribers\_read rights are required)                       | Required |
| contactKey                             | The ID that uniquely identifies a subscriber/contact                                                      | Required |
| regionEnteredEventDefinitionKey        | Set the EventDefinitionKey that you want to use for the Woosmap event `woos_geofence_entered_event`       |          |
| regionExitedEventDefinitionKey         | Set the EventDefinitionKey that you want to use for the Woosmap event `woos_geofence_exited_event`        |          |
| poiEventDefinitionKey                  | Set the EventDefinitionKey that you want to use for the Woosmap event `woos_POI_event`                    |          |
| zoiClassifiedEnteredEventDefinitionKey | Set the EventDefinitionKey that you want to use for the Woosmap event `woos_zoi_classified_entered_event` |          |
| zoiClassifiedExitedEventDefinitionKey  | Set the EventDefinitionKey that you want to use for the Woosmap event `woos_zoi_classified_exited_event`  |          |
| visitEventDefinitionKey                | Set the EventDefinitionKey that you want to use for the Woosmap event `woos_Visit_event`                  |

### Adding and removing regions

---

Call `addRegion` method to add a region that you want to monitor.
Region type can be 'circle' or 'isochrone' only.
Method will accept an object with the following attributes:

- **regionId** - Id of the region
- **lat** - Latitude
- **lng** - Longitude
- **radius** - Radius in meters
- **type** - type of region

##### Create a custom circle region

``` javascript
var regionData = {
      lat: 51.50998,
      lng: -0.1337,
      regionId: '7F91369E-467C-4CBD-8D41-6509815C4780',
      radius: 100,
      type: 'circle',
    };
    WoosmapGeofencing.addRegion(regionData)
      .then((value: string) => {
        console.log(value);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
```

##### Create a custom isochrone region

``` javascript
var regionData = {
      lat: 51.50998,
      lng: -0.1337,
      regionId: '7F91369E-467C-4CBD-8D41-6509815C4780',
      radius: 180,
      type: 'isochrone',
    };
    WoosmapGeofencing.addRegion(regionData)
      .then((value: string) => {
        console.log(value);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
```

Call ```removeRegions``` method to remove a region that you are monitoring. Method will accept the following parameter, and passing a null value will remove all the regions.

``` javascript
  const request = "7F91369E-467C-4CBD-8D41-6509815C4780";
  WoosmapGeofencing.removeRegions(request)
    .then((value: string) => {
      console.log(value);
    })
    .catch((error: any) => {
      console.error(error);
    });
```

Or To Delete all Regions

``` javascript
  WoosmapGeofencing.removeRegions()
    .then((value: string) => {
      console.log(value);
    })
    .catch((error: any) => {
      console.error(error);
    });
```

### Local database operations

---

- **Get POIs**: Call `getPois` method to get an array of POIs from the local db

``` javascript

WoosmapGeofencing.getPois(optional locationid)
  .then((value: Location[]) => {
    console.log(String(value.length));
  })
  .catch((error: any) => {
    console.error(error);
  });
```

- **Delete POIs**: Call `removePois` method to clear all POIs from the local db.

``` javascript
WoosmapGeofencing.removePois()
  .then((value: string) => {
    console.log(value);
  })
  .catch((error: any) => {
    console.error(error);
  });
```

- **Get Locations**: Call `getLocations` method to get an array of Locations from the local db.

``` javascript

WoosmapGeofencing.getLocations(optional locationid)
  .then((value: Location[]) => {
    console.log(String(value.length));
  })
  .catch((error: any) => {
    console.error(error);
  });
```

- **Delete Locations**: Call `removeLocations` method to clear all Locations info from the local db.

``` javascript
WoosmapGeofencing.removeLocations()
  .then((value: string) => {
    console.log(value);
  })
  .catch((error: any) => {
    console.error(error);
  });
```

- **Get Regions**: Call `getRegions` method to get an array of Regions from the local db. specify region id to retrieve specific region info

``` javascript
  WoosmapGeofencing.getRegions(optional regionid).
      .then((value: Region[]) => {
        Toast.show(String(value.length));
      })
      .catch((error: any) => {
        console.error(error);
      });
```

### Initialize the connector implementation

---

``` javascript
    var sfmcCredentials = {
        authenticationBaseURI: "https://xxxxxxxxxx.auth.marketingcloudapis.com",
        restBaseURI: "https://xxxxxxxxxx.rest.marketingcloudapis.com",
        client_id: "xxxxxxxxxxxxxxx",
        client_secret: "xxxxxxxxxxxxxxx",
        contactKey: "ID001",
        regionEnteredEventDefinitionKey: "APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        regionExitedEventDefinitionKey: "APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    };
    WoosmapGeofencing.setSFMCCredentials(sfmcCredentials)
      .then((value: any) => {
        console.log(value);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

### Custom tracking profile

---

If preset tracking profiles don’t fit with your use cases, you can build your own profile and uses the startCustomTracking() method. There are two way to host the json file:

- Include json file in the client application (local) for ios.
- For local mode put json file in assets folder in android.
- Host externally in a file folder in your information system (external)

``` javascript
WoosmapGeofencing.startCustomTracking('local', 'localProfile.json')
      .then((value: any) => {
        console.log(value);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

or

``` javascript
WoosmapGeofencing.startCustomTracking('external', 'https://raw.githubusercontent.com/lpernelle-wgs/files/master/customProfileLeo.json')
      .then((value: any) => {
        console.log(value);
      })
      .catch((error: any) => {
        alert('message: ' + error.message);
      });
```

#### Build a custom tracking profile

Define tracking properties in a Json file that respect the Json Schema in the [Tracking properties page](https://developers.woosmap.com/products/geofencing-sdk/tracking-profiles/tracking-properties/).

## License

MIT
