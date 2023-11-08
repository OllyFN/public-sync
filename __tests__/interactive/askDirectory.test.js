import askDirectory from '../../src/interactive/askDirectory.js';
import readline from 'readline';
import validateDirectory from '../../src/interactive/validateDirectory.js';

jest.mock('readline', () => ({
  question: jest.fn()
}));

jest.mock('../../src/interactive/validateDirectory');

describe('askDirectory', () => {
  let answersQueue;

  beforeEach(() => {
    jest.clearAllMocks();
    answersQueue = [];
    readline.question.mockImplementation((message, callback) => {
      const answer = answersQueue.shift();
      
      if (answer === undefined) {
        throw new Error('readline.question was called without an answer');
      }
      process.nextTick(() => callback(answer));
    });
  });

  test('returns directory and flags when directory is an empty string and mustExist is false', async () => {
    answersQueue.push(' ', 'existingDir -s');
    validateDirectory.mockImplementation(dir => dir === 'existingDir');
    const result = await askDirectory('message', 'path/to/', readline);
    expect(result).toEqual(['existingDir', ['-s']]);
  });

  test('returns directory and flags when directory exists and mustExist is true', async () => {
    answersQueue.push('existingDir -f');
    validateDirectory.mockReturnValue(true);
    const result = await askDirectory('message', 'path/to/', readline, true);
    expect(result).toEqual(['existingDir', ['-f']]);
  });
  
  test('asks again when directory does not exist and mustExist is true', async () => {
    answersQueue.push('nonExistingDir', 'existingDir -s');
    validateDirectory.mockImplementation((_, dir) => dir === 'existingDir');
    const result = await askDirectory('message', 'path/to/', readline, true);
    expect(result).toEqual(['existingDir', ['-s']]);
  });
  
  test('returns directory and flags when directory does not exist and mustExist is false', async () => {
    answersQueue.push('nonExistingDir -s');
    validateDirectory.mockReturnValue(false);
    const result = await askDirectory('message', 'path/to/', readline, false);
    expect(result).toEqual(['nonExistingDir', ['-s']]);
  });
  
  test('asks again when invalid flag is provided', async () => {
    answersQueue.push('existingDir -z', 'existingDir -s');
    validateDirectory.mockReturnValue(true);
    const result = await askDirectory('message', './', readline, true);
    expect(result).toEqual(['existingDir', ['-s']]);
  });
});