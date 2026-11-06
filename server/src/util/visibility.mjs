import { UnauthorizedError } from '../errors/unauthorizedError.mjs'

// Public posts and events are shown in full to everyone. Private ones are
// still listed for signed-out visitors (so they can see there's more to
// join for), but with everything except the basics and the title stripped
// out, and marked `locked` so the client knows to show the sign-in prompt.

export function canView(item, viewer) {
    return Boolean(viewer) || Boolean(item.isPublic)
}

// Older threads have no title of their own: the client filled one in from
// the start of the body (padded with dots to 20 characters, or cut off with
// "..."). Showing that on a private thread would give away its content, so
// only a title the author actually wrote counts.
function hasOwnTitle(title, body) {
    if (!title || title === '[Deleted]') return false
    const text = (body || '').trim()
    const generated =
        text.length >= 20
            ? text.length <= 200
                ? text
                : `${text.slice(0, 197)}...`
            : (text || 'Community post').padEnd(20, '.')
    return title !== generated
}

export function threadForViewer(threadDto, viewer) {
    if (canView(threadDto, viewer)) return { ...threadDto, locked: false }
    return {
        ...threadDto,
        title: hasOwnTitle(threadDto.title, threadDto.body)
            ? threadDto.title
            : null,
        body: null,
        author: null,
        userUuid: null,
        photoUrl: null,
        locked: true,
    }
}

// Events keep their title and date, so signed-out visitors can see what's
// coming up, but not the description, photo, or who posted it.
export function eventForViewer(eventDto, viewer) {
    if (canView(eventDto, viewer)) return { ...eventDto, locked: false }
    return {
        ...eventDto,
        description: null,
        text: null,
        imageUri: null,
        author: null,
        authorUsername: null,
        authorUuid: null,
        locked: true,
    }
}

export function assertCanView(item, viewer) {
    if (!canView(item, viewer)) {
        throw new UnauthorizedError(
            { auth: 'Not authorized' },
            'Sign in to see this private post'
        )
    }
}
