import { Router } from 'express'
import { handleClientEval, loginUser } from '../../services/loginService.mjs'
import {
    emailHashSchema,
    emailPasswordSchema,
} from '../../validators/authValidators.mjs'
import { cookieConfig } from '../../config/cookieConfig.mjs'
import { jsend } from '../../util/jSend.mjs'
import {
    generateAccessToken
} from '../../util/generateJWTToken.mjs'
const router = Router()

router.post('/login/voprf', async (req, res) => {
    const {emailHash} = emailHashSchema.parse(req.body)
    const evalReqB64 = await handleClientEval(emailHash)
    res.json(jsend.success({evalReqB64: evalReqB64}))

})
router.post('/login/complete', async (req, res) => {
    const { emailHash, password } = emailPasswordSchema.parse(req.body)
    const user = await loginUser(emailHash, password)
    // Generate JWT
    const token = generateAccessToken(user.userId)
    // Store token in HTTP-only cookie
    res.cookie('auth-token', token, cookieConfig)
    return res.json(jsend.success({ auth: 'authentication acquired' }))
})

export default router
