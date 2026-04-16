import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'client',
      rootDir: '.',
      roots: ['<rootDir>/src'],
      testEnvironment: 'jsdom',
      testMatch: ['**/*.test.ts', '**/*.test.tsx'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      moduleNameMapper: {
        '^@entities/(.*)$': '<rootDir>/src/entities/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '\\.(css|scss|sass)$': '<rootDir>/src/test/styleMock.ts',
      },
      setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/tsconfig.app.json',
          },
        ],
      },
    },
    {
      displayName: 'server',
      rootDir: '.',
      roots: ['<rootDir>/server'],
      testEnvironment: 'node',
      testMatch: ['**/*.test.ts'],
      moduleFileExtensions: ['ts', 'js', 'json'],
      moduleNameMapper: {
        '^@entities/(.*)$': '<rootDir>/src/entities/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
      },
      transform: {
        '^.+\\.ts$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/tsconfig.node.json',
          },
        ],
      },
    },
  ],
};

export default config;
