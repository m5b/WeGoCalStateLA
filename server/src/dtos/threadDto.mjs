const DEFINE_PUBLIC_FIELDS = ['threadId','userId', 'body','title', 'author', "createdAt","updatedAt","status"]
const PUBLIC_FIELDS = ['threadId','userId', 'content','title', 'username', 'createdAt',"updatedAt","status"]
export default class ThreadDto {
    constructor(thread) {
        for (let i = 0; i < DEFINE_PUBLIC_FIELDS.length; i++) {
            this[DEFINE_PUBLIC_FIELDS[i]] = thread[PUBLIC_FIELDS[i]]
        }
    }
}
