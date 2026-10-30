import { UnauthorizedError } from '../errors/unauthorizedError.mjs'

// Public posts and events are shown in full to everyone. Private ones are
// still listed for signed-out visitors (so they can see there's more to
// join for), but with everything except the basics stripped out, and
// marked `locked` so the client knows to show the sign-in prompt.

export function canView(item, viewer) {
    return Boolean(viewer) || Boolean(item.isPublic)
}

export function threadForViewer(threadDto, viewer) {
    if (canView(threadDto, viewer)) return { ...threadDto, locked: false }
    return {
        ...threadDto,
        title: null,
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
