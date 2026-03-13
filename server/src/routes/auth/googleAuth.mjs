import { Router } from 'express'
import {
    completeGoogleLogin,
    handleGoogleLogin,
} from '../../services/googleAuthServices.mjs'
import {oidcCookieConfig, verifiedCookieConfig } from "../../config/cookieConfig.mjs";
import { requireOIDCId } from '../../middlewares/requireCookie.mjs'
import { handleVerified } from '../../services/verifiedService.mjs'
import { jsend } from '../../util/jSend.mjs'
const router = Router()


router.get('/google', async (req, res) => {
    const {token, redirectURL} = await handleGoogleLogin()
    res.cookie('oidc_tx', token, oidcCookieConfig)
    res.redirect(redirectURL.toString())
})

router.get('/google/callback', requireOIDCId, async (req, res) => {
    const currentURL= new URL(
        `${req.protocol}://${req.get('host')}${req.originalUrl}`
    )
    const email = await completeGoogleLogin(req.oidc, currentURL)
    //assign user a verified token to user
    const verifiedToken = await handleVerified(email, 'open id')
    res.cookie('verified_tx', verifiedToken, verifiedCookieConfig)
    res.json(jsend.success(null))
})

export default router
