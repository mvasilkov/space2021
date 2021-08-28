'use strict'

const state = {}

function resetState() {
    state.funds = 0

    state.planet = new Planet(Math, 100, 100)

    state.defenses = Array(TOTAL_PLATFORMS)

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        state.defenses[n] = new DefensePl
    }

    state.invaders = Array(TOTAL_INVADERS)

    for (let n = 0; n < TOTAL_INVADERS; ++n) {
        state.invaders[n] = new Invader

        // This will happen later in the actual game
        state.invaders[n].initialize()
    }
}
