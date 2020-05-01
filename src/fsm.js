const privateRegion = Symbol.for('privateRegion')
const finalState = 1
const renderedView = 2

const createThisPtrFor = (fsm, runningAction) => ({
    get currentState() {
        return fsm.currentState
    },
    get currentActions() {
        return fsm.currentActions
    },
    get buildContext() {
        return Object.freeze(fsm[privateRegion].mutable
            .buildContext || null)
    },
    get runningAction() {
        return runningAction
    },
})

const createCallbackWrapper = (fsm, name, callback) => (...args) => {
    const thisPtr = createThisPtrFor(fsm, name)
    const result = {
        stateId: thisPtr.currentState,
        buildContext: thisPtr.buildContext,
        ...callback.call(thisPtr, ...args),
    }
    let m = fsm[privateRegion].mutable
    m.stateId = result.stateId === null || result.stateId === undefined || result.resultType === renderedView
        ? thisPtr.currentState
        : result.stateId
    if (result.resultType !== renderedView) {
        m.buildContext = result.buildContext
    }
    switch (result.resultType) {
        case finalState:
            return m.buildContext
        case renderedView:
            return result.buildContext
        default:
            return fsm.currentActions
    }
}

const createActions = (fsm, stateDefn) => ({
    ...stateDefn,
    callbacks: Object.freeze(
        Object.assign({},
            ...Object.entries(stateDefn.callbacks)
                .map(([name, callback]) => ({
                    [name]: createCallbackWrapper(fsm, name, callback)
                }))
        )
    )
})

class FSM {
    constructor(states) {
        this[privateRegion] = {
            static: {
                states: new Map(
                    states
                        .map(stateDefn => createActions(this, stateDefn))
                        .map(({ stateId, callbacks }) => [stateId, callbacks])
                )
            },
            mutable: {
                stateId: Array.from(states)[0].stateId,
                buildContext: null,
            }
        }
    }

    get currentState() {
        return this[privateRegion].mutable.stateId
    }

    get currentActions() {
        return this[privateRegion]
            .static
            .states.get(this.currentState)
    }
}

/**
 * Creates one of the states for an FSM.
 * @param {*} stateId Identifier for the represented state.
 * @param {*} callbacks Potentially transitional operations supported
 * in the represented state.
 */
const defineState = (stateId, callbacks) => ({
    stateId,
    callbacks: { ...callbacks },
})

/**
 * Used to create a return value from a state callback
 * @param {*} stateId State to transition to.
 * @param {*} newBuildContext A transformed copy of the build context, saved
 * to the this object.
 * @param {*} resultType Either null, finalState, or renderedView.
 */
const transitionTo = (stateId, newBuildContext, resultType = null) => ({
    stateId,
    buildContext: newBuildContext,
    resultType,
})

/**
 * Creates a finite state machine supporting all
 * listed discreet states.
 * @param  {...any} states 
 */
const create = (...states) => new FSM(states)

module.exports = {
    create,
    defineState,
    transitionTo,
    resultTypes: {
        finalState,
        renderedView,
    }
}
