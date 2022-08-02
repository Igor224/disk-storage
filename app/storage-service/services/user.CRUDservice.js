import db from '../models/index.js';
import {getLog} from '../../../packages/logger/index.js';

const log = getLog('services:storage-service');

const File = db.file;
const User = db.user;

async function findOrCreate(data, transaction = null) {
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

        return data;
      });
  } catch (err) {
    log.error({
      err: err,
      modelName: User.getTableName()
    }, 'Failed to create a user');
  };
};

async function findAllFiles(userId, limit, offset) {
  try {
    return await User.findAll({
      where: {id: userId},
      include: [{
        model: File,
        attributes: {
          include: [[db.sequelize.literal(`(SELECT COUNT(file_id) from user_files WHERE user_id=${userId})`), 'countFiles']]
        },
        required: false
      }],
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
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
    }, `Failed to find the files associated with user ${userId}`);
  };
}

export default {
  findOrCreate,
  findAllFiles
};
