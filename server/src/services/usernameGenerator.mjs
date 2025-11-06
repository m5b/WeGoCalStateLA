import { uniqueUsernameGenerator } from 'unique-username-generator'
import config from '../config/usernameConfig.mjs'
import { findByUsername } from '../repositories/userRepository.mjs'

export default async function generateUserName() {
    let username
    let exist = true
    while (exist) {
        username = uniqueUsernameGenerator(config)
        //check if the username exist in the database or not
        const user = await findByUsername(username)
        if (!user) {
            exist = false
        }
    }
    return username
}
