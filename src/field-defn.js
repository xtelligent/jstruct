const { types, dataTypeOf } = require('./datatype')
const { create: createError } = require('./error')

const structDefTag = Symbol.for('structDefTag')
const renderData = Symbol.for('renderData')

const FIELD_VALIDATION = 'FIELD_VALIDATION'

const defaultValidator = () => null
const makeValidatorForType = ({ value, name }) => value === null || value === undefined
    ? defaultValidator
    : v => typeof(v) !== typeof(value)
        ? { message: `Expected type ${typeof value} for field [${name}]` }
        : null

class BaseFieldDefn {
    static notImplemented(name, ...args) {
        throw createError('AbstractFunctionError', `Function ${name} not implemented`,
            'ABSTRACT_CALL', { name, args })
    }

    constructor(name) {
        this._name = name
    }

    get name() {
        return this._name
    }
    validate(v) {
        return notImplemented('validate', v)
    }
    [renderData](overlayValue) {
        return notImplemented(renderData, overlayValue)
    }
}

class FieldDefn extends BaseFieldDefn {
    constructor(name, defaultValue, validator) {
        super(name)
        const v = !validator
            ? makeValidatorForType({ value: defaultValue, name })
            : validator
        this.validator = v
        this.validate(defaultValue)
        this.defaultValue = defaultValue
    }

    [renderData](overlayValue) {
        if (overlayValue !== undefined) {
            this.validate(overlayValue)
            return overlayValue
        }
        return this.defaultValue
    }

    validate(tryValue) {
        const problem = this.validator(tryValue)
        if (problem) {
            throw createError(
                'FieldValidationError',
                problem.message || `Attempt to set an illegal value for field [${this.name}]`,
                FIELD_VALIDATION,
                {
                    name: this.name,
                    value: tryValue,
                    ...problem.info,
                }
            )
        }
    }
}

class StructFieldDefn extends BaseFieldDefn {
    constructor(name, structDefn, validator) {
        super(name)
        this.structDefn = structDefn
        this.validator = validator
    }

    doThrow(doc, message, info) {
        throw createError(
            'StructFieldValidationError',
            message,
            FIELD_VALIDATION,
            {
                name: this.name,
                value: doc,
                ...info,
            }
        )
    }
    defaultValidator(doc) {
        if (typeof doc !== 'object') {
            return this.doThrow(doc, `Expected object in field [${this.name}]`)
        }
        this.renderData(doc)
        return null
    }
    validate(doc) {
        if (this.validator) {
            problem = this.validator(doc)
            if (problem) {
                return this.doThrow(doc, problem.message || 'Document did not validate',
                    problem.info)
            }
            return null
        }
        return this.defaultValidator(doc)
    }
    [renderData](overlayValue) {
        return this.structDefn.render(overlayValue)
    }
}

class ArrayFieldDefn extends BaseFieldDefn {
    constructor(name, defaultValue, validator) {
        super(name)
        this.defaultValue = defaultValue
        this.validator = validator
    }

    doThrow(value, message, info) {
        throw createError(
            'ArrayFieldValidationError',
            message,
            FIELD_VALIDATION,
            {
                name: this.name,
                value,
                ...info,
            }
        )
    }
    defaultValidator(value) {
        if (!Array.isArray(value)) {
            return this.doThrow(value, `Expected Array in field [${this.name}]`)
        }
        return null
    }
    validate(value) {
        if (this.validator) {
            problem = this.validator(value)
            if (problem) {
                return this.doThrow(value, problem.message || 'Value did not validate',
                    problem.info)
            }
            return null
        }
        return this.defaultValidator(value)
    }
    [renderData](overlayValue) {
        const result = Object.assign([], this.defaultValue, overlayValue || [])
        this.validate(result)
        return result
    }
}

const create = (name, value, validator) => {
    switch(dataTypeOf(value)) {
        case types.OBJECT:
            return new StructFieldDefn(name, value, validator)
        case types.ARRAY:
            return new ArrayFieldDefn(name, value, validator)
        default:
            return new FieldDefn(name, value, validator)
    }
}

module.exports = {
    create,
    structDefTag,
    renderData,
}
