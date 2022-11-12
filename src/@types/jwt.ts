import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken'

export interface UserJwtPayload extends JwtPayload {
  username: string;
  email: string;
  percentRate: number | undefined;
}

export interface IGetUserAuthInfoRequest extends Request {
  jwtObject?: string | JwtPayload;
}