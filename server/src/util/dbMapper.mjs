import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

const dbMapper = {
    fromDb(data) {
        return camelcaseKeys(data, { deep: true })
    },
    toDb(data) {
        return snakecaseKeys(data, { deep: true })
    },
}

export default dbMapper
