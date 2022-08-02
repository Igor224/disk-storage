import fs from 'fs';
// import config from '../../../config/default.js';

function creatDir(path) {
  return new Promise(((resolve, reject) => {
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);

        return resolve({
          message: 'Directory was created',
          flag: true,
          path: path
        });
      } else {
        return resolve({
          message: 'Directory already exists',
          flag: false,
          path: path
        });
      }
    } catch (err) {
      return reject(err);
    }
  }));
}

// function getPath(model, id) {
//   return new Promise(((resolve, reject) => {
//     try {
//       if (!fs.existsSync(path)) {
//         fs.mkdirSync(path);

//         return resolve({
//           message: 'Directory was created',
//           flag: true,
//           path: path
//         });
//       } else {
//         return resolve({
//           message: 'Directory already exists',
//           flag: false,
//           path: path
//         });
//       }
//     } catch (err) {
//       return reject(err);
//     }
//   }));
// }
function deleteFile(path) {
  // const path = this.getPath(path); написать

  fs.unlinkSync(path);
}
export default {
  creatDir,
  // getPath
  deleteFile
};
