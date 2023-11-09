import askExcludeDirs from '../../src/interactive/askExcludeDirs.js';
import readline from 'readline';

jest.mock('readline', () => ({
  question: jest.fn()
}));

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
    const result = await askExcludeDirs(['-s'], readline);
    expect(result).toEqual([[/dir1/], ['-s', '-f']]);
  });

  test('returns directories and flags when directory is an empty string', async () => {
    answersQueue.push(' ');
    const result = await askExcludeDirs(['-s'], readline);
    expect(result).toEqual([[], ['-s']]);
  });
});