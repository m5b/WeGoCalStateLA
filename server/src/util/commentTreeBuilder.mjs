//Accept a list of commentDto, construct a list of nested comment structure

export default function buildCommentsTree(commentDtos) {
    const commentDtoTreeList = []
    const map = new Map()
    commentDtos.forEach((commentDto) => {
        commentDto.replies = []
        map.set(commentDto.commentId, commentDto)
    })
    commentDtos.forEach((commentDto) => {
        const parentId = commentDto.parentId
        if (parentId == null) {
            commentDtoTreeList.push(commentDto)
        } else {
            const parent = map.get(parentId)
            parent.replies.push(commentDto)
        }
    })
    return commentDtoTreeList
}
