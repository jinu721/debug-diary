export interface SignupDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    isVerified: boolean;
  };
}