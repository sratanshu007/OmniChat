const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Disable Watchman to prevent macOS Downloads folder "Operation not permitted" permission errors
config.resolver.useWatchman = false;

// Resolve @expo/log-box and its internal modules directly to prevent bundling failure on Android/iOS
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === './src/index' && context.originModulePath && context.originModulePath.includes('@expo/log-box')) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'node_modules/@expo/log-box/src/index.native.tsx'),
    };
  }
  if (moduleName === '@expo/log-box/lib' || moduleName === '@expo/log-box') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'node_modules/@expo/log-box/src/index.native.tsx'),
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
