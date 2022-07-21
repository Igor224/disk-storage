const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');


export async function registration(login, password) {
  const candidate = await User.findOne({where: {login: login}}); // вытащить или не надо?

  if (candidate) {
    throw ApiError.BadRequest(`User with ${login} login already exists `);
  }
  const hashPassword = await bcrypt.hash(password, 3);

  const user = await User.create({login: login, password: hashPassword});

  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({...userDto});

  await tokenService.saveToken(userDto.id, tokens.refreshToken);

  return {...tokens, user: userDto};
}

export async function signup(refreshToken) {
  await tokenService.removeToken(refreshToken);


  return true;
}

export async function signin(login, password) {
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

  await tokenService.saveToken(userDto.id, tokens.refreshToken);

  return {...tokens, user: userDto};
}

export async function logout(refreshToken) {
  const token = await tokenService.removeToken(refreshToken);


  return token;
}

export async function refresh(refreshToken) {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);

  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }
  const user = await User.findByPk(userData.id);
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({...userDto});

  await tokenService.saveToken(userDto.id, tokens.refreshToken);

  return {...tokens, user: userDto};
}

export async function getUserInfo(id) {
  const users = await User.findOne(id); //


  return users;
}
