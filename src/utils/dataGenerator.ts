import { faker } from '@faker-js/faker';
import { UserCreatePayload } from '../api/types/user.types';

export interface GeneratedUser {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  birthDate: string;
  birthMonth: string;
  birthYear: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobileNumber: string;
}

export class DataGenerator {
  static generateUser(): GeneratedUser {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const timestamp = Date.now();

    return {
      name: `${firstName} ${lastName}`,
      email: `test_${timestamp}_${faker.internet.userName().toLowerCase()}@mailtest.dev`,
      password: `Pass${faker.string.alphanumeric(8)}!`,
      firstName,
      lastName,
      title: faker.helpers.arrayElement(['Mr', 'Mrs', 'Miss']),
      birthDate: String(faker.number.int({ min: 1, max: 28 })),
      birthMonth: String(faker.number.int({ min: 1, max: 12 })),
      birthYear: String(faker.number.int({ min: 1970, max: 2000 })),
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: 'United States',
      zipcode: faker.location.zipCode('#####'),
      state: faker.location.state(),
      city: faker.location.city(),
      mobileNumber: faker.phone.number()
    };
  }

  static toUserCreatePayload(user: GeneratedUser): UserCreatePayload {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.birthDate,
      birth_month: user.birthMonth,
      birth_year: user.birthYear,
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company,
      address1: user.address1,
      address2: user.address2,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobileNumber
    };
  }

  static generateSearchKeyword(): string {
    const keywords = ['top', 'dress', 'jeans', 'shirt', 'blue', 'cotton'];
    return faker.helpers.arrayElement(keywords);
  }

  static generateInvalidEmail(): string {
    return `invalid_${Date.now()}@notexist.xyz`;
  }

  static generateInvalidPassword(): string {
    return `wrong${faker.string.alphanumeric(6)}`;
  }
}
