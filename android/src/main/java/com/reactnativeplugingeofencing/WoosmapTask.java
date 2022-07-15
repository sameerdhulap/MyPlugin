package com.reactnativeplugingeofencing;

import android.content.Context;
import android.os.Build;


import androidx.annotation.RequiresApi;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.google.android.gms.maps.model.LatLng;
import com.webgeoservices.woosmapgeofencing.Woosmap;
import com.webgeoservices.woosmapgeofencing.database.MovingPosition;
import com.webgeoservices.woosmapgeofencing.database.POI;
import com.webgeoservices.woosmapgeofencing.database.Region;
import com.webgeoservices.woosmapgeofencing.database.WoosmapDb;

import org.json.JSONObject;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.function.Supplier;

public class WoosmapTask {
  private static WoosmapTask _instance = null;
  private final Context context;

  public static WoosmapTask getInstance(Context context) {
    if (_instance == null) {
      _instance = new WoosmapTask(context);
    }
    return _instance;
  }

  private WoosmapTask(Context context) {
    this.context = context;
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  public void addRegion(final Region region, final Promise promise) {
    CompletableFuture.supplyAsync(() -> {
      try {
        if ((!region.type.isEmpty()) && (!region.type.equalsIgnoreCase(WoosmapMessageAndKey.isochroneTypeKey) && !region.type.equalsIgnoreCase(WoosmapMessageAndKey.circleTypeKey))) {
          throw new Exception(WoosmapMessageAndKey.validRegionTypeMessage);
        }
        if (region.idStore.isEmpty() && region.type.isEmpty()) {
          Woosmap.getInstance().addGeofence(region.identifier, new LatLng(region.lat, region.lng), (float) region.radius);
        } else if (!region.idStore.isEmpty() && region.type.isEmpty()) {
          Woosmap.getInstance().addGeofence(region.identifier, new LatLng(region.lat, region.lng), (float) region.radius, region.idStore);
        } else if (!region.type.isEmpty() && region.idStore.isEmpty()) {
          Woosmap.getInstance().addGeofence(region.identifier, new LatLng(region.lat, region.lng), (float) region.radius, region.type);
        } else {
          Woosmap.getInstance().addGeofence(region.identifier, new LatLng(region.lat, region.lng), (float) region.radius, region.idStore, region.type);
        }

      } catch (Exception ex) {
        throw new CompletionException(ex);
      }
      return region.identifier;
    }).whenComplete((data, throwable) -> {
      if (throwable != null) {
        promise.reject(WoosmapMessageAndKey.errorCode, throwable.getMessage());
      } else {
        promise.resolve(data);
      }
    });
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  public void enqueGetRegionsRequest(String regionID,Promise promise) {
    CompletableFuture.supplyAsync(() -> {
      try {
        Region region;
        region = WoosmapDb.getInstance(context).getRegionsDAO().getRegionFromId(regionID);
        if(region!=null){
          return WoosmapUtil.getRegionWritableMap(region);
        }
      } catch (Exception ex) {
        throw new CompletionException(ex);
      }
      return null;
    }).whenComplete((data, throwable) -> {
      if (throwable == null) {
        if(data==null){
          promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.invalidRegionid);
        }else {
          promise.resolve(data);
        }
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode,throwable.getMessage());
      }
    });
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  public void enqueGetRegionsRequest(Promise promise) {
    CompletableFuture.supplyAsync(() -> {
      try {
        Region[] regions;
        WritableArray array= Arguments.createArray();
        regions = WoosmapDb.getInstance(context).getRegionsDAO().getAllRegions();
        for (Region region : regions) {
          array.pushMap(WoosmapUtil.getRegionWritableMap(region));
        }
        return array;
      } catch (Exception ex) {
        throw new CompletionException(ex);
      }
    }).whenComplete((data, throwable) -> {
      if (throwable == null) {
        promise.resolve(data);
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode,throwable.getMessage());
      }
    });
  }
  @RequiresApi(api = Build.VERSION_CODES.N)
  public void removeRegion(String regionId, final Promise promise){
    CompletableFuture.supplyAsync((Supplier<Void>) () -> {
      try{
        if (!regionId.isEmpty()){
          Woosmap.getInstance().removeGeofence(regionId);
          WoosmapDb.getInstance(context).getRegionsDAO().deleteRegionFromId(regionId);
        }
        else{
          Woosmap.getInstance().removeGeofence();
          WoosmapDb.getInstance(context).getRegionsDAO().deleteAllRegions();
        }
      }
      catch (Exception ex){
        throw new CompletionException(ex);
      }
      return null;
    }).whenComplete((unused, throwable) -> {
      if (throwable==null){
       promise.resolve(WoosmapMessageAndKey.deleteMessage);
      }
      else{
        promise.reject(WoosmapMessageAndKey.errorCode,throwable.getMessage());
      }
    });
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  public void removeAllPois(final Promise promise){
    CompletableFuture.supplyAsync((Supplier<Void>) () -> {
      try{
          WoosmapDb.getInstance(context).getPOIsDAO().deleteAllPOIs();
      }
      catch (Exception ex){
        throw new CompletionException(ex);
      }
      return null;
    }).whenComplete((unused, throwable) -> {
      if (throwable==null){
        promise.resolve(WoosmapMessageAndKey.deleteMessage);
      }
      else{
        promise.reject(WoosmapMessageAndKey.errorCode,throwable.getMessage());
      }
    });
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  public void enqueGetAllPoiRequest(Promise promise) {
    CompletableFuture.supplyAsync(() -> {
      try {
        POI[] pois;
        WritableArray array= Arguments.createArray();
        pois = WoosmapDb.getInstance(context).getPOIsDAO().getAllPOIs();
        for (POI poi : pois) {
          array.pushMap(WoosmapUtil.getPOIWritableMap(poi));
        }
        return array;
      } catch (Exception ex) {
        throw new CompletionException(ex);
      }
    }).whenComplete((data, throwable) -> {
      if (throwable == null) {
        promise.resolve(data);
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode,throwable.getMessage());
      }
    });
  }
  @RequiresApi(api = Build.VERSION_CODES.N)
  public void enqueGetPOIRequest(String locationID,Promise promise) {
    CompletableFuture.supplyAsync(() -> {
      try {
        POI poi;
        poi = WoosmapDb.getInstance(context).getPOIsDAO().getPOIbyStoreId(locationID);
        if(poi!=null){
          return WoosmapUtil.getPOIWritableMap(poi);
        }else {
          if(WoosmapUtil.onlyContainsNumbers(locationID)){
            poi = WoosmapDb.getInstance(context).getPOIsDAO().getPOIbyLocationID(Integer.parseInt(locationID));
            if(poi!=null){
              return WoosmapUtil.getPOIWritableMap(poi);
            }
          }
        }
      } catch (Exception ex) {
        throw new CompletionException(ex);
      }
      return null;
    }).whenComplete((data, throwable) -> {
      if (throwable == null) {
        if(data==null){
          promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.invalidLocationid);
        }else {
          promise.resolve(data);
        }
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode,throwable.getMessage());
      }
    });
  }
  @RequiresApi(api = Build.VERSION_CODES.N)
  protected void enqueueGetLocationRequest(String locationID,Promise promise) {
    CompletableFuture.supplyAsync(() -> {
      try {
        MovingPosition requiredLocation=null;
        MovingPosition[]movingPosition;
        movingPosition = WoosmapDb.getInstance(context).getMovingPositionsDao().getMovingPositions(-1);
        for (MovingPosition location : movingPosition) {
          if(location.id==Integer.parseInt(locationID)){
            requiredLocation=location;
            break;
          }
        }
        if(requiredLocation!=null){
          return WoosmapUtil.getMovingPositionObject(requiredLocation);
        }

      } catch (Exception ex) {
        throw new CompletionException(ex);
      }
      return null;
    }).whenComplete((data, throwable) -> {
      if (throwable == null) {
        if(data==null){
          promise.reject(WoosmapMessageAndKey.errorCode,WoosmapMessageAndKey.invalidLocationID);
        }else {
          promise.resolve(data);
        }
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode,throwable.getMessage());
      }
    });
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  protected void enqueueGetLocationRequest(Promise promise) {
    CompletableFuture.supplyAsync(() -> {
      try {
        MovingPosition[]movingPosition;
        WritableArray array= Arguments.createArray();
        movingPosition = WoosmapDb.getInstance(context).getMovingPositionsDao().getMovingPositions(-1);
        for (MovingPosition location : movingPosition) {
          array.pushMap(WoosmapUtil.getMovingPositionObject(location));
        }
        return array;
      } catch (Exception ex) {
        throw new CompletionException(ex);
      }
    }).whenComplete((data, throwable) -> {
      if (throwable == null) {
        promise.resolve(data);
      } else {
        promise.reject(WoosmapMessageAndKey.errorCode,throwable.getMessage());
      }
    });
  }
  @RequiresApi(api = Build.VERSION_CODES.N)
  protected void removeAllLocation(final Promise promise){
    CompletableFuture.supplyAsync((Supplier<Void>) () -> {
      try{
        WoosmapDb.getInstance(context).getMovingPositionsDao().deleteAllMovingPositions();
      }
      catch (Exception ex){
        throw new CompletionException(ex);
      }
      return null;
    }).whenComplete((unused, throwable) -> {
      if (throwable==null){
        promise.resolve(WoosmapMessageAndKey.deleteMessage);
      }
      else{
        promise.reject(WoosmapMessageAndKey.errorCode,throwable.getMessage());
      }
    });
  }



}
