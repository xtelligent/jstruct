const assert = require('assert')
const { defineStruct } = require('../src/struct')

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
})
