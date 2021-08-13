'use strict'

const state = {}

function resetState() {
    state.cannons = new Array(TOTAL_CANNONS)

    for (let n = 0; n < TOTAL_CANNONS; ++n) {
        state.cannons[n] = new Cannon
    }
}
