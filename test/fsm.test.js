const assert = require('assert')
const {
    create: createFsm,
    defineState,
    transitionTo,
    resultTypes,
} = require('../src/fsm')

const off = 0
const rock = 1
const blues = 2
const country = 3

const addToHistory = (history, message) => (history || [])
    .concat([{ time: Date.now(), message }])

function turnOn(initialStation) {
    return transitionTo(initialStation, {
        volume: 5,
        history: addToHistory([], 'radio on'),
    })
}

function turnOff() {
    return transitionTo(off, {
        ...this.buildContext,
        history: addToHistory(
            this.buildContext.history,
            `radio off`,
        ),
    }, resultTypes.finalState)
}

function show() {
    return transitionTo(
        'fake ignored state',
        `State: ${this.currentState}`,
        resultTypes.renderedView)
}

function changeStation(to) {
    // Next line is an identity operation from the FSM perspective.
    if (to === this.currentState) return null
    return transitionTo(to, {
        ...this.buildContext,
        history: addToHistory(
            this.buildContext.history,
            `station changed to ${to}`,
        )
    })
}

function adjustVolume(adjustment) {
    // Next line is an identity operation from the FSM perspective.
    if (adjustment === 0) return null
    return transitionTo(null, {
        ...this.buildContext,
        volume: this.buildContext.volume + adjustment,
        history: addToHistory(
            this.buildContext.history,
            `volume changed by ${adjustment}`,
        )
    })
}

const sampleFsm = () => {
    return createFsm(
        defineState(off, { turnOn, show }),
        defineState(rock, { adjustVolume, changeStation, turnOff, show }),
        defineState(blues, { adjustVolume, changeStation, turnOff, show }),
        defineState(country, { adjustVolume, changeStation, turnOff, show }),
    )
}

describe('fsm module', () => {
    it('could perhaps work properly', () => {
        const fsm = sampleFsm()
        const result = fsm.currentActions
            .turnOn(country)
            .changeStation(country)
            .changeStation(rock)
            .changeStation(blues)
            .adjustVolume(0)
            .adjustVolume(2)
            .turnOff()
        assert.equal(result.volume, 7)
        assert.equal(result.history.length, 5)
    })

    it('should support renderedView w/o changing state', () => {
        const fsm = sampleFsm()
        const result = fsm.currentActions
            .turnOn(country)
            .show()
        assert.equal(result, `State: ${country}`)
        assert.equal(fsm.currentState, country)
    })
})
