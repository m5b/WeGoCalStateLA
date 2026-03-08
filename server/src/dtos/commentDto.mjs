const DEFINE_PUBLIC_FIELDS = ['commentUuid', 'parentCommentUuid', 'content', 'username', "userUuid", "threadUuid", "createdAt", "updatedAt", "status", ]
const PUBLIC_FIELDS = ['commentUuid', 'parentCommentUuid', 'content', 'username', "userUuid", "threadUuid", "createdAt", "updatedAt", "status", ]
export default class CommentDto {
    constructor(comment){
            for (let i = 0; i < DEFINE_PUBLIC_FIELDS.length; i++) {
                this[DEFINE_PUBLIC_FIELDS[i]] = comment[PUBLIC_FIELDS[i]]
            }
    }
}
