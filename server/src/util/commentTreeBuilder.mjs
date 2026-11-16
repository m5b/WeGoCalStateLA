//Accept a list of commentDto, construct a list of nested comment structure

export default function buildCommentTree(commentDtos) {
    const commentDtoTreeList = [...commentDtos]
    const commentTreeMap = new Map()
    commentDtoTreeList.forEach((commentDto) => {
        commentDto.replies = []
        commentDto.descendantCount = 0
        commentTreeMap.set(commentDto.commentUuid, commentDto)
    })
    commentDtoTreeList.forEach((commentDto) => {
        const parentCommentUuid = commentDto.parentCommentUuid
        const parent = parentCommentUuid == null ? null : commentTreeMap.get(parentCommentUuid)
        if (!parent) {
            // Top-level, or its parent reply was deleted (deleted replies aren't in the list):
            // either way it is shown at the top level instead of breaking the whole thread.
            commentDtoTreeList.push(commentDto)
        } else {
            parent.replies.push(commentDto)
            parent.descendantCount += 1;
        }
    })

    function fillDescendantCount(commentDto) {
        let total = 0

        for (const child of commentDto.replies) {
            total += 1
            total += fillDescendantCount(child)
        }

        commentDto.descendantCount = total
        return total
    }

    commentDtoTreeList.forEach((commentDto) => {
        fillDescendantCount(commentDto)
    })

    return {commentDtoTreeList, commentTreeMap}
}
