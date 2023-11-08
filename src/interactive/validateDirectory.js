import fs from 'fs-extra';
export default (dirPrefix, dir) => dir.trim().length > 0 && fs.existsSync(dirPrefix + dir);