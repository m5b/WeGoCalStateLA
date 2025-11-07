export const jsend = {
    success(data) {
        const result = {
            status: 'success',
            data,
        }
        return result
    },
    fail(data) {
        const result = {
            status: 'fail',
            data,
        }
        return result
    },
}
