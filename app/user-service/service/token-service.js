import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const Token = db.token;


function generateTokens(payload) {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '10m'});
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'});

  return {
    accessToken,
    refreshToken
  };
};

function validateAccessToken(token) {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    return userData;
  } catch (e) {
    return null;
  }
};

function validateRefreshToken(token) {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);


    return userData;
  } catch (e) {
    return null;
  }
}

async function saveToken(userId, refreshToken, transaction = null) {
  const tokenData = await Token.findOne({where: {UserId: userId}});

  if (tokenData) {
    tokenData.refreshToken = refreshToken;

    return tokenData.save(transaction);
  }
  const token = await Token.create({refreshToken}, transaction);

  return token;
}

async function removeToken(refreshToken) {
  const tokenData = await Token.destroy({where: {refreshToken: refreshToken}});

  return tokenData;
}

async function findToken(refreshToken) {
  const tokenData = await Token.findOne({where: {refreshToken: refreshToken}});

  return tokenData;
}

export default {
  generateTokens,
  validateAccessToken,
  validateRefreshToken,
  saveToken,
  removeToken,
  findToken
};
