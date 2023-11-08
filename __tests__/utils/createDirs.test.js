// createDirs.test.js
import fs from 'fs-extra';
import createDirs from '../../src/utils/createDirs';

jest.mock('fs-extra', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

describe('createDirs', () => {
  let mockDirs;

  beforeEach(() => {
    // Reset the mock directories before each test
    mockDirs = new Set();

    fs.existsSync.mockImplementation((path) => mockDirs.has(path));
    fs.mkdirSync.mockImplementation((path) => mockDirs.add(path));

    // Clear the mock history of fs.mkdirSync
    fs.mkdirSync.mockClear();
  });

  it('creates directories if they do not exist', () => {
    const config = {
      publicDir: './public',
      privateDir: './private',
    };

    createDirs(config);

    // Check that the directories were created in the mock file system
    expect(mockDirs.has(config.publicDir)).toBe(true);
    expect(mockDirs.has(config.privateDir)).toBe(true);
  });

  it('does not create directories if they already exist', () => {
    const config = {
      publicDir: './public',
      privateDir: './private',
    };

    // Add the directories to the mock file system
    mockDirs.add(config.publicDir);
    mockDirs.add(config.privateDir);

    createDirs(config);

    // Check that mkdirSync was not called
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  it('throws an error if publicDir is not a string', () => {
    const config = {
      publicDir: 123,
      privateDir: './private',
    };

    expect(() => createDirs(config)).toThrow('publicDir must be a string');
  });

  it('throws an error if privateDir is not a string', () => {
    const config = {
      publicDir: './public',
      privateDir: 123,
    };

    expect(() => createDirs(config)).toThrow('privateDir must be a string');
  });

  it('throws an error if publicDir contains invalid characters', () => {
    const config = {
      publicDir: './publ\0ic',
      privateDir: './private',
    };

    expect(() => createDirs(config)).toThrow('publicDir contains invalid characters');

    // Check that the directories were not created in the mock file system
    expect(mockDirs.has(config.publicDir)).toBe(false);
    expect(mockDirs.has(config.privateDir)).toBe(false);
  });

  it('throws an error if privateDir contains invalid characters', () => {
    const config = {
      publicDir: './public',
      privateDir: './priv\0ate',
    };

    expect(() => createDirs(config)).toThrow('privateDir contains invalid characters');

    // Check that the directories were not created in the mock file system
    expect(mockDirs.has(config.publicDir)).toBe(false);
    expect(mockDirs.has(config.privateDir)).toBe(false);
  });
});