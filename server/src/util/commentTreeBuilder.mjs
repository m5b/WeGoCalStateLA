//Accept a list of commentDto, construct a list of nested comment structure

export default function buildCommentTree(commentDtos) {
    const commentDtoTreeList = []
    const commentTreeMap = new Map()
    commentDtos.forEach((commentDto) => {
        commentDto.replies = []
        commentTreeMap.set(commentDto.commentUuid, commentDto)
    })
    commentDtos.forEach((commentDto) => {
        const parentCommentUuid = commentDto.parentCommentUuid
        if (parentCommentUuid == null) {
            commentDtoTreeList.push(commentDto)
        } else {
            const parent = commentTreeMap.get(parentCommentUuid)
            parent.replies.push(commentDto)
        }
    })
    return {commentDtoTreeList, commentTreeMap}
}
