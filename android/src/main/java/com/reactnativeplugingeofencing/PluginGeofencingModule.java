package com.reactnativeplugingeofencing;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.ArraySet;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;
import com.webgeoservices.woosmapgeofencing.Woosmap;
import com.webgeoservices.woosmapgeofencing.WoosmapSettings;
import com.webgeoservices.woosmapgeofencing.database.Region;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

/**
 * This is a React native plugin exposing Woosmap Geofencing SDK methods.
 */
@ReactModule(name = PluginGeofencingModule.NAME)
public class PluginGeofencingModule extends ReactContextBaseJavaModule implements PermissionListener, LifecycleEventListener {
  public static final String NAME = "PluginGeofencing";

  private ReactApplicationContext reactContext;
  private Woosmap woosmap;
  private static final int PERMISSIONS_REQUEST_CODE = 150; // random request code
  private Promise mPermissionsRequestPromise;
  private WoosLocationReadyListener locationReadyListener;
  private WoosRegionReadyListener regionReadyListener;

  public PluginGeofencingModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.reactContext.addLifecycleEventListener(this);
  }

  /***
   * Return plugin name.
   * @return woosmap native plugin name.which is constant for android and ios.
   */
  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void multiply(int a, int b, Promise promise) {
    promise.resolve(a * b);
  }


  /***
   * Initializes Woosmap object with given parameters.
   * @param map     ReadableMap may contain privateKeyWoosmapAPI with Woosmap API key,
   *                trackingProfile with tracking profile info.
   * @param promise React native callback context.
   */
  @ReactMethod
  public void initialize(ReadableMap map, Promise promise) {
    String trackingProfile = "";
    try {
      if (map.hasKey(WoosmapMessageAndKey.profileTrackingKey)) {
        if (map.getString(WoosmapMessageAndKey.profileTrackingKey).equals(Woosmap.ConfigurationProfile.liveTracking)) {
          trackingProfile = Woosmap.ConfigurationProfile.liveTracking;
        } else if (map.getString(WoosmapMessageAndKey.profileTrackingKey).equals(Woosmap.ConfigurationProfile.passiveTracking)) {
          trackingProfile = Woosmap.ConfigurationProfile.passiveTracking;
        } else if (map.getString(WoosmapMessageAndKey.profileTrackingKey).equals(Woosmap.ConfigurationProfile.visitsTracking)) {
          trackingProfile = Woosmap.ConfigurationProfile.visitsTracking;
        } else {
          promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.invalidProfileTrackingError);
          return;
        }
      }
      woosmap = Woosmap.getInstance().initializeWoosmap(reactContext);
      if (map.hasKey(WoosmapMessageAndKey.woosmapPrivateKeyString)) {
        WoosmapSettings.privateKeyWoosmapAPI = map.getString(WoosmapMessageAndKey.woosmapPrivateKeyString);
      }
      // Set the Delay of Duration data
      WoosmapSettings.numberOfDayDataDuration = 30;
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        this.woosmap.createWoosmapNotifChannel();
      }
      this.woosmap.onResume();
      if (!trackingProfile.isEmpty()) {
        woosmap.startTracking(trackingProfile);
      }
      promise.resolve(WoosmapMessageAndKey.successMessage);
      /* if (hasPermission(false)) {
        //check required permission first

      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.permissionNotGrantedMessage);
      }*/
    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }

  }

  /***
   * Checks if Woosmap object is instantiated.
   * @return true if woosmap sdk is initialized else false.
   */
  private boolean isWoosmapInitialized() {
    if (woosmap == null) {
      return false;
    }
    return true;
  }

  /***
   * Requests permissions. If the background permission is required then ACCESS_BACKGROUND_LOCATION is requested for devices above Android 9.
   * @param data Readable Array containing a boolean parameter to check if the background permission is required.
   */
  @ReactMethod
  private void requestPermissions(ReadableArray data, Promise promise) {
    try {
      if (data.isNull(0)) {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.permissionValueNotProvided);
      }
      boolean isBackground = data.getBoolean(0);
      PermissionAwareActivity activity = (PermissionAwareActivity) getCurrentActivity();
      mPermissionsRequestPromise = promise;
      if (activity != null) {
        if (Build.VERSION.SDK_INT >= 23) {
          if (isBackground && Build.VERSION.SDK_INT >= 29) {
            activity.requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_BACKGROUND_LOCATION}, PERMISSIONS_REQUEST_CODE, this);
          } else {
            activity.requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, PERMISSIONS_REQUEST_CODE, this);
          }
        }
      }
    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }


  @Override
  public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    if (requestCode == PERMISSIONS_REQUEST_CODE && mPermissionsRequestPromise != null) {
      providePermissionStatus(mPermissionsRequestPromise);
      mPermissionsRequestPromise = null;
    }
    return true;
  }

  /***
   * Provide status of foreground and background location permission.
   * @param promise React native callback context.
   */
  private void providePermissionStatus(final Promise promise) {
    try {
      if (promise == null) {
        return;
      }
      Activity activity = getCurrentActivity();
      if (activity == null) {
        promise.resolve(WoosmapMessageAndKey.unknownMessage);
        return;
      }

      boolean foreground = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
      boolean background = foreground;
      boolean denied = ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.ACCESS_FINE_LOCATION);

      if (Build.VERSION.SDK_INT >= 29) {
        background = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
      }

      if (background) {
        promise.resolve(WoosmapMessageAndKey.backgroundPermissionGrantedMessage);
      } else if (foreground) {
        promise.resolve(WoosmapMessageAndKey.foregroundPermissionGrantedMessage);
      } else if (denied) {
        promise.resolve(WoosmapMessageAndKey.deniedPermissionMessage);
      } else {
        promise.resolve(WoosmapMessageAndKey.unknownMessage);
      }
    } catch (Exception ex) {
      promise.resolve(WoosmapMessageAndKey.unknownMessage);
    }
  }

  /***
   * Checks if the required location permissions are granted or not.
   * Returns DENIED if no permissions are granted.
   * Returns GRANTED_FOREGROUND if foreground location permission is granted.
   * Returns GRANTED_BACKGROUND if background location permission is granted.
   * Returns UNKNOWN if plugin is unable to determine or asking for permission without providing any permission.
   */
  @ReactMethod
  public void getPermissionsStatus(final Promise promise) {
    providePermissionStatus(promise);
  }

  /***
   * Check if the user has given location permission.
   * @param isBackground Pass true if the background permission needs to be checked.
   * @return boolean
   */
  private boolean hasPermission(boolean isBackground) {
    try {
      Activity activity = getCurrentActivity();
      if (activity == null) {
        return false;
      }
      if (!isBackground) {
        return ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
      }
      if (isBackground && Build.VERSION.SDK_INT >= 29) {
        return ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
      }

    } catch (Exception ex) {
      Log.e(NAME, ex.toString());
    }
    return false;
  }


  @Override
  public void onHostResume() {
    if (woosmap != null) {
      woosmap.onResume();
    }
  }

  @Override
  public void onHostPause() {
    if (woosmap != null) {
      woosmap.onPause();
    }
  }

  @Override
  public void onHostDestroy() {
    if(profileReadyListener!=null){
      woosmap.setProfileReadyListener(null);
      profileReadyListener=null;
    }
    if (woosmap != null) {
      woosmap.onDestroy();
    }

  }

  /***
   * Sets the Woosmap private API key for calling Woosmap APIs.
   * @param data accepts Woosmap API key in a Readable array.
   * @param promise React native callback context.
   */
  @ReactMethod
  public void setWoosmapApiKey(ReadableArray data, Promise promise) {
    try {
      if (isWoosmapInitialized()) {
        String apiKey = "";
        if (!data.isNull(0)) {
          apiKey = data.getString(0);
        }
        if (!apiKey.isEmpty()) {
          WoosmapSettings.privateKeyWoosmapAPI = apiKey;
          promise.resolve(WoosmapMessageAndKey.successMessage);
        } else {
          promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.woosmapKeyNotProvide);
        }
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.woosmapNotInitialized);
      }

    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /***
   * Starts Woosmap Geofencing tracking.
   * @param data Accepts tracking profile. Value can be either liveTracking, passiveTracking or stopsTracking.
   * @param promise React native callback context.
   */
  @ReactMethod
  public void startTracking(ReadableArray data, Promise promise) {
    try {
      if (isWoosmapInitialized()) {
        if (data.isNull(0)) {
          promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.trackingProfileNotProvided);
        }

        String trackingProfile = data.getString(0);
        if (trackingProfile.equals(Woosmap.ConfigurationProfile.liveTracking) ||
          trackingProfile.equals(Woosmap.ConfigurationProfile.passiveTracking) ||
          trackingProfile.equals(Woosmap.ConfigurationProfile.visitsTracking)) {
          woosmap.startTracking(trackingProfile);
          promise.resolve(WoosmapMessageAndKey.successMessage);
        } else {
          promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.invalidProfileTrackingError);
        }
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.woosmapNotInitialized);
      }
    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /***
   * Stops tracking
   * @param promise React native callback context.
   */
  @ReactMethod
  public void stopTracking(Promise promise) {
    try {
      if (isWoosmapInitialized()) {
        woosmap.stopTracking();
        promise.resolve(WoosmapMessageAndKey.successMessage);
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.woosmapNotInitialized);
      }

    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /***
   * Add watch to woosmap location data.
   * @param watchID Unique String value for location listener.
   * @param promise React native callback context.
   */
  @ReactMethod
  public void watchLocation(String watchID, Promise promise) {
    try {
      if (isWoosmapInitialized()) {
        if (locationReadyListener == null) {
          locationReadyListener = new WoosLocationReadyListener(reactContext);
          woosmap.setLocationReadyListener(locationReadyListener);
          promise.resolve(watchID);
        } else {
          promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.locationWatchAlreadyStarted);
        }
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.woosmapNotInitialized);
      }
    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /***
   * Clear woosmap location watch.
   * @param watchID Unique String value for location listener.
   * @param promise React native callback context.
   */
  @ReactMethod
  public void clearLocationWatch(String watchID, Promise promise) {
    try {
      if (locationReadyListener != null) {
        woosmap.setLocationReadyListener(null);
        locationReadyListener = null;
        promise.resolve(watchID);
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.locationWatchNotStarted);
      }
    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /***
   * Sets Sales Force Marketing Cloud credentials.
   * @param map accepts Sales Force Marketing Cloud credentials key in a ReadableMap.
   * @param promise React native callback context.
   */
  @ReactMethod
  private void setSFMCCredentials(ReadableMap map, Promise promise) {
    try {
      if (isWoosmapInitialized()) {
        if (!map.toHashMap().isEmpty()) {
          HashMap<String, String> SFMCInfo = new HashMap<>();
          String key;
          if (!map.hasKey(WoosmapMessageAndKey.SMFCauthenticationBaseURIkey)) {
            throw new Exception(WoosmapMessageAndKey.keyMissingMessage + ": " + WoosmapMessageAndKey.SMFCauthenticationBaseURIkey);
          }
          if (!map.hasKey(WoosmapMessageAndKey.SMFCrestBaseURIkey)) {
            throw new Exception(WoosmapMessageAndKey.keyMissingMessage + ": " + WoosmapMessageAndKey.SMFCrestBaseURIkey);
          }
          if (!map.hasKey(WoosmapMessageAndKey.SMFCclient_idkey)) {
            throw new Exception(WoosmapMessageAndKey.keyMissingMessage + ": " + WoosmapMessageAndKey.SMFCclient_idkey);
          }
          if (!map.hasKey(WoosmapMessageAndKey.SMFCclient_secretkey)) {
            throw new Exception(WoosmapMessageAndKey.keyMissingMessage + ": " + WoosmapMessageAndKey.SMFCclient_secretkey);
          }
          if (!map.hasKey(WoosmapMessageAndKey.SMFCcontactKey)) {
            throw new Exception(WoosmapMessageAndKey.keyMissingMessage + ": " + WoosmapMessageAndKey.SMFCcontactKey);
          }

          Iterator<String> keys = map.toHashMap().keySet().iterator();

          while (keys.hasNext()) {
            key = keys.next();
            SFMCInfo.put(key, map.getString(key));
          }
          WoosmapSettings.SFMCCredentials = SFMCInfo;
          promise.resolve(WoosmapMessageAndKey.successMessage);
        } else {
          promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.credentialEmptyMessage);
        }
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.woosmapNotInitialized);
      }

    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /***
   * Add watch to woosmap region data.
   * @param watchID Unique String value for region listener.
   * @param promise React native callback context.
   */
  @ReactMethod
  public void watchRegions(String watchID, Promise promise) {
    try {
      if (isWoosmapInitialized()) {
        if (regionReadyListener == null) {
          regionReadyListener = new WoosRegionReadyListener(reactContext);
          woosmap.setRegionLogReadyListener(regionReadyListener);
          woosmap.setRegionReadyListener(regionReadyListener);
          promise.resolve(watchID);
        } else {
          promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.regionWatchAlreadyStarted);
        }
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.woosmapNotInitialized);
      }
    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /***
   * Clear woosmap region watch.
   * @param watchID Unique String value for region listener.Which is getting
   * @param promise React native callback context.
   */

  @ReactMethod
  public void clearRegionsWatch(String watchID, Promise promise) {
    try {
      if (regionReadyListener != null) {
        woosmap.setRegionLogReadyListener(null);
        woosmap.setRegionReadyListener(null);
        regionReadyListener = null;
        promise.resolve(watchID);
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.regionWatchNotStarted);
      }
    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /***
   * Set radius of POI
   * @param radius  A string containing POI radius value in number,string,double format.
   * @param promise React native callback context.
   */
  @ReactMethod
  public void setPoiRadius(String radius, Promise promise) {
    try {
      if (isWoosmapInitialized()) {
        if (radius.isEmpty()) {
          throw new Exception(WoosmapMessageAndKey.radiusEmptyMessage);
        }
        if (onlyContainsNumbers(radius)) {
          WoosmapSettings.poiRadius = Integer.parseInt(radius);
          promise.resolve(WoosmapMessageAndKey.successMessage);
        } else if (onlyContainsDouble(radius)) {
          double d = Double.parseDouble(radius);
          WoosmapSettings.poiRadius = (int) Math.round(d);
          promise.resolve(WoosmapMessageAndKey.successMessage);
        } else {
          WoosmapSettings.poiRadiusNameFromResponse = radius;
          promise.resolve(WoosmapMessageAndKey.successMessage);
        }
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.woosmapNotInitialized);
      }
    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /***
   * Its check string is integer or not.
   * @param text string for checking if it contains only number or not.
   * @return true boolean value if string is only number else false.
   */
  private boolean onlyContainsNumbers(String text) {
    try {
      Long.parseLong(text);
      return true;
    } catch (NumberFormatException ex) {
      return false;
    }
  }

  /***
   * Its check string is double or not.
   * @param text String for checking if it contain double or not.
   * @return true boolean value if string is double else false.
   */
  private boolean onlyContainsDouble(String text) {
    try {
      Double.parseDouble(text);
      return true;
    } catch (NumberFormatException ex) {
      return false;
    }
  }

  /**
   * Adds/updates a region in DB as well as geofence collection
   * @param map Readable map with region detail.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  public void addRegion(ReadableMap map, Promise promise) {
    try {
      Region region;
      if (isWoosmapInitialized()) {
        if (map.toHashMap().isEmpty()) {
          throw new Exception(WoosmapMessageAndKey.regionInfoEmptyMessage);
        }
        region = new Region();
        region.identifier = map.getString("regionId");
        region.idStore = map.hasKey("idStore") ? map.getString("idStore") : "";
        region.lat = map.getDouble("lat");
        region.lng = map.getDouble("lng");
        region.type = map.hasKey("type") ? map.getString("type") : "";
        region.radius = map.getDouble("radius");

        WoosmapTask.getInstance(reactContext).addRegion(region, promise);
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode, WoosmapMessageAndKey.woosmapNotInitialized);
      }
    } catch (Exception ex) {
      promise.reject(WoosmapMessageAndKey.errorCode, ex.getMessage());
    }
  }

  /**
   * Gets saved region from the database.
   * @param regionid A string unique value for region.
   * @param promise React native callback context.
   */
     @RequiresApi(api = Build.VERSION_CODES.N)
     @ReactMethod
     public void getRegions(String regionid, Promise promise){
      try{
        if (isWoosmapInitialized()){
          if(!regionid.isEmpty()){
            WoosmapTask.getInstance(reactContext).enqueGetRegionsRequest(regionid,promise);

          }else {
            promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.requiredRegionid);
          }

        }else {
          promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
        }
      }
      catch (Exception ex){
        promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
      }
    }

  /**
   * Gets all saved region from the database.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  public void getAllRegions(Promise promise){
    try{
      if (isWoosmapInitialized()){
        WoosmapTask.getInstance(reactContext).enqueGetRegionsRequest(promise);
      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }

  /***
   * Removes the region by given region id.
   * @param regionid A unique string region id which is to be removed.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  private void removeRegion(String regionid, Promise promise){
    try{
      if (isWoosmapInitialized()){
        if(!regionid.isEmpty()){
          WoosmapTask.getInstance(reactContext).removeRegion(regionid,promise);
        }else {
          promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.requiredRegionid);
        }
      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }

  /***
   * Removes all region from saved database.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  private void removeAllRegions(Promise promise){
    try{
      if (isWoosmapInitialized()){
        WoosmapTask.getInstance(reactContext).removeRegion("",promise);
      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }

  /***
   * Removes all POI from saved database.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  private void removeAllPois(Promise promise){
    try{
      if (isWoosmapInitialized()){
        WoosmapTask.getInstance(reactContext).removeAllPois(promise);
      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }

  /**
   * Gets all saved POIs from the database.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  public void getAllPois(Promise promise){
    try{
      if (isWoosmapInitialized()){
        WoosmapTask.getInstance(reactContext).enqueGetAllPoiRequest(promise);
      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }

  /**
   * Gets saved POI info from the database.
   * @param poiID A unique string value of locationID/StoreID for POI which user want to fetch.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  public void getPoi(String poiID, Promise promise){
    try{
      if (isWoosmapInitialized()){
        if(!poiID.isEmpty()){
          WoosmapTask.getInstance(reactContext).enqueGetPOIRequest(poiID,promise);

        }else {
          promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.requiredLocationid);
        }

      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }

  /**
   * Gets saved location from the database.
   * @param locationid A string unique value for location.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  private void getLocation(String locationid, Promise promise){
    try{
      if (isWoosmapInitialized()){
        if(!locationid.isEmpty()){
          WoosmapTask.getInstance(reactContext).enqueueGetLocationRequest(locationid,promise);

        }else {
          promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.requiredLocationID);
        }

      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }

  /**
   * Gets all saved location from the database.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  private void getAllLocations(Promise promise){
    try{
      if (isWoosmapInitialized()){
        WoosmapTask.getInstance(reactContext).enqueueGetLocationRequest(promise);
      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }

  /***
   * Removes all location from saved database.
   * @param promise React native callback context.
   */
  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  private void removeAllLocations(Promise promise){
    try{
      if (isWoosmapInitialized()){
        WoosmapTask.getInstance(reactContext).removeAllLocation(promise);
      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }


  private Woosmap.ProfileReadyListener profileReadyListener;

  /***
   * Set custom tracking profile if preset tracking profile don't match your requirement.
   * @param mode A string value which can be local or external.
   * @param source Location of file in json format.
   *               1.Local mode put json file in assets folder and provide file name as source.
   *               2.External mode put json file in server and provide file url as source.
   * @param promise React native callback context.
   */
  @ReactMethod
  public void startCustomTracking(String mode,String source, Promise promise){
    try{
      if (isWoosmapInitialized()){
        profileReadyListener= (status, errors) -> {
          try {
            if(status){
              promise.resolve(WoosmapMessageAndKey.successMessage);
            }else {
              promise.reject(WoosmapMessageAndKey.errorCode,errors.get(0));
            }
          }catch (Exception ex){
            promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
          }
        };
        woosmap.setProfileReadyListener(profileReadyListener);
        if(mode.equalsIgnoreCase(WoosmapMessageAndKey.localMode)||mode.equalsIgnoreCase(WoosmapMessageAndKey.externalMode)){
          woosmap.startCustomTracking(source);
        }else {
          promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.invalidProfileSourceType);
        }
      }else {
        promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.woosmapNotInitialized);
      }
    }
    catch (Exception ex){
      promise.reject(WoosmapMessageAndKey.errorCode,ex.getMessage());
    }
  }


}
