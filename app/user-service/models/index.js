import sequelize, {DataTypes} from '../dbConfig/db.js';
import token from './token.js';
import user from './user.js';

const db = {};

db.sequelize = sequelize;
db.token = token(sequelize, DataTypes);
db.user = user(sequelize, DataTypes);

db.token.belongsTo(db.user);
db.user.hasOne(db.file);
export default db;
