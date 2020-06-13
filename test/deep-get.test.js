const assert = require('assert')
const { deepGet, usingAccessor } = require('../src/deep-get')

describe('deep-get module', () => {
    it('should look deep in an object', () => {
        const expected = 2112
        const target = {
            a: {
                b: {
                    c: expected
                }
            }
        }
        assert.equal(deepGet(target, 'a', 'b', 'c'), expected)
        assert.equal(deepGet(target, 'a.b.c'), expected)
        assert.equal(deepGet(target, 'a.b.c.d'), undefined)
        assert.equal(deepGet(target, 'abcd'), undefined)
    })

    it('should support arrays', () => {
        const expected = 'yeah baby'
        const target = {
            items: ['no', expected]
        }
        assert.equal(deepGet(target, 'items.1'), expected)
        assert.equal(deepGet(target, 'items', 1), expected)
    })

    it('should support custom accessors', () => {
        const expected = 34567
        const target = {
            theMap: new Map([[3, expected]])
        }
        const customAccessor = (target, key) => {
            const obj = target instanceof Map
                ? Object.assign({}, ...Array.from(target)
                    .map(([k, v]) => ({ [k]: v }))
                )
                : target
            return obj[key]
        }
        assert.equal(usingAccessor(customAccessor).deepGet(target, 'theMap.3'), expected)
        assert.equal(usingAccessor(customAccessor).deepGet(target, 'theMap', 3), expected)
    })
})
