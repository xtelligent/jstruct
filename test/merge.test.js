const assert = require('assert')
const { merge } = require('../src/merge')

describe('merge module', () => {
    it('should merge objects', () => {
        const result = merge({ x: { a: 1 }, y: 'mmmm' }, { x: { b: 2 }, y: 'nnnn' })
        assert.deepEqual(result, {
            x: { a: 1, b: 2 },
            y: 'nnnn'
        })
    })

    it('should merge arrays', () => {
        const result = merge(
            [undefined, { x: 1 }, 3],
            [10, { y: 2 }, 4, 5],
        )
        assert.deepEqual(result, [10, { x: 1, y: 2 }, 4, 5])
        const r2 = merge(
            [1, 2, 3, 4],
            ['a'],
        )
        assert.deepEqual(r2, ['a', 2, 3, 4])
    })

    it('should merge primitives and mixes', () => {
        assert.equal(merge({}, 2), 2)
        assert.equal(merge('a', null), null)
        const symba = Symbol()
        assert.equal(merge({}, symba), symba)
        assert.equal(merge(0, undefined), 0)
        assert.equal(merge(undefined, 'xxx'), 'xxx')
        assert.deepEqual(merge(['x'], { z: 0 }), { z: 0 })
    })

    it('should deeply merge', () => {
        const a = [
            { b: 1 },
            { items: [10, 20, 30 ], x: '?', y: 99 },
        ]
        const b = [
            { a: 0 },
            {
                items: [9],
                y: '+',
            }
        ]
        assert.deepEqual(merge(a, b), [
            { a: 0, b: 1 },
            {
                items: [9, 20, 30],
                x: '?',
                y: '+',
            }
        ])
    })
})
