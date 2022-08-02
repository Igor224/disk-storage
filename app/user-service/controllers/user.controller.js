import userService from '../service/user-service.js';
import {validationResult} from 'express-validator';
import ApiError from '../../../packages/exceptions/api-errors.js';
// import config from '../../../config/default.js';

async function signup(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Validation Error', errors.array()));
    }
    const {login, password} = req.body;
    const userData = await userService.signup(login, password);

    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); // одинаковое время и для рефреш и для куки

    return res.status(201).json(userData); // редирект сделать
  } catch (e) {
    next(e);
  }
}

async function signin(req, res, next) {
  try {
    const {login, password} = req.body;
    const userData = await userService.signin(login, password);

    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

    res.json(userData);

    // return res.redirect(config.API_URL); // редирект на storage-service
  } catch (e) {
    next(e);
  }
}

async function logout(req, res, next) {
  try {
    const {refreshToken} = req.cookies;
    const token = await userService.logout(refreshToken);

    res.clearCookie('refreshToken');

    return res.json(token);
  } catch (e) {
    next(e);
  }
}


async function refresh(req, res, next) {
  try {
    const {refreshToken} = req.cookies;

    const userData = await userService.refresh(refreshToken);

    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

    return res.json(userData);
  } catch (e) {
    next(e);
  }
}

async function getUserInfo(req, res, next) {
  try {
    res.status(200).json({id: req.user.login});
  } catch (e) {
    next(e);
  }
}

export default {
  signup,
  signin,
  logout,
  refresh,
  getUserInfo
};
