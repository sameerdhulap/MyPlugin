package com.reactnativeplugingeofencing;

import android.location.Location;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.webgeoservices.woosmapgeofencing.database.MovingPosition;
import com.webgeoservices.woosmapgeofencing.database.POI;
import com.webgeoservices.woosmapgeofencing.database.Region;
import com.webgeoservices.woosmapgeofencing.database.RegionLog;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

/***
 * Contains misc. utility functions.
 */
public class WoosmapUtil {
  private static final String TAG="WoosmapUtil";

  protected static WritableMap getLocationWritableMap(Location location){
    WritableMap map=new WritableNativeMap();
    try {
      map.putDouble("latitude", location.getLatitude());
      map.putDouble("longitude", location.getLongitude());
      map.putString("locationid", "1");
      map.putString("locationdescription", "description");
      map.putDouble("date", location.getTime());
    }catch (Exception ex){
      Log.e(TAG,ex.toString());
    }
    return map;
  }
  public static WritableMap getRegionWritableMap(RegionLog regionLog){
    WritableMap map=new WritableNativeMap();
    try{
      map.putDouble("longitude", regionLog.lng);
      map.putDouble("latitude", regionLog.lat);
      map.putDouble("date", regionLog.dateTime);
      map.putBoolean("didenter", regionLog.didEnter);
      if(!regionLog.idStore.isEmpty()){
        map.putString("identifier", regionLog.idStore);
      }else {
        map.putString("identifier", regionLog.identifier);
      }
      map.putDouble("radius", regionLog.radius);
      map.putBoolean("frompositiondetection", regionLog.isCurrentPositionInside);
      return map;
    }
    catch (Exception ex){
      Log.e(TAG,ex.toString());
    }
    return null;
  }

  public static WritableMap getRegionWritableMap(Region region){
    WritableMap map=new WritableNativeMap();
    try{
      map.putDouble("longitude", region.lng);
      map.putDouble("latitude", region.lat);
      map.putDouble("date", region.dateTime);
      map.putBoolean("didenter", region.didEnter);
      if(!region.idStore.isEmpty()){
        map.putString("identifier", region.idStore);
      }else {
        map.putString("identifier", region.identifier);
      }
      map.putDouble("radius", region.radius);
      map.putBoolean("frompositiondetection", region.isCurrentPositionInside);
      return map;
    }
    catch (Exception ex){
      Log.e(TAG,ex.toString());
    }
    return null;
  }

  @Nullable
  protected static WritableMap getPOIWritableMap(POI poi){
    WritableMap map=new WritableNativeMap();
    try{
      map.putDouble("date", poi.dateTime);
      map.putDouble("distance", poi.distance);
      map.putString("locationid", String.valueOf(poi.locationId));
      map.putDouble("latitude", poi.lat);
      map.putDouble("longitude", poi.lng);
      map.putString("city", poi.city);
      map.putString("idstore", poi.idStore);
      map.putString("name", poi.name);
      map.putString("duration", poi.duration);
      map.putString("zipcode", poi.zipCode);
      //map.putString("jsondata", poi.data);
      try {
        JSONObject obj = new JSONObject(poi.data);
        map.putMap("jsondata", convertJsonToMap(obj));
      } catch (Throwable t) {
        Log.e("Geofence Plugin", "Could not parse malformed JSON: \"" + poi.data + "\"");
      }

      return map;
    }
    catch (Exception ex){
      Log.e(TAG,ex.toString());
    }
    return null;
  }

  public static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
    WritableArray array = new WritableNativeArray();

    for (int i = 0; i < jsonArray.length(); i++) {
      Object value = jsonArray.get(i);
      if (value instanceof JSONObject) {
        array.pushMap(convertJsonToMap((JSONObject) value));
      } else if (value instanceof JSONArray) {
        array.pushArray(convertJsonToArray((JSONArray) value));
      } else if (value instanceof Boolean) {
        array.pushBoolean((Boolean) value);
      } else if (value instanceof Integer) {
        array.pushInt((Integer) value);
      } else if (value instanceof Double) {
        array.pushDouble((Double) value);
      } else if (value instanceof String) {
        array.pushString((String) value);
      } else {
        array.pushString(String.valueOf(value));
      }
    }
    return array;
  }

  private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
    WritableMap map = new WritableNativeMap();

    Iterator<String> iterator = jsonObject.keys();
    while (iterator.hasNext()) {
      String key = iterator.next();
      Object value = jsonObject.get(key);
      if (value instanceof JSONObject) {
        map.putMap(key, convertJsonToMap((JSONObject) value));
      } else if (value instanceof  JSONArray) {
        map.putArray(key, convertJsonToArray((JSONArray) value));
      } else if (value instanceof  Boolean) {
        map.putBoolean(key, (Boolean) value);
      } else if (value instanceof  Integer) {
        map.putInt(key, (Integer) value);
      } else if (value instanceof  Double) {
        map.putDouble(key, (Double) value);
      } else if (value instanceof String)  {
        map.putString(key, (String) value);
      } else {
        map.putString(key, String.valueOf(value));
      }
    }
    return map;
  }
  protected static WritableMap getMovingPositionObject(MovingPosition location){
    try{
      WritableMap map=new WritableNativeMap();
      map.putDouble("latitude", location.lat);
      map.putDouble("longitude", location.lng);
      map.putString("locationid", String.valueOf(location.id));
      map.putString("locationdescription", "description");
      map.putDouble("date", location.dateTime);
      return map;
    }
    catch (Exception ex){
      Log.e(TAG,ex.toString());
    }
    return null;
  }
  protected static boolean onlyContainsNumbers(String text) {
    try {
      Long.parseLong(text);
      return true;
    } catch (NumberFormatException ex) {
      return false;
    }
  }


}
