'use strict'

const state = {}

function resetState() {
    state.funds = 0

    state.planet = new Planet(Math, 100, 100)

    state.cannons = Array(TOTAL_CANNONS)

    for (let n = 0; n < TOTAL_CANNONS; ++n) {
        state.cannons[n] = new Cannon
    }

    state.invaders = Array(TOTAL_INVADERS)

    for (let n = 0; n < TOTAL_INVADERS; ++n) {
        state.invaders[n] = new Invader

        // This will happen later in the actual game
        state.invaders[n].initialize()
    }
}
