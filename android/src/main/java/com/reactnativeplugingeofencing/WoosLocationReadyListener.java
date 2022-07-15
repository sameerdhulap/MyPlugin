package com.reactnativeplugingeofencing;

import android.content.Context;
import android.location.Location;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.webgeoservices.woosmapgeofencing.Woosmap;

/***
 * Implements Woosmap Location Ready callbacks
 */
public class WoosLocationReadyListener implements Woosmap.LocationReadyListener {
  private ReactNativeHost reactNativeHost;
  private Context context;
  public WoosLocationReadyListener(Context context){
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
  public void LocationReadyCallback(Location location) {
    try {
      ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
      reactNativeHost = reactApplication.getReactNativeHost();
      sendEvent(WoosmapMessageAndKey.locationSuccessCallbackName, WoosmapUtil.getLocationWritableMap(location));
    }catch (Exception ex){
      sendEvent(WoosmapMessageAndKey.locationErrorCallbackName, ex.getMessage());
    }

  }
}
