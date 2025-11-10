const FIELDS = ['threadId', 'author', 'title', 'content', 'createdAt', 'updatedAt', 'status']

export default class ThreadDto {
    constructor(thread) {
        FIELDS.forEach((p) => {
            this[p] = thread[p]
        })
        return { thread: this }
    }
}
