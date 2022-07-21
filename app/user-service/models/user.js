export default function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false}
  }, {timestamps: false});

  return User;
};
