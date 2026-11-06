/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { keepLayoutLeftToRight } from './src/services/deviceLocale';

keepLayoutLeftToRight();
AppRegistry.registerComponent(appName, () => App);
