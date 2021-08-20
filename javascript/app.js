'use strict'

function update() {
}

function render() {
    paintBraille(cons.a, canvases.b, 0, 0, state.planet.render(), state.planet.enc)
}

function run() {
    paintBrailleInit(cons.b)

    resetState()

    startMainloop(update, render)
}

run()
