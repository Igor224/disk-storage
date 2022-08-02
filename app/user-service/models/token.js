export default function(sequelize, DataTypes) {
  const Token = sequelize.define('Token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING, allowNull: false}
  }, {timestamps: false});

  return Token;
};


