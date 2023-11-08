import createRegex from '../../src/utils/createRegex';

describe('createRegex', () => {
  it('adds a $ to the end of dir if it does not end with a /, $, or /*', () => {
    const dir = 'dir';
    const regex = createRegex(dir);
    expect(regex).toEqual(/dir$/);
  });

  it('does not add a $ to the end of dir if it ends with a /', () => {
    const dir = 'dir/';
    const regex = createRegex(dir);
    expect(regex).toEqual(/dir\//);
  });

  it('does not add a $ to the end of dir if it ends with a $', () => {
    const dir = 'dir$';
    const regex = createRegex(dir);
    expect(regex).toEqual(/dir$/);
  });

  it('does not add a $ to the end of dir if it ends with /*', () => {
    const dir = '/*node_modules/*';
    const regex = createRegex(dir);
    expect(regex).toEqual(/\/*node_modules\/*/);
  });
});