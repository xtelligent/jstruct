const create = (name, message, code, otherFields) => Object
    .assign(new Error(message), {
        name,
        code,
        ...otherFields,
    })


module.exports = {
    create,
}
