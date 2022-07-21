import jwt from 'jsonwebtoken';
import Token from '../models/token';


export function generateTokens(payload) {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '10m'});
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'});


  return {
    accessToken,
    refreshToken
  };
};

export function validateAccessToken(token) {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);


    return userData;
  } catch (e) {
    return null;
  }
};

export function validateRefreshToken(token) {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);


    return userData;
  } catch (e) {
    return null;
  }
}

export async function saveToken(userId, refreshToken) {
  const tokenData = await Token.findOne({where: {id: userId}});

  if (tokenData) {
    tokenData.refreshToken = refreshToken;

    return tokenData.save();
  }
  const token = await Token.create({userId, refreshToken});


  return token;
}

export async function removeToken(refreshToken) {
  const tokenData = await Token.destroy({where: {refreshToken: refreshToken}});


  return tokenData;
}

export async function findToken(refreshToken) {
  const tokenData = await Token.findOne({where: {refreshToken: refreshToken}});


  return tokenData;
}

