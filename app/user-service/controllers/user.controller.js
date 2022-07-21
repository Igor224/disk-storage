const userService = require('../service/user-service.js');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error.js');

export async function registration(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Validation Error', errors.array()));
    }
    const {email, password} = req.body;
    const userData = await userService.registration(email, password);

    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

    return res.json(userData);
  } catch (e) {
    next(e);
  }
}

export async function signin(req, res, next) {
  try {
    const {email, password} = req.body;
    const userData = await userService.signin(email, password);

    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

    res.json(userData);

    return res.redirect(process.env.API_URL);
  } catch (e) {
    next(e);
  }
}

export async function logout(req, res, next) {
  try {
    const {refreshToken} = req.cookies;
    const token = await userService.logout(refreshToken);

    res.clearCookie('refreshToken');

    return res.json(token);
  } catch (e) {
    next(e);
  }
}

export async function signout(req, res, next) {
  try {

  } catch (e) {
    next(e);
  }
}

export async function refresh(req, res, next) {
  try {
    const {refreshToken} = req.cookies;
    const userData = await userService.refresh(refreshToken);

    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

    return res.json(userData);
  } catch (e) {
    next(e);
  }
}

export async function getUsers(req, res, next) {
  try {
    const user = await userService.getUserInfo(/* id*/); //

    return res.json(user);
  } catch (e) {
    next(e);
  }
}


