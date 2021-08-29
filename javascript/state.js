'use strict'

const state = {}

function resetState() {
    state.funds = 0

    state.planet = new Planet(Math, 100, 100)

    state.defenses = Array(TOTAL_PLATFORMS)

    state.cannons = Array(4 * TOTAL_PLATFORMS)

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = new DefensePl(n)

        for (let cn = 0; cn < 4; ++cn) {
            const can = new Cannon(pl, cn)

            pl.cannons.push(state.cannons[4 * n + cn] = can)
        }

        state.defenses[n] = pl
    }

    state.rotation = 0
    state.lastRotation = 0

    state.invaders = Array(TOTAL_INVADERS)

    for (let n = 0; n < TOTAL_INVADERS; ++n) {
        state.invaders[n] = new Invader

        // This will happen later in the actual game
        state.invaders[n].initialize()
    }
}
