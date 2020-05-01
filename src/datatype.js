const types = {
    UNDEFINED: 1,
    NULL: 2,
    STRING: 3,
    INT: 4,
    FLOAT: 5,
    ILLEGAL_NUMBER: 6,
    BOOLEAN: 7,
    OBJECT: 8,
    ARRAY: 9,
    SYMBOL: 10,
    FUNCTION: 11,
}

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

module.exports = {
    dataTypeOf,
    types,
}
