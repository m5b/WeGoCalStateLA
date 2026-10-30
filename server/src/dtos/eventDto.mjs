function pad(n) {
    return String(n).padStart(2, '0')
}

// Splits a single started_at timestamp into separate date/time strings,
// since that's the shape the client screens already expect.
function splitDateTime(value) {
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return { date: '', time: '' }
    const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    let hours = d.getHours()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    if (hours === 0) hours = 12
    const time = `${hours}:${pad(d.getMinutes())} ${ampm}`
    return { date, time }
}

// Maps a joined event row to the field names the client already uses.
export default class EventDto {
    constructor(event) {
        const { date, time } = splitDateTime(event.startedAt)

        this.id = event.eventUuid
        this.title = event.eventTitle
        this.caption = event.eventTitle
        this.description = event.eventDescription
        this.text = event.eventDescription
        this.imageUri = event.photoUrl || null
        this.date = date
        this.time = time
        // Shows the author's public alias; falls back to their username
        // only if they haven't set one. Username is kept separately too,
        // for anything backend-facing that needs it.
        this.author = event.authorAlias || event.authorUsername || 'Community'
        this.authorUsername = event.authorUsername || null
        this.authorUuid = event.authorUuid || null
        this.threadId = event.threadUuid || null
        this.isPublic = Boolean(event.isPublic)
        this.createdAt = event.createdAt ? new Date(event.createdAt).getTime() : Date.now()
    }
}