import * as client from 'openid-client'
import { openIdConfig } from '../config/openIdConfig.mjs'

const { google } = openIdConfig
const googleConfigured = Boolean(google.clientId?.trim() && google.clientSecret?.trim())

// Unconfigured OAuth must not block unrelated API routes from starting.
export const openIdClient = {
    googleClient: googleConfigured
        ? await client.discovery(google.issuer, google.clientId, google.clientSecret)
        : null,
}
