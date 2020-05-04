const { classifications, classificationOf } = require('./datatype')
const { range } = require('./range')

const mergeObjects = (a, b) => {
    const keys = Object.keys(
        Object.keys(a).concat(Object.keys(b))
            .reduce((accum, cur) => {
                const count = accum[cur] === undefined ? 0 : accum[cur] + 1
                return {
                    ...accum,
                    [cur]: count,
                }
            }, {})
    )
    return Object.assign({}, ...keys
        .map(k => ({
            [k]: merge(a[k], b[k])
        }))
    )
}

const mergeArrays = (a, b) => {
    const baseline = Array.from(
        range(Math.max(a.length, b.length))
    )
    return baseline.map(i => merge(a[i], b[i]))
}

function merge(a, b) {
    if (b === undefined) return a
    const ca = classificationOf(a)
    const cb = classificationOf(b)
    if (ca !== cb) return b
    switch (ca) {
        case classifications.CALLABLE:
        case classifications.MAP:
            return mergeObjects(a, b)
        case classifications.LIST:
            return mergeArrays(a, b)
        default:
            return b
    }
}

module.exports = {
    merge,
}
