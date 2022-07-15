import { NativeEventEmitter } from 'react-native';
import uuid from 'react-native-uuid';
import PluginGeofencing from './internal/nativeInterface';
import Location from './internal/Location';
import Region from './internal/Region';
import Poi from './internal/Poi';
import type {
  GeofenceRegion,
  RegionType,
  ProfileSource,
} from './internal/types';

const eventEmitter = new NativeEventEmitter(PluginGeofencing);

let subscriptionsLocation: any = {};
let subscriptionsRegion: any = {};
/**
 * Initializes the Woosmap object
 * @param arg0 A JSON object with Woosmap Key (optional) and tracking profile (`liveTracking`,`passiveTracking`,`visitsTracking`).
 * @returns promise:success - A callback function that will be called on success.
 error - A callback function that will be called on error.
 */
function initialize(arg0?: any): Promise<string> {
  if (arg0 == null) {
    arg0 = {};
  }
  return PluginGeofencing.initialize(arg0);
}

/**
 * A method that sets Woosmap private API key
 * @param apiKey new API key.
 * @returns promise:success - A callback function that will be called on success.
 error - A callback function that will be called on error.
 */
function setWoosmapApiKey(apiKey: string): Promise<string> {
  return PluginGeofencing.setWoosmapApiKey([apiKey]);
}

/**
 * A method to start tracking the user's location.
 * @param trackingProfile The configuration profile to use. Values could be anyone of the following: liveTracking, passiveTracking and visitsTracking.
 * @returns promise:success - A callback function that will be called on success.
 error - A callback function that will be called on error.
 */
function startTracking(trackingProfile: string): Promise<string> {
  return PluginGeofencing.startTracking([trackingProfile]);
}

/**
 * Stops tracking the user's location.
 * @returns promise:success - A callback function that will be called on success.
 error - A callback function that will be called on error.
 */
function stopTracking(): Promise<string> {
  return PluginGeofencing.stopTracking();
}

/**
 * A method to request the required permissions to collect locations.
 * @param background - A boolean value indicating whether the permissions to request is for background or foreground permission.
 * @returns A callback that will be called on successful authorization by the app. A callback that will be called when the app denies permission. The plugin will return an object with a message - 'Permission Denied'.
 */
function requestPermissions(background?: boolean): Promise<string> {
  if (background == null) {
    background = false;
  }
  return PluginGeofencing.requestPermissions([background]);
}

/**
 * A method to check if the app has granted required permissions to track location.
 * @returns A callback that will be called with the following status - GRANTED_BACKGROUND, GRANTED_FOREGROUND, DENIED
 */
function getPermissionsStatus(): Promise<string> {
  return PluginGeofencing.getPermissionsStatus();
}

/**
 * Method will
invoke callback and pass a location object as a parameter. Method will return a watchId . This id can be used to remove a callback.
 * @param success new location found callback
 * @param error error status callback
 * @returns  watchid
 */
function watchLocation(
  success: (result: Location) => any,
  error?: any
): Promise<string> {
  const watchID = uuid.v1().toString();

  const successCallback = (result: any) => {
    success(Location.jsonToObj(result));
  };

  subscriptionsLocation[watchID] = [
    eventEmitter.addListener('geolocationDidChange', successCallback),
    error ? eventEmitter.addListener('geolocationError', error) : null,
  ];
  return PluginGeofencing.watchLocation(watchID);
}

/**
 * A method to stop tracking location for a specified watch. If watchId is null or undefined the plugin will clear all watches.
 * @param watchID Reference ID.
 * @returns return promise with same id back in case of success otherwise error info
 */
function clearLocationWatch(watchID?: string): Promise<string> {
  if (watchID == null) {
    eventEmitter.removeAllListeners('geolocationDidChange');
    eventEmitter.removeAllListeners('geolocationError');
    subscriptionsLocation = {};
    return PluginGeofencing.clearAllLocationWatch();
  } else {
    const saved = subscriptionsLocation[watchID];
    if (saved) {
      const arg0 = saved[0];
      eventEmitter.removeListener('geolocationDidChange', arg0);
      const arg1 = saved[1];
      if (arg1) {
        eventEmitter.removeListener('geolocationError', arg1);
      }
      subscriptionsLocation[watchID] = undefined;
    }
    return PluginGeofencing.clearLocationWatch(watchID);
  }
}

/**
 * A method to to track Regions. Method will invoke a callback with Region object. Method will return
a watch id which can be used later to remove the callback.
 * @param success new location found callback
 * @param error error status callback
 * @returns  watchid
 */
function watchRegions(
  success: (result: Region) => any,
  error?: any
): Promise<string> {
  const watchID = uuid.v1().toString();

  const successCallback = (result: any) => {
    success(Region.jsonToObj(result));
  };

  subscriptionsRegion[watchID] = [
    eventEmitter.addListener('woosmapgeofenceRegionDidChange', successCallback),
    error
      ? eventEmitter.addListener('woosmapgeofenceRegionError', error)
      : null,
  ];
  return PluginGeofencing.watchRegions(watchID);
}

/**
 * A method to clear the specified watch tracing the regions. If the watchId is null or undefined then it will clear all the watches tracking the regions.
 * @param watchID Reference ID.
 * @returns return promise with same id back in case of success otherwise error info
 */
function clearRegionsWatch(watchID: string): Promise<string> {
  if (watchID == null) {
    eventEmitter.removeAllListeners('woosmapgeofenceRegionDidChange');
    eventEmitter.removeAllListeners('woosmapgeofenceRegionError');
    subscriptionsRegion = {};
    return PluginGeofencing.clearAllRegionsWatch();
  } else {
    const saved = subscriptionsRegion[watchID];
    if (saved) {
      const arg0 = saved[0];
      eventEmitter.removeListener('woosmapgeofenceRegionDidChange', arg0);
      const arg1 = saved[1];
      if (arg1) {
        eventEmitter.removeListener('woosmapgeofenceRegionError', arg1);
      }
      subscriptionsRegion[watchID] = undefined;
    }
    return PluginGeofencing.clearRegionsWatch(watchID);
  }
}
/**
 * Sets Sales Force Marketing Cloud (SFMC) credentials
 * @param arg0 A JSON object with SFMC credentials. Keys authenticationBaseURI, restBaseURI, client_id, client_secret and contactKey are required.
 * @returns promise with A callback that will be called on success or error.
 */
function setSFMCCredentials(arg0: Object): Promise<string> {
  return PluginGeofencing.setSFMCCredentials(arg0);
}

/**
 * When you create a geofence around a POI, manually define the radius value (100.0) or choose the user_properties subfield that corresponds to radius value of the geofence ("radiusPOI").
 * @param radius can be integer or string.
 * @returns promise with A callback that will be called on success or error.
 */
function setPoiRadius(radius: string): Promise<string> {
  return PluginGeofencing.setPoiRadius(radius);
}
/**
 * Adds a custom region that you want to monitor.
 * @param region A GeofenceRegion object with latitude, longitude, radius and type.
 * @returns promise with A callback that will be called on success or error.
 */

function addRegion(region: GeofenceRegion): Promise<string> {
  return PluginGeofencing.addRegion(region);
}
/**
 * Retrieve saved region info
 * @param regionID If it pass return info for given region or return all region info
 * @returns promise with A callback that will be called on success or error.
 */
function getRegions(regionID?: string): Promise<Region[]> {
  if (regionID == null) {
    return PluginGeofencing.getAllRegions()
      .then((result: any[]) => {
        var formatted: Region[] = [];
        result.forEach((item) => {
          formatted.push(Region.jsonToObj(item));
        });
        return Promise.resolve(formatted);
      })
      .catch((e: any) => {
        return Promise.reject(e);
      });
  } else {
    return PluginGeofencing.getRegions(regionID)
      .then((result: any) => {
        var formatted: Region[] = [];
        formatted.push(Region.jsonToObj(result));
        return Promise.resolve(formatted);
      })
      .catch((e: any) => {
        return Promise.reject(e);
      });
  }
}

/**
 * Retrieve saved location info
 * @param locationID - Optional in case of location id pass it return only that location info
 * @returns promise with A callback that will be called on success or error.
 */
function getLocations(locationID?: string): Promise<Location[]> {
  if (locationID == null) {
    return PluginGeofencing.getAllLocations()
      .then((result: any[]) => {
        var formatted: Location[] = [];
        result.forEach((item) => {
          formatted.push(Location.jsonToObj(item));
        });
        return Promise.resolve(formatted);
      })
      .catch((e: any) => {
        return Promise.reject(e);
      });
  } else {
    return PluginGeofencing.getLocation(locationID)
      .then((result: any) => {
        var formatted: Location[] = [];
        formatted.push(Location.jsonToObj(result));
        return Promise.resolve(formatted);
      })
      .catch((e: any) => {
        return Promise.reject(e);
      });
  }
}

/**
 * Retrieve saved POI info
 * @param poiID - Optional in case of poi id (LocationID or StoreID) pass it return only that POI info
 * @returns promise with A callback that will be called on success or error.
 */
function getPois(poiID?: string): Promise<Poi[]> {
  if (poiID == null) {
    return PluginGeofencing.getAllPois()
      .then((result: any[]) => {
        var formatted: Poi[] = [];
        result.forEach((item) => {
          formatted.push(Poi.jsonToObj(item));
        });
        return Promise.resolve(formatted);
      })
      .catch((e: any) => {
        return Promise.reject(e);
      });
  } else {
    return PluginGeofencing.getPoi(poiID)
      .then((result: any) => {
        var formatted: Poi[] = [];
        formatted.push(Poi.jsonToObj(result));
        return Promise.resolve(formatted);
      })
      .catch((e: any) => {
        return Promise.reject(e);
      });
  }
}

/**
 * Remove saved region info
 * @param regionID If it pass remove info for given region or removes all region info
 * @returns promise with A callback that will be called on success or error.
 */
function removeRegions(regionID?: string): Promise<string> {
  if (regionID == null) {
    return PluginGeofencing.removeAllRegions();
  } else {
    return PluginGeofencing.removeRegion(regionID);
  }
}

/**
 * Remove saved location info
 * @returns promise with A callback that will be called on success or error.
 */
function removeLocations(): Promise<string> {
  return PluginGeofencing.removeAllLocations();
}

/**
 * Remove saved POI info
 * @returns promise with A callback that will be called on success or error.
 */
function removePois(): Promise<string> {
  return PluginGeofencing.removeAllPois();
}
/**
 * if preset tracking profiles don’t fit with your use cases, you can build your own profile and uses the startCustomTracking() method. 
 * There are two way to host the json file:
 * - included in the client application (local)
 * - hosted externally in a file folder in your information system (external)
 * @param sourceType local/external
 * @param source location of profile to be fetch
 * @returns promise with A callback that will be called on success or error.
 */
function startCustomTracking(
  sourceType: ProfileSource,
  source: string
): Promise<string> {
  return PluginGeofencing.startCustomTracking(sourceType, source);
}

export type {
  RegionType,
  GeofenceRegion,
  Region,
  Location,
  Poi,
  ProfileSource,
};

const WoosmapGeofencing = {
  initialize,
  setWoosmapApiKey,
  startTracking,
  requestPermissions,
  getPermissionsStatus,
  stopTracking,
  watchLocation,
  clearLocationWatch,
  watchRegions,
  clearRegionsWatch,
  setSFMCCredentials,
  setPoiRadius,
  addRegion,
  getRegions,
  removeRegions,
  getLocations,
  removeLocations,
  getPois,
  removePois,
  startCustomTracking,
};

export default WoosmapGeofencing;
