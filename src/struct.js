const {
    create: createField,
    structDefTag,
    renderData,
} = require('./field-defn')
const { types, dataTypeOf } = require('./datatype')
const { create: createError } = require('./error')
const { merge: semanticMerge } = require('./merge')
const { deepGet, usingAccessor } = require('./deep-get')

const {
    create: createFsm,
    defineState,
    transitionTo,
    resultTypes,
} = require('./fsm')

const createField2 = (name, value, validator) => {
    const v = dataTypeOf(value) === types.OBJECT && !value[structDefTag]
        ? defineStruct(value)
        : value
    return createField(name, v, validator)
}

function init() {
    return transitionTo('struct', {
        // Give the structure a UUID
        [structDefTag]: Symbol(),
        [renderData]: (overlay) => render.call(this, overlay),
    })
}

function field(name, defaultValue, validator = null) {
    return transitionTo(this.currentState, {
        ...this.buildContext,
        [name]: createField2(name, defaultValue, validator),
    })
}

function merge(shape) {
    return transitionTo(this.currentState, {
        ...this.buildContext,
        ...Object.assign({}, ...Object.entries(shape)
            .map(([name, defaultValue]) => ({
                [name]: createField2(name, defaultValue)
            }))
        )
    })
}

const defnAccessor = (target, key) => typeof target.nestedDefinition === 'function'
    ? target.nestedDefinition(key)
    : target[key]

function addValidator(name, validator) {
    const fld = usingAccessor(defnAccessor)
        .deepGet(this.buildContext, name)
    return field.call(this, name, fld.defaultValue, validator)
}

function render(overlayValues = {}) {
    const eligibleFields = new Set(Object.keys(this.buildContext))
    const badFields = Object.keys(overlayValues)
        .map(f => eligibleFields.has(f) ? null : f)
        .filter(f => f)
    if (badFields.length > 0) {
        throw createError(
            'UndefinedFieldsError',
            `The following fields are undefined: ${badFields}`,
            'UNDEFINED_FIELDS',
            {
                fields: badFields,
            }
        )
    }
    const view = semanticMerge(Object.assign({}, ...Object.entries(this.buildContext)
        .map(([name, defn]) => ({
            [name]: defn[renderData]()
        }))
    ), overlayValues)
    // Force validation on the new view.
    Object.entries(view)
        .forEach(([k, v]) => {
            const defn = this.buildContext[k]
            defn[renderData](v)
            return true
        })
    return transitionTo(null, view, resultTypes.renderedView)
}

function fieldDefinitions() {
    const view = { ...this.buildContext }
    return transitionTo(null, view, resultTypes.renderedView)
}

const structStateDef = defineState('struct', {
    field, merge,
    addValidator, render,
    fieldDefinitions,
})

function defineStruct(initialShape = {}) {
    const state0 = defineState('initialize', { init })
    const fsm = createFsm(state0, structStateDef)
    return fsm.currentActions
        .init()
        .merge(initialShape)
}

module.exports = {
    structStateDef,
    defineStruct,
}
