async function strat() {
    return await Promise.resolve("async is working")
}

strat().then(console.log("is worcking"))