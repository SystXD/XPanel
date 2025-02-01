import { ApiError } from "#/lib/structures";
import { catchAsync } from "#/lib/utils";
import jwt, { JwtPayload } from 'jsonwebtoken'
const isAdmin = catchAsync(async (req, res, next) => {
    const accessToken = req.cookies.accessToken ?? req.body.accessToken ?? req.headers?.authorization?.split(" ")[1]
    if (!accessToken) throw new ApiError(401, "Unauthorized")
    try {
        const verify = jwt.verify(accessToken, process.env.JWTUserSecret as string) as JwtPayload
        if (!verify?.isAdmin) throw new ApiError(403, "This route can only be used by admins")
        next()
    } catch (error) {
        throw new ApiError(401, "Unauthorized")
        
    }
})