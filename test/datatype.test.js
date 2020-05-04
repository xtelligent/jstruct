const assert = require('assert')
const {
    classifications,
    classificationOf,
    types,
    dataTypeOf,
} = require('../src/datatype')

describe('datatype module', () => {
    it('should know the classification', () => {
        assert.equal(classificationOf(), classifications.NIL)
        assert.equal(classificationOf(null), classifications.NIL)
        assert.equal(classificationOf(''), classifications.PRIMITIVE)
        assert.equal(classificationOf(12), classifications.PRIMITIVE)
        assert.equal(classificationOf(-10.5), classifications.PRIMITIVE)
        assert.equal(classificationOf(12 / 'text'), classifications.PRIMITIVE)
        assert.equal(classificationOf(Number.POSITIVE_INFINITY), classifications.PRIMITIVE)
        assert.equal(classificationOf(true), classifications.PRIMITIVE)
        assert.equal(classificationOf(false), classifications.PRIMITIVE)
        assert.equal(classificationOf({}), classifications.MAP)
        assert.equal(classificationOf([]), classifications.LIST)
        assert.equal(classificationOf(() => {}), classifications.CALLABLE)
        assert.equal(classificationOf(Symbol()), classifications.PRIMITIVE)
    })

    it('should know the data types', () => {
        assert.equal(dataTypeOf(), types.UNDEFINED)
        assert.equal(dataTypeOf(null), types.NULL)
        assert.equal(dataTypeOf(''), types.STRING)
        assert.equal(dataTypeOf(12), types.INT)
        assert.equal(dataTypeOf(-10.5), types.FLOAT)
        assert.equal(dataTypeOf(12 / 'text'), types.ILLEGAL_NUMBER)
        assert.equal(dataTypeOf(Number.POSITIVE_INFINITY), types.ILLEGAL_NUMBER)
        assert.equal(dataTypeOf(true), types.BOOLEAN)
        assert.equal(dataTypeOf(false), types.BOOLEAN)
        assert.equal(dataTypeOf({}), types.OBJECT)
        assert.equal(dataTypeOf([]), types.ARRAY)
        assert.equal(dataTypeOf(() => {}), types.FUNCTION)
        assert.equal(dataTypeOf(Symbol()), types.SYMBOL)
    })
})
