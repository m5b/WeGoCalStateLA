const PUBLIC_FIELDS = ['userId', 'username', 'displayName', 'createdAt']
const PRIVATE_FIELDS = ['email', 'updatedAt']

export default class UserDto {
    constructor(user, { scope }) {
        if (scope === 'public' || scope === 'private') {
            PUBLIC_FIELDS.forEach((p) => {
                this[p] = user[p]
            })
        }
        if (scope === 'private') {
            PRIVATE_FIELDS.forEach((p) => {
                this[p] = user[p]
            })
        }
        return { user: this }
    }
}
