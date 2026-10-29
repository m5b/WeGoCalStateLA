const DEFINE_PUBLIC_FIELDS = ['threadUuid','userUuid', 'body','title', 'author', "createdAt","updatedAt","status", "category"]
const PUBLIC_FIELDS = ['threadUuid','userUuid', 'content','title', 'username', 'createdAt',"updatedAt","status", "category"]
export default class ThreadDto {
    constructor(thread) {
        for (let i = 0; i < DEFINE_PUBLIC_FIELDS.length; i++) {
            if(thread[PUBLIC_FIELDS[i]] === null){
                this[DEFINE_PUBLIC_FIELDS[i]] =  "[Deleted]"
            }
            else{
                this[DEFINE_PUBLIC_FIELDS[i]] = thread[PUBLIC_FIELDS[i]]
            }
        }
        // Set outside the loop above on purpose: counts, flags and missing photos are normal values
        // here, not "[Deleted]".
        this.replyCount = Number(thread.replyCount ?? 0)
    }
}
