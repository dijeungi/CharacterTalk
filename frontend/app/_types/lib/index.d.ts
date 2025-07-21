export interface AccessTokenPayload {
  code: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}
