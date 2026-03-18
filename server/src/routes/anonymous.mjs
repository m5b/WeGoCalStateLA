import { Router } from 'express'
import requireJwtAuth from '../middlewares/requireJwtAuth.mjs'

import {assignAnonymous, getAnonNameByUserId} from '../services/anonymousNameService.mjs'
import { userIdSchema } from '../validators/userValidators.mjs';

import {jsend} from "../util/jSend.mjs";

const router = Router()

router.get("/", async (req, res) => {
    // get user identification (id)
    const { userId } = userIdSchema.parse({
        userId: req.user.userId,
    })

    // retrieve anonymous username
    try{
        var anon_username = await getAnonNameByUserId(userId)
    } catch (err){
        res.status(404).send(jsend.fail({ "reason" : err.message}))
    }

    res.send(jsend.success({ "anonymous_username" : anon_username}))
})

router.get("/assign", async (req, res) => {
    // get user identification (id/username)
    const { userId } = userIdSchema.parse({
        userId: req.user.userId,
    })

    // assign new username
    assignAnonymous(userId)

    // retrieve anonymous username
    try{
        var anon_username = await getAnonNameByUserId(userId)
    } catch (err){
        res.status(404).send(jsend.fail({ "reason" : err.message}))
    }

    res.send(jsend.success({ "anonymous_username" : anon_username}))
})

export default router