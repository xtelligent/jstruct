const assert = require('assert')
const { range } = require('../src/range')

describe('range module', () => {
    it('should use 2 parameters', () => {
        const result = Array.from(range(2, 8))
        assert.deepEqual(result, [2, 3, 4, 5, 6, 7])
    })

    it('should use 1 parameter', () => {
        const result = Array.from(range(4))
        assert.deepEqual(result, [0, 1, 2, 3])
    })
})
