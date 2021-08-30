'use strict'

function update() {
    updateDefenses(state.defenses)

    updateCannons(state.cannons)

    brownianMotion(state.invaders)
}

function render(t) {
    cons.a.clearRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_WIDTH)

    paintBraille(cons.a, canvases.b, 0, 0, state.planet.render(), state.planet.enc)

    renderDefenses(state.defenses, cons.a, t)

    renderCannons(state.defenses, cons.a, t)

    renderInvaders(state.invaders, cons.a, t)
}

function run() {
    initActions()

    paintBrailleInit(cons.b)

    resetState()

    startMainloop(update, render)
}

run()
