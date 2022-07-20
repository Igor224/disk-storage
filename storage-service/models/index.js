import sequelize, {DataTypes} from '../dbConfig/db.js';
import file from './file.js';
import user from './user.js';

const db = {};

db.sequelize = sequelize;
db.file = file(sequelize, DataTypes);

db.user = user(sequelize, DataTypes);
db.file.belongsToMany(db.user, {
  through: 'user_files',
  foreignKey: 'file_id'
});
db.user.belongsToMany(db.file, {
  through: 'user_files',
  foreignKey: 'user_id'
});
export default db;
