import { describe, it, expect, vi } from 'vitest'
import { createVOPRFService } from '../../src/services/voprfService.mjs'


describe("voprf test", () => {
    const voprfConfig = vi.fn
    const voprfService = createVOPRFService({

    })
    it("bind the email using voprf", async ()=>{
        const email = "user123@gmail.com"
        const {finData, evalReq} = await bindVOPRF(email)
        console.log(finData)
        expect(finData).toBe(finData)

    })
})