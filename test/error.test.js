const assert = require('assert')
const { create: createError } = require('../src/error')

describe('error module', () => {
    const test = (name, message, code, other) => {
        const e = createError(name, message, code, other)
        assert.equal(e.name, name)
        assert.equal(e.message, message)
        assert.equal(e.code, code)
        const fields = Object.keys(other || {})
        if (fields.length <= 0 ) return

        const target = Object.assign({},
            ...fields.map(f => ({ [f]: e[f] }))
        )
        assert.deepEqual(target, other)
    }

    it('should create coded errors', () => {
        test('jo', 'it is an error', 2112)
        test('steve', 'hey there', 'a_code', { a: 1, b: 3 })
    })
})
