import { Router } from 'express'
import {
    passwordSchema,
} from '../../validators/authValidators.mjs'
import { signupUser, } from '../../services/signupService.mjs'
import { jsend } from '../../util/jSend.mjs'
import { requireVerifiedId } from '../../middlewares/requireCookie.mjs'
import { completeVerified } from '../../services/verifiedService.mjs'
import { handleServerVOPRF } from '../../services/voprfService.mjs'
import { hashPassword } from '../../services/passwordService.mjs'
const router = Router()

router.post('/signup',requireVerifiedId, async (req, res) => {
    const email = await completeVerified(req.verifiedId)
    //validate and get the password using zod
    const {password}= passwordSchema.parse(req.body)
    //perform serverside voprf and create user
    const emailHash= await handleServerVOPRF(email)
    const passwordHash = await hashPassword(password)
    //sign up the user
    await signupUser(emailHash, passwordHash)
    res.json(jsend.success(null))

})


export default router
