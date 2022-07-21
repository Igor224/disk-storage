export default function(sequelize, DataTypes) {
  const Token = sequelize.define('Token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING, allowNull: false}
    // user_id: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: User,
    //     key: 'id'
    //   }
    // }
  }, {timestamps: false});

  return Token;
};


