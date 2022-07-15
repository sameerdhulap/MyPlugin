package com.reactnativeplugingeofencing;

import android.content.Context;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.webgeoservices.woosmapgeofencing.Woosmap;
import com.webgeoservices.woosmapgeofencing.database.Region;
import com.webgeoservices.woosmapgeofencing.database.RegionLog;

/***
 * Implements Woosmap Region callbacks
 */
public class WoosRegionReadyListener implements Woosmap.RegionReadyListener,Woosmap.RegionLogReadyListener {

  private ReactNativeHost reactNativeHost;
  private Context context;
  public WoosRegionReadyListener(Context context){
    this.context=context;
  }
  private void sendEvent(final String eventName, final Object data) {
    final ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
    ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
    if (reactContext != null) {
      reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
    }
  }
  @Override
  public void RegionLogReadyCallback(RegionLog regionLog) {
    try {
      ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
      reactNativeHost = reactApplication.getReactNativeHost();
      sendEvent(WoosmapMessageAndKey.regionSuccessCallbackName, WoosmapUtil.getRegionWritableMap(regionLog));
    }catch (Exception ex){
      sendEvent(WoosmapMessageAndKey.regionErrorCallbackName, ex.getMessage());
    }
  }

  @Override
  public void RegionReadyCallback(Region region) {
   
  }
}
