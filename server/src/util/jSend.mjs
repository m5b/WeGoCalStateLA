export const jsend = {
    success(data = null) {
        const result = {
            status: 'success',
            data: data,
        }
        return result
    },
    fail(data, message) {
        const result = {
            status: 'fail',
            data: data,
            message: message,
        }

        return result
    },
    error(message) {
        const result = {
            status: 'error',
            message: message,
        }
        return result
    },
}
