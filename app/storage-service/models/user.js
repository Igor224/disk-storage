export default function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    diskSpace: {type: DataTypes.INTEGER, defaultValue: 1024 ** 3},
    usedSpace: {type: DataTypes.INTEGER, defaultValue: 0}
  });

  return User;
};

