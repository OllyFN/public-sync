import interactiveCopy from '../../src/interactive/interactiveCopy.js';
import readline from 'readline';
import fs from 'fs-extra';
import askExcludeDirs from '../../src/interactive/askExcludeDirs.js';
import askDirectory from '../../src/interactive/askDirectory.js';
import validateDirectory from '../../src/interactive/validateDirectory.js';
import createRegex from '../../src/utils/createRegex.js';

const mockAnswersQueue = [];

jest.mock('readline', () => ({
  createInterface: () => ({
    question: (message, callback) => {
      const answer = mockAnswersQueue.shift();
      console.log(`ANSWER QUEUE SHIFT : ${answer} ${message}`);
      if (answer === undefined) {
        throw new Error('readlineInterface.question was called without an answer');
      }
      process.nextTick(() => callback(answer));
    },
    close: jest.fn()
  })
}));

jest.mock('fs-extra', () => ({
  removeSync: jest.fn(),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
  copySync: jest.fn()
}));

jest.mock('../../src/interactive/askExcludeDirs.js', () => jest.fn());
jest.mock('../../src/interactive/askDirectory.js', () => jest.fn());
jest.mock('../../src/interactive/validateDirectory.js', () => jest.fn());

describe('interactiveCopy', () => {
  let config;
  
  beforeEach(() => {
    jest.clearAllMocks();
    config = {
      excludeDirs: [['/*exclude/*', '']],
      publicDir: 'publicDir',
      privateDir: 'privateDir'
    };
    
    while(mockAnswersQueue.length>0) {
      mockAnswersQueue.pop();
    }
    askExcludeDirs.mockReturnValue([config.privateDir, []]);
  });
  
  test('copies files from private directory to public directory', async () => {
    mockAnswersQueue.push(' -f -d', '');
    validateDirectory.mockImplementation((_, dir) => dir === 'privateDir');
    askDirectory.mockReturnValue(['', ['-f', '-d']]);
    fs.readdirSync.mockReturnValue(['file1', 'file2', 'includedDir1', 'includedDir2', 'excludeDir1', 'excludeDir2']);
  
    await interactiveCopy(config);
  
    expect(fs.copySync).toHaveBeenCalledTimes(4);
  });
  
  test('overrides public directory if it already exists by using the o option', async () => {
    mockAnswersQueue.push(' -f -d', 'n', ' -f', 'o');
  
    validateDirectory.mockReturnValue(true);
    askDirectory.mockReturnValue(['', ['-f', '-d']]);
    fs.readdirSync.mockReturnValue([])

    await interactiveCopy(config);

    expect(fs.removeSync).toHaveBeenCalledTimes(1);
    expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
  });

  test('pastes to public directory if it already exists by using the y option', async () => {
    mockAnswersQueue.push(' -f -d -n', 'y');
  
    validateDirectory.mockReturnValue(true);
    askDirectory.mockReturnValue(['', ['-f', '-d']]);
    fs.readdirSync.mockReturnValue(['creatingDir/', 'creatingFile.txt']);

    await interactiveCopy(config);

    expect(fs.copySync).toHaveBeenCalledTimes(2);
    expect(fs.removeSync).toHaveBeenCalledTimes(0);
    expect(fs.mkdirSync).toHaveBeenCalledTimes(0);
  });
});