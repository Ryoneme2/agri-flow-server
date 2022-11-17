import { Response, NextFunction } from 'express';
import { httpStatus } from '@config/http';
import type { UserJwtPayload, IGetUserAuthInfoRequest } from '@type/jwt'
import * as blogService from '@service/blog/person/blog-service'

export const updateBlogView = async (req: IGetUserAuthInfoRequest, _: Response, next: NextFunction) => {
  try {

    const { blogId } = req.params;

    if (!blogId || isNaN(+blogId)) return next()

    const userObjJWT = req.jwtObject as UserJwtPayload;

    if (!userObjJWT) return next();

    await blogService._updateView({ username: userObjJWT.username, blogId: +blogId });

    return next()
  } catch (e) {
    console.error(e);
    return next()
  }
}