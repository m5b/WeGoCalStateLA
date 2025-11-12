import { Router } from 'express'
import { emailPasswordSchema } from '../../validators/authValidators.mjs'
import { handleUserSignup } from '../../services/signupService.mjs'
import { jsend } from '../../util/jSend.mjs'
const router = Router()

router.post('/signup', async (req, res) => {
    const validatedPayload = emailPasswordSchema.parse(req.body)
    await handleUserSignup(validatedPayload)
    res.json(jsend.success({ auth: 'user created' }))
})
export default router
