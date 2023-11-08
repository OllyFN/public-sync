import fs from 'fs';
import validateDirectory from '../../src/interactive/validateDirectory';

jest.mock('fs');

describe('validateDirectory', () => {
  it.each([
    ['existingDir', true],
    ['nonExistingDir', false],
    ['', false]
  ])('returns %s for directory %s', (dir, expected) => {
    fs.existsSync.mockReturnValue(expected);
    expect(validateDirectory('./pathToDirectory/', dir)).toBe(expected);
    jest.clearAllMocks();
  });
});