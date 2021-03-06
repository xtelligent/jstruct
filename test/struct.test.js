const assert = require('assert')
const { defineStruct } = require('../src/struct')
const { FIELD_VALIDATION } = require('../src/field-defn')

describe('struct module', () => {
    it('should create a struct definition', () => {
        const skeleton = {
            a: 1,
            b: 'two',
            ss: { hey: 'you', what: 'sup' },
            ar: [3, 2, 1],
        }
        const result = defineStruct(skeleton)
            .field('c', 4)
            .render({ c: 10, ss: { what: 'haps' }, ar: [1] })
        assert.deepEqual(result, {
            ...skeleton,
            c: 10,
            ss: {
                hey: 'you',
                what: 'haps',
            },
            ar: [1, 2, 1],
        })
    })

    const catcher = callback => {
        try {
            callback()
            return {
                code: 'NO_ERROR',
            }
        } catch (e) {
            return e
        }
    }

    it('should validate rendering overlays', () => {
        const s = defineStruct({ a: 1, b: ['x', 'y'], z: { m: 'n' } })
        assert.equal(catcher(() => s.render({ a: 'xxxxx' })).code, FIELD_VALIDATION)
        assert.equal(catcher(() => s.render({ b: [] })).code, 'NO_ERROR')
        assert.equal(catcher(() => s.render({ c: '?' })).code, 'UNDEFINED_FIELDS')
        assert.equal(catcher(() => s.render({ z: { y: 'x' } })).code, 'UNDEFINED_FIELDS')
    })

    it('should support custom validators', () => {
        const validA = { x: 1 }
        const s = defineStruct({ a: validA, b: ['x', 'y'] })
            .addValidator('a', v => JSON.stringify(v) === JSON.stringify(validA) ? null : { code: 'A-BAD' })
            .addValidator('b', () => ({ code: 'B-BAD' }))
        assert.equal(catcher(() => s.render({ a: { x: 2 } })).code, 'FIELD_VALIDATION')
        assert.equal(catcher(() => s.render({ b: [0] })).code, 'FIELD_VALIDATION')
    })
})
