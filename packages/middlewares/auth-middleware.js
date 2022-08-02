import ApiError from '../exceptions/api-errors.js';
import jwt from 'jsonwebtoken';
import config from '../../config/default.js';

export default function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = jwt.verify(accessToken, config.JWT_ACCESS_SECRET);


    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    console.log(e);

    return next(ApiError.UnauthorizedError());
  }
};
