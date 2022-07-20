import db from '../models/index.js';
import {getLog} from '../../logger/index.js';

const log = getLog('services:storage-service'); // убрать!

const File = db.file;
const User = db.user;

async function create(data, transaction = null) {
  try {
    return await User.findOrCreate({
      where: {id: data.id},
      default: {
        id: data.id,
        diskSpace: data.diskSpace,
        usedSpace: data.usedSpace
      }, transaction})
      .then((data) => {
        const user = data?.[0];

        log.trace({
          id: user.id,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace
        },
        'User created');

        return user;
      });
  } catch (err) {
    log.error({
      err: err,
      modelName: User.getTableName()
    }, 'Failed to create a user');
  };
};

async function addFileToUser(file, user, t = null) {
  try {
    const hasAssociation = await User.findByPk(user.id, {
      attributes: ['id'],
      include: {
        model: File,
        attributes: ['id'],
        where: {
          id: file.id
        }
      }
    }).then((data)=> {
      if (data) {
        console.dir(data?.getFiles());
        log.trace({
          user: data?.id,
          file: file?.id
        }, `User id:${data?.id} has file id: ${file?.id} already`);
      } else {
        log.trace({
          user: user?.id,
          file: file?.id
        }, `Association between user id:${user?.id} add file id:${file?.id} not found`);
      }

      return data;
    });

    if (!hasAssociation) {
      return await user.addFile(file, {transaction: t});
    } else {
      return console.log('CAN NOT CREATE FILE');
    }
  } catch (err) {
    log.error({
      err: err,
      modelName: User.getTableName()
    }, 'Failed to add file');
  }
};

async function deleteFile(fileId, userId) {
  try {
    const _user = await User.findByPk(userId); // не обязательный

    if (!_user) {
      throw new Error('User not found!'); // выкинуть кастомные ошибки
    }
    const _file = await File.findByPk(fileId); // не обязательный

    if (!_file) {
      throw new Error('File not found!');
    }

    return await _user.removeFile(fileId).then((data) => {
      console.dir(data);
      if (data) {
        log.trace({
          user: _user?.id,
          file: _file?.id
        }, `User ${_user?.id} deleted the file ${_file?.id}`);

        return true;
      } else {
        log.trace({
          user: _user?.id,
          file: _file?.id
        }, `User ${_user?.id} does not have this file`);

        return false;
      }
    });
  } catch (err) {
    log.error({
      err: err,
      modelName: User.getTableName()
    }, 'Failed to delete file');
  }
};

async function findAllFiles(userId, limit, offset) {
  try {
    return await User.findAll({
      where: {id: userId},
      include: [{
        model: File,
        attributes: {
          include: [[db.sequelize.literal(`(SELECT COUNT(file_id) from user_files WHERE user_id=${userId})`), 'countFiles']] // придумать как обойтись без этого
        },
        required: false
      }],
      limit: Number(limit) || null,
      offset: Number(offset) || null,
      subQuery: false,
      distinct: true
    }).then((data)=>{
      const [{Files = []} = []] = data;
      const countFiles = Files?.[0]?.dataValues?.countFiles || 0;

      if (countFiles > 0) {
        log.trace({
          userId: userId,
          filesCount: countFiles
        },
        `User id:${userId} has ${countFiles} files`);

        return {Files, countFiles};
      } else {
        log.trace({
          userId: userId,
          filesCount: null
        },
        `User id:${userId} has no files`);

        return null;
      }
    });
  } catch (err) {
    log.error({
      err: err,
      modelName: User.getTableName()
    }, `Failed to finde the files associated with user ${userId}`);
  };
}

export default {
  create,
  addFileToUser,
  deleteFile,
  findAllFiles
};
