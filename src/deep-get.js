const __deepGet = (target, accessor, path, ...subPath) => {
    if (!target) return undefined
    const paths = (subPath.length > 0
        ? [path].concat(subPath)
        : path.split('.')).map(x => `${x}`) // Account for int args as array indexes
    const contextPath = paths[0]
    if (paths.length === 1) return accessor(target, contextPath)
    return __deepGet(target[contextPath], accessor, paths[1], ...paths.slice(2))
}

const deepGet = (target, path, ...subPath) => __deepGet(
    target, (t, attr) => t[attr], path, ...subPath)

const usingAccessor = accessor => ({
    deepGet: (target, path, ...subPath) => __deepGet(
        target, accessor, path, ...subPath
    )
})

module.exports = {
    deepGet,
    usingAccessor,
}
