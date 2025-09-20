module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation)/)',
  ],
  moduleNameMapper: {
    '^react-native-gesture-handler$': '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  },
};
