import { Router } from 'express'
import { issueJwTForUser } from '../../services/googleAuthServices.mjs'
import { handleUserLogin } from '../../services/loginService.mjs'
import { emailPasswordSchema } from '../../validators/authValidators.mjs'
import { cookieConfig } from '../../config/cookieConfig.mjs'
import { jsend } from '../../util/jSend.mjs'
const router = Router()

router.post('/login', async (req, res) => {
    const { email, password } = emailPasswordSchema.parse(req.body)
    const user = await handleUserLogin({ email: email, password: password })
    // Generate JWT
    const token = issueJwTForUser(user.userId)
    // Store token in HTTP-only cookie
    res.cookie('auth-token', token, cookieConfig)
    return res.json(jsend.success({ auth: 'authentication acquired' }))
})

export default router
