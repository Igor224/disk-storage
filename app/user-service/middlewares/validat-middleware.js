import {oneOf, check} from 'express-validator';

export function validateLoginPass() {
  return [
    oneOf([
      check('login').isEmail(),
      check('login').isMobilePhone('ru-RU', {strictMode: true})
    ]),
    check('password').isLength({min: 3, max: 32})
  ];
}
