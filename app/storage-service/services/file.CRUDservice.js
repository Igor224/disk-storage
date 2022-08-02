import db from '../models/index.js';
import {getLog} from '../../../packages/logger/index.js';

const log = getLog('services:storage-service');

const File = db.file;
const User = db.user;

async function findOrCreate(data, transaction = null) {
  try {
    return await File.findOrCreate({
      where: {md5: data.md5},
      defaults: {
        name: data.name,
        extention: data.extention,
        md5: data.md5,
        type: data.type,
        size: data.size
      }, transaction})
      .then((data) => {
        console.dir(data);
        const file = data?.[0];

        log.trace({
          id: file.id,
          name: file.name,
          extention: file.extention,
          md5: file.md5,
          type: file.type,
          size: file.size
        },
        'File created');

        return data;
      });
  } catch (err) {
    log.error({
      err: err,
      modelName: File.getTableName()
    }, 'Failed to create a file');
  };
};

async function findById(fileId, userId) {
  try {
    return await File.findByPk(fileId)
      .then((data)=> {
        if (data) {
          console.log('DATA: ', data);
          log.trace({
            fileId: data.id
          }, `File id:${data.id} exist`);
        } else {
          log.trace({
            fileId: fileId
          }, `File id:${fileId} was deleted or not exist`);

          return null;
        }

        return data;
      });
  } catch (err) {
    log.error({
      err: err,
      modelName: File.getTableName()
    }, 'Failed to finde file');
  }
};

async function findAllUsers(fileId) {
  try {
    return await File.findAll({
      where: {id: fileId},
      attributes: ['users.id', [db.sequelize.fn('COUNT',
        db.sequelize.col('users.id')), 'items']],
      include: User
    }).then((data) => {
      const [{dataValues: {items}}] = data;

      if (items > 0) {
        log.trace({
          fileId: fileId,
          users: items
        },
        `File id:${fileId} belongs to ${items} users`);

        return items;
      } else {
        log.trace({
          fileId: fileId,
          users: null
        },
        `File id:${fileId} belongs to nobody`);

        return null;
      }
    });
  } catch (err) {
    log.error({
      err: err,
      modelName: File.getTableName()
    }, 'Failed to find users');
  };
}

async function deleteFileDB(fileId) {
  try {
    return await File.destroy({
      where: {id: fileId}
    })
      .then((data) => {
        log.trace({
          fileId: fileId
        },
        `File id:${fileId} was destroed`);

        return data;
      });
  } catch (err) {
    log.error({
      err: err,
      modelName: File.getTableName()
    }, 'Failed to find users');
  };
}
export default {
  findOrCreate,
  findById,
  findAllUsers,
  deleteFileDB
};
