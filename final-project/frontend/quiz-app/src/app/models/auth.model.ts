// src/app/models/auth.model.ts
export type Role = 'admin' | 'student';

export interface User {
  id: string;
  username: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
// export interface RegisterPayload {
//   username: string;
//   password: string;
//   role: Role;
// }
