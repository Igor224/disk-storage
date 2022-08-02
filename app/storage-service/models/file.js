export default function(sequelize, DataTypes) {
  const File = sequelize.define('File', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    extention: {type: DataTypes.STRING, allowNull: false},
    md5: {type: DataTypes.STRING, unique: true, allowNull: false},
    type: {type: DataTypes.STRING, defaultValue: 'unknown'},
    size: {type: DataTypes.STRING, defaultValue: 0}
  });

  return File;
};
