interface JwtPayload {
  exp: number;
  role?: string;
  [key: string]: any;
}
