const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Disable Watchman to prevent macOS Downloads folder "Operation not permitted" permission errors
config.resolver.useWatchman = false;

// Direct resolve for @expo/log-box
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName.startsWith('@expo/log-box') ||
    (context.originModulePath && context.originModulePath.includes('@expo/log-box'))
  ) {
    if (moduleName.endsWith('/utils') || moduleName.endsWith('utils.js')) {
      return {
        type: 'sourceFile',
        filePath: path.resolve(__dirname, 'node_modules/@expo/log-box/utils.js'),
      };
    }
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
