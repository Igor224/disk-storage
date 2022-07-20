import {faker} from '@faker-js/faker';

function id() {
  return faker.datatype.number({
    max: 20,
    min: 1
  });
}

// function name() {
//   const name = faker.name.firstName();

//   console.log('NAME: ', typeof name);

//   return name;
// }

export default {
  // name,
  id
};

