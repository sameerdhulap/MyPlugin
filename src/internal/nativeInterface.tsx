import { NativeModules } from 'react-native';
let PluginGeofencing = NativeModules.PluginGeofencing;

if (!PluginGeofencing) {
  throw new Error('NativeModules.PluginGeofencing is undefined');
}

export default PluginGeofencing;
