export default (dir) => {
  // If dir does not end with a /, add a $
  if (!dir.endsWith('/') && !dir.endsWith('$') && !dir.endsWith('/*')) {
    dir += '$';
  }
  return new RegExp(dir);
}