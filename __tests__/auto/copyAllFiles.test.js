import fs from 'fs-extra';
import path from 'path';
import copyAllFiles from '../../src/auto/copyAllFiles.js';

jest.mock('fs-extra');

describe('copyAllFiles', () => {
  beforeEach(() => {
    fs.readdirSync.mockReturnValue(['dir1', 'dir2']);
    fs.copySync.mockImplementation(() => {});
    fs.removeSync.mockImplementation(() => {});
  });

  it('copies all files excluding the ones in excludeDirs', () => {
    // ... existing test ...
  });

  it('does not copy files in excludeDirs', () => {
    fs.readdirSync.mockReturnValue(['./exclude/dir1', 'dir2', '/public', 'exclude/file.txt']);
    const config = {
      privateDir: './',
      publicDir: '/public',
      debug: {
        showCopied: true,
        showNotCopied: false,
      },
      excludeDirs: [['/*exclude/*', '']],
    };

    copyAllFiles(config, []);

    expect(fs.copySync).toHaveBeenCalledTimes(1);
  });

  it('handles errors when copying files', () => {
    fs.readdirSync.mockReturnValue(['dir1']);
    fs.copySync.mockImplementation(() => {
      throw new Error('Test error');
    });
    const config = {
      privateDir: '/private',
      publicDir: '/public',
      debug: {
        showCopied: true,
        showNotCopied: false,
      },
      excludeDirs: [],
    };
    expect(() => copyAllFiles(config, [])).toThrow('Test error');
  });
});