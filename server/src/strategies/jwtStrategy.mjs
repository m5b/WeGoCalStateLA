import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt'
import { findByUserID } from '../repositories/userRepository.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import { NotFoundError } from '../errors/notFoundError.mjs'
const strategy = new jwtStrategy(
    {
        secretOrKey: process.env.JWT_SECRET,
        //reteive the jwt token from the cookies
        jwtFromRequest: (req) => {
            if (!req || !req.cookies['auth-token']) {
                throw new UnauthorizedError({ auth: 'Missing JWT token' })
            }
            return req.cookies['auth-token']
        },
    },
    //call back function for verfie the jwt
    async (jwt_payload, done) => {
        const { userId } = jwt_payload
        if (!userId) {
            return done(
                new UnauthorizedError({ auth: 'Invalid JWT token' }),
                false
            )
        }
        const user = dbMapper.fromDb(await findByUserID(userId))
        //user need to create a account since can't not find in the database
        if (!user) {
            return done(
                new NotFoundError({
                    auth: 'Can not found user of given token',
                }),
                false
            )
        }
        return done(null, user)
    }
)

export default strategy
