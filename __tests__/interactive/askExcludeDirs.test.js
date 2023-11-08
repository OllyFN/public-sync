import askExcludeDirs from '../../src/interactive/askExcludeDirs.js';
import readline from 'readline';
import createRegex from '../../src/utils/createRegex.js';

jest.mock('readline', () => ({
  question: jest.fn()
}));

jest.mock('../../src/utils/createRegex');

describe('askExcludeDirs', () => {
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

  test('returns directories and flags when directory is a valid regex', async () => {
    answersQueue.push('dir1 -f');
    createRegex.mockReturnValue(/dir1/);
    const result = await askExcludeDirs(['-s'], readline);
    expect(result).toEqual([[/dir1/], ['-s', '-f']]);
  });

  test('asks again when directory is an invalid regex', async () => {
    answersQueue.push('dir1', 'dir2 -f');
    createRegex.mockImplementation(dir => {
      if (dir === 'dir1') {
        throw new Error('Invalid regular expression');
      }
      return new RegExp(dir);
    });
    const result = await askExcludeDirs(['-s'], readline);
    expect(result).toEqual([[/dir2/], ['-s', '-f']]);
  });

  test('returns directories and flags when directory is an empty string', async () => {
    answersQueue.push(' ');
    const result = await askExcludeDirs(['-s'], readline);
    expect(result).toEqual([[], ['-s']]);
  });
});