module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  maxWorkers: 1, // Exécuter les tests séquentiellement
  forceExit: true, // Forcer la sortie après les tests
  detectOpenHandles: true, // Détecter les handles ouverts
};
