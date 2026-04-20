import { jwtVerify } from 'jose'
import { keycloakConfig} from '../config/authConfig.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import { keycloakJWK } from '../lib/jose.mjs'

export function reqAuth(userService){
    return async function(req, res, next){
        const accessToken = req.get('X-access-token')
        if (!accessToken) {
            throw new UnauthorizedError({
                "auth": "Not authorized"
            }, "You are not authorized, please try again")
        }
        try{
            const { payload, protectedHeader } = await jwtVerify(accessToken, keycloakJWK, {
                issuer: keycloakConfig.issuer,
                audience: keycloakConfig.audience
            });
            req.accessToken = {
                userUuid: payload.sub,
                createdAt: new Date(Number(payload.createdTimestamp)),
                username: payload.preferred_username,
                roles: [
                    ...(payload.realm_access?.roles ?? []),
                    ...(payload.resource_access?.['wego-customer']?.roles ?? []),
                ],
            }

        }
        catch (err){
            throw new UnauthorizedError({
                "auth": "Not authorized"
            }, "You are not authorized, please try again")
        }
        //check provision
        let user = await userService.getByUserUuid(req.accessToken.userUuid)
        if(user == null){
            const{userUuid, createdAt, username} = req.accessToken;
            user = await userService.createUser({userUuid, username, createdAt});
        }
        req.user = user;
        return next()
    }
}