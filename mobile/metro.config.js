const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Disable Watchman to prevent macOS Downloads folder "Operation not permitted" permission errors
config.resolver.useWatchman = false;

// Direct resolve for @expo/log-box
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === '@expo/log-box' ||
    moduleName === '@expo/log-box/lib' ||
    moduleName.startsWith('@expo/log-box/lib') ||
    (context.originModulePath && context.originModulePath.includes('@expo/log-box') && moduleName.includes('index'))
  ) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'node_modules/@expo/log-box/lib.js'),
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
