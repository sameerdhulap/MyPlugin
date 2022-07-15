import { AppRegistry } from 'react-native';
import { name as appName, testing } from './app.json';

import App from './src/App';
import JasmineTests from './tests/test';
if (testing === true) {
  AppRegistry.registerComponent(appName, () => JasmineTests);
} else {
  AppRegistry.registerComponent(appName, () => App);
}
