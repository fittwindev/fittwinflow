module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|expo-camera|expo|expo-status-bar|react-native-reanimated|react-native-gesture-handler)/)'
  ]
};
