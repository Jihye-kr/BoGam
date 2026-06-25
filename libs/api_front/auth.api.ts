import { frontendAxiosInstance } from './axiosInstance';
import { SignupInput } from '@/(anon)/signup/_components/schema';
import { ExtraInput } from '@/(anon)/signup/extra/_components/extraSchema';

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  deletedUserNickname?: string;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
}

export interface ExtraSignupResposne {
  success: boolean;
  message?: string;
}

class AuthApi {
  private static instance: AuthApi;
  private constructor() {}

  public static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi();
    }
    return AuthApi.instance;
  }

  // ✅ 회원가입
  public async signup(data: SignupInput): Promise<SignupResponse> {
    const axios = frontendAxiosInstance.getAxiosInstance();

    const response = await axios.post<SignupResponse>(
      '/api/users/signup', // 실제 라우팅 확인 필요
      data
    );

    return response.data;
  }

  // ✅ 회원 탈퇴
  public async deleteUser(): Promise<DeleteUserResponse> {
    const axios = frontendAxiosInstance.getAxiosInstance();

    const response = await axios.delete<DeleteUserResponse>(
      '/api/users/delete-user'
    );
    return response.data;
  }

  // ✅ 카카오 SSO
  public async updateKakaoUser(
    data: ExtraInput
  ): Promise<{ success: boolean; message?: string }> {
    const axios = frontendAxiosInstance.getAxiosInstance();
    const response = await axios.post<ExtraSignupResposne>(
      '/api/users/kakao-update-info',
      data
    );
    return response.data;
  }
}

export const authApi = AuthApi.getInstance();
export default authApi;
