'use strict'

function run() {
    paintBrailleInit(cons.b)
    resetState()

    const p = new Planet
    paintBraille(cons.a, canvases.b, 0, 0, p.render(100, 100))
}

run()
