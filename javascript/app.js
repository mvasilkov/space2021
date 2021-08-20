'use strict'

function run() {
    paintBrailleInit(cons.b)
    resetState()

    const p = new Planet(Math, 100, 100)
    paintBraille(cons.a, canvases.b, 0, 0, p.render(), p.enc)
}

run()
