const FIELDS = ['commentId', 'body', 'author']

export class CommentDto {
    constructor(thread) {
        FIELDS.forEach((p) => {
            this[p] = thread[p]
        })
        return { thread: this }
    }
}