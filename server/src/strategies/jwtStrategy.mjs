import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt'
import { findByUserID } from '../repositories/userRepository.mjs'

const strategy = new jwtStrategy(
    {
        secretOrKey: process.env.JWT_SECRET,
        //reteive the jwt token from the cookies
        jwtFromRequest: (req) => {
            let token = null
            if (req && req.cookies) {
                token = req.cookies['auth-token']
            }
            return token
        },
    },
    //call back function for verfie the jwt
    async (jwt_payload, done) => {
        const { userId } = jwt_payload
        if (!userId) {
            return done(
                new Error("JWT payload doest not contains key 'userId'"),
                null
            )
        }
        const user = await findByUserID(userId)
        //user need to create a account since can't not find in the database
        if (!user) {
            return done(null, null)
        }
        return done(null, user)
    }
)

export default strategy
