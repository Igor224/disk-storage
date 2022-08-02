import db from '../models/index.js';
import bcrypt from 'bcrypt';
import tokenService from './token-service.js';
import UserDto from '../dtos/user-dto.js';
import ApiError from '../../../packages/exceptions/api-errors.js';

const User = db.user;


async function signup(login, password) {
  const candidate = await User.findOne({where: {login: login}}); // вытащить или не надо?

  if (candidate) {
    throw ApiError.BadRequest(`User with ${login} login already exists `);
  }
  const hashPassword = await bcrypt.hash(password, 3);

  const {tokens, userDto} = await db.sequelize.transaction(async (t) => {
    const user = await User.create({login: login, password: hashPassword}, {transaction: t});

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    const token = await tokenService.saveToken(userDto.id, tokens.refreshToken, {transaction: t});

    await user.setToken(token, {transaction: t});

    return {tokens, userDto};
  });


  return {...tokens, user: userDto};
}

async function signin(login, password) {
  const user = await User.findOne({where: {login: login}});

  if (!user) {
    throw ApiError.BadRequest('User with such login does not exist');
  }
  const isPassEquals = await bcrypt.compare(password, user.password);

  if (!isPassEquals) {
    throw ApiError.BadRequest('Wrong password');
  }
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({...userDto});

  await db.sequelize.transaction(async (t) => {
    const token = await tokenService.saveToken(userDto.id, tokens.refreshToken, {transaction: t});

    await user.setToken(token, {transaction: t});
  });

  return {...tokens, user: userDto};
}

async function logout(refreshToken) {
  const token = await tokenService.removeToken(refreshToken);

  return token;
}

async function refresh(refreshToken) {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);

  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }
  const user = await User.findOne({where: {login: userData.login}});
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({...userDto});

  await tokenService.saveToken(userDto.id, tokens.refreshToken);

  return {...tokens, user: userDto};
}

export default {
  signup,
  signin,
  logout,
  refresh
};
