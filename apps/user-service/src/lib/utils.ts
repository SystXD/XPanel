import { Request, Response, NextFunction } from 'express'
export const catchAsync = (controller: (req:Request, res:Response, next:NextFunction) => Promise<void>) => (req:Request, res:Response, next:NextFunction) => Promise.resolve(controller(req, res, next)).catch(next)