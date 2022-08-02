import ApiError from '../exceptions/api-errors.js';

export default function(err, req, res, next) {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors});// вернуть ошибку валидации с кодом 4**
  }

  return res.status(500).json({message: 'Unexpected server error'});
};
