const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable Watchman to prevent macOS Downloads folder "Operation not permitted" permission errors
config.resolver.useWatchman = false;

module.exports = config;
