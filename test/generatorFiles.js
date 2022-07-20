import {faker} from '@faker-js/faker';

function ext() {
  return faker.system.commonFileExt();
}

function name() {
  const name = faker.system.commonFileName();

  return name.split('.')[0];
}

function type() {
  return faker.system.commonFileType();
}

function size() {
  return faker.datatype.number({
    max: 99999,
    min: 1
  });
}

function md5() {
  const hex = faker.datatype.hexadecimal(32);

  return hex.slice(2);
}

export default {
  name,
  ext,
  type,
  size,
  md5
};
