import passport from 'passport'

// middleware that help devloper to verfile if a use request contain a jwt token or not
const requireJwtAuth = passport.authenticate('jwt', { session: false })

export default requireJwtAuth
