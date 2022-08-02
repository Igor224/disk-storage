import DTO from '../dtos/file-dto.js';
import FSservice from '../services/file.FSservice.js';
// import ApiError from '../../../packages/exceptions/api-errors.js';
import fs from 'fs';
import User from '../services/user.CRUDservice.js';
import File from '../services/file.CRUDservice.js';
import config from '../../../config/default.js';

const {storageServices: {diskStorOptions: {DIR, whiteList}}} = config;


async function uploadFile(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const file = req?.files.file;

    const fileDTO = new DTO(file);

    if (!whiteList.includes(fileDTO.extention)) {
      fs.unlinkSync(file.tempFilePath);

      return res.status(422).send('Prohibited file type.');
    }

    const [dbUser] = await User.findOrCreate({id: req.user.id});
    const [dbFile] = await File.findOrCreate(fileDTO);
    const hasUserFile = await dbUser.hasFile(dbFile);

    if (dbUser.usedSpace + file.size > dbUser.diskSpace) {
      return res.status(400).json({message: 'There no space on the disk'});
    }

    dbUser.usedSpace = dbUser.usedSpace + file.size;

    const path = `${DIR}\\${dbUser.id}`;

    const fileName = `${fileDTO.md5}.${fileDTO.extention}`;

    await FSservice.creatDir(path);

    if (fs.existsSync(path + '\\' + fileName) && hasUserFile) {
      return res.status(400).json({message: 'File already exist'}); // wrap in custom hundler
    }

    file.mv(`${path}\\${fileName}`, async function(err) { // wrap in promis
      if (err) {
        return res.status(500).send('fucking ERROR'); // wrap in custom hundler
      }
      await dbUser.addFile(dbFile);
      await dbUser.save();
      res.send(`File ${file.name} uploaded!`);
    });
  } catch (err) {
    return res.status(500).json({message: 'Upload error'});
  }
}

async function getFileInfo(req, res) {
  try {
    const userId = req.user.id;
    const file = await File.findById(req.params.id);
    const hasUserFile = await file.hasUser(userId);

    if (!hasUserFile) {
      return res.status(400).json({message: 'file not found'});
    }
    // const fileDTO = new DTO(file);

    return res.json(file);
  } catch (err) {
    console.log(err);

    return res.status(500).json({message: 'Can not get files'});
  }
}

async function getFiles(req, res) {
  try {
    let {limit, page} = req.query;
    const userId = req.user.id;
    const offset = limit * (page - 1);

    limit = limit * page;

    const files = await User.findAllFiles(userId, limit, offset);

    return res.json(files);
  } catch (err) {
    console.log(err);

    return res.status(500).json({message: 'Can not get files'});
  }
}
async function downloadFile(req, res) {
  try {
    const file = await File.findById(req.params.id);
    const userId = req.user.id;

    const hasUserFile = await file.hasUser(userId);

    if (hasUserFile) {
      // const path = fileService.getPath(file, userId); // make and move to the FsService!
      const path = `${DIR}\\${userId}\\${file.md5}.${file.extention}`;
      const fileName = `${file.md5}.${file.extention}`;

      if (!fs.existsSync(path)) {
        return res.status(500).json({message: 'Something went wrong'}); // wrap in custom hundler
      }

      return res.download(path, fileName);
    }

    return res.status(400).json({message: 'Download error'});
  } catch (err) {
    res.status(500).json({message: 'Download error'});
  }
}

async function deleteFile(req, res) {
  try {
    const file = await File.findById(req.params.id);
    const userId = req.user.id;

    const hasUserFile = await file.hasUser(userId);

    if (!hasUserFile) {
      return res.status(400).json({message: 'file not found'});
    }

    await file.removeUser(userId);
    const path = `${DIR}\\${userId}\\${file.md5}.${file.extention}`;
    const hasFileUsers = await File.findAllUsers(file.id);

    await FSservice.deleteFile(path);

    if (!hasFileUsers) {
      await file.deleteFileDB(file.id);
    }

    return res.json({message: 'File was deleted'});
  } catch (err) {
    return res.status(400).json({message: 'Somthing went wrong'});
  }
}

async function updateFile(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const oldFile = await File.findById(req.params.id);
    const newFile = req.files.file;
    const userId = req.user.id;
    const fileDTO = new DTO(newFile);


    if (!whiteList.includes(fileDTO.extention)) {
      fs.unlinkSync(newFile.tempFilePath);

      return res.status(422).send('Prohibited file type');
    }

    const [dbUser] = await User.findOrCreate({id: userId});
    const [dbFile] = await File.findOrCreate(fileDTO);
    const hasUserFile = await dbUser.hasFile(dbFile);
    const newPath = `${DIR}\\${dbUser.id}\\${fileDTO.md5}.${fileDTO.extention}`;

    if (fs.existsSync(newPath) && hasUserFile) {
      return res.status(400).json({message: 'File already exist'}); // заменить ошибку
    }
    dbUser.usedSpace = dbUser.usedSpace + newFile.size - oldFile.size;

    if (dbUser.usedSpace > dbUser.diskSpace) {
      return res.status(400).json({message: 'There no space on the disk'});
    }

    newFile.mv(newPath, async function(err) { // wrap in promis
      if (err) {
        return res.status(500).send('fucking ERROR'); //
      }
      await dbUser.addFile(dbFile);
      await dbUser.save(); // count space before!
    });

    await oldFile.removeUser(userId);
    const path = `${DIR}\\${userId}\\${oldFile.md5}.${oldFile.extention}`;
    const hasFileUsers = await File.findAllUsers(oldFile.id);

    await FSservice.deleteFile(path);

    if (!hasFileUsers) {
      await File.deleteFileDB(oldFile.id);
    }

    return res.status(200).json({message: 'File was updated'});
  } catch (err) {
    return res.status(400).json({message: 'Something went wrong'});
  }
}

export default {
  uploadFile,
  getFileInfo,
  getFiles,
  downloadFile,
  deleteFile,
  updateFile
};

