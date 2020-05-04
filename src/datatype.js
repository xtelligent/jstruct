const classifications = {
    NIL: 0,
    PRIMITIVE: 1,
    LIST: 2,
    MAP: 3,
    CALLABLE: 4,
}
const {
    NIL, PRIMITIVE, LIST, MAP, CALLABLE,
} = classifications

const types = Object.assign({}, ...Object.entries({
    UNDEFINED: [1, NIL],
    NULL: [2, NIL],
    STRING: [3, PRIMITIVE],
    INT: [4, PRIMITIVE],
    FLOAT: [5, PRIMITIVE],
    ILLEGAL_NUMBER: [6, PRIMITIVE],
    BOOLEAN: [7, PRIMITIVE],
    OBJECT: [8, MAP],
    ARRAY: [9, LIST],
    SYMBOL: [10, PRIMITIVE],
    FUNCTION: [11, CALLABLE],
}).map(([k, [id, classification]]) => ({
    [k]: { id, classification },
})))

const processNumber = (n) => {
    if (Number.isInteger(n)) return types.INT
    if (Number.isFinite(n)) return types.FLOAT
    return types.ILLEGAL_NUMBER
}

const lookupType = (v) => {
    const key = (typeof v).toUpperCase()
    return types[key]
}

const tests = [
    [v => v === null, () => types.NULL],
    [v => v === undefined, () => types.UNDEFINED],
    [v => Array.isArray(v), () => types.ARRAY],
    [v => typeof v === 'number', processNumber],
    [v => true, lookupType],
]

const dataTypeOf = (v) => {
    const action = tests.find(([test]) => test(v))[1]
    return action(v)
}

const classificationOf = (v) => dataTypeOf(v)
    .classification

module.exports = {
    dataTypeOf,
    types,
    classificationOf,
    classifications,
}
