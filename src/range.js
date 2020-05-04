function *range(a, b) {
    const bounds = b === undefined
        ? [0, a]
        : [a, b]
    const [start, end] = bounds
    for(let i = start; i < end; i = i + 1) {
        yield i
    }
}

module.exports = {
    range,
}
