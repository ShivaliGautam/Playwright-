import { ApiClient } from '../ApiClient';
import {
  UserCreatePayload,
  UserUpdatePayload,
  UserDetailResponse,
  UserLifecycleResponse,
  VerifyLoginPayload,
  DeleteAccountPayload
} from '../types/user.types';

export class UserApi {
  private readonly client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async createAccount(payload: UserCreatePayload): Promise<UserLifecycleResponse> {
    const formPayload: Record<string, string> = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      title: payload.title,
      birth_date: payload.birth_date,
      birth_month: payload.birth_month,
      birth_year: payload.birth_year,
      firstname: payload.firstname,
      lastname: payload.lastname,
      company: payload.company,
      address1: payload.address1,
      address2: payload.address2,
      country: payload.country,
      zipcode: payload.zipcode,
      state: payload.state,
      city: payload.city,
      mobile_number: payload.mobile_number
    };
    return this.client.post<UserLifecycleResponse>('/createAccount', formPayload);
  }

  async updateAccount(payload: UserUpdatePayload): Promise<UserLifecycleResponse> {
    const formPayload: Record<string, string> = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      title: payload.title,
      birth_date: payload.birth_date,
      birth_month: payload.birth_month,
      birth_year: payload.birth_year,
      firstname: payload.firstname,
      lastname: payload.lastname,
      company: payload.company,
      address1: payload.address1,
      address2: payload.address2,
      country: payload.country,
      zipcode: payload.zipcode,
      state: payload.state,
      city: payload.city,
      mobile_number: payload.mobile_number
    };
    return this.client.put<UserLifecycleResponse>('/updateAccount', formPayload);
  }

  async getUserDetailByEmail(email: string): Promise<UserDetailResponse> {
    return this.client.get<UserDetailResponse>('/getUserDetailByEmail', {
      params: { email }
    });
  }

  async deleteAccount(payload: DeleteAccountPayload): Promise<UserLifecycleResponse> {
    return this.client.delete<UserLifecycleResponse>('/deleteAccount', {
      email: payload.email,
      password: payload.password
    });
  }

  async verifyLogin(payload: VerifyLoginPayload): Promise<UserLifecycleResponse> {
    return this.client.post<UserLifecycleResponse>('/verifyLogin', {
      email: payload.email,
      password: payload.password
    });
  }
}
