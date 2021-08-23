'use strict'

function update() {
}

function render(t) {
    paintBraille(cons.a, canvases.b, 0, 0, state.planet.render(), state.planet.enc)

    renderInvaders(state.invaders, cons.a, t)
}

function run() {
    paintBrailleInit(cons.b)

    resetState()

    startMainloop(update, render)
}

run()
