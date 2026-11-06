import packageJson from '../../package.json';

// `android/app/build.gradle` reads the same field for `versionName`.
export const APP_VERSION: string = packageJson.version;
