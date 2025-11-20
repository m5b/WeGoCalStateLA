const DEFINE_PUBLIC_FIELDS = ['commentId', 'body', 'author', 'parentId', "userId", "threadId", "createdAt", "updatedAt", "status"]
const PUBLIC_FIELDS = ['commentId', 'content', 'username', 'parentId', "userId", "threadId", "createdAt", "updatedAt", "status"]
export default class CommentDto {
    constructor(comment, { scope }) {
        if (scope === 'public') {
            for (let i = 0; i < DEFINE_PUBLIC_FIELDS.length; i++) {
                this[DEFINE_PUBLIC_FIELDS[i]] = comment[PUBLIC_FIELDS[i]]
            }
        }
    }
}
