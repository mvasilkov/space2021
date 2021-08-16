'use strict'

const BRAILLE_DOT_SIZE = 2
const BRAILLE_PATTERN_HEIGHT = 24
const BRAILLE_PATTERN_WIDTH = 0.5 * BRAILLE_PATTERN_HEIGHT
const BRAILLE_PATTERN_SPACING = 0.5 * BRAILLE_PATTERN_WIDTH
const BRAILLE_PATTERN_PADDING = 0.5 * BRAILLE_PATTERN_SPACING
const BRAILLE_CANVAS_HEIGHT = 400 // 16 * BRAILLE_PATTERN_HEIGHT
const BRAILLE_CANVAS_WIDTH = 200 // 16 * BRAILLE_PATTERN_WIDTH

const BRAILLE_DOT_POS = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [0, 3],
    [1, 3],
]

const MATH_2PI = 2 * Math.PI

function paintBraille(con) {
    con.fillStyle = '#2E3440'
    con.fillRect(0, 0, BRAILLE_CANVAS_WIDTH, BRAILLE_CANVAS_HEIGHT)

    con.beginPath()

    for (let y = 0; y < 16; ++y) {
        for (let x = 0; x < 16; ++x) {
            drawBraillePattern(con,
                BRAILLE_PATTERN_WIDTH * x,
                BRAILLE_PATTERN_HEIGHT * y,
                x | (y << 4))
        }
    }

    con.closePath()

    con.fillStyle = '#ECEFF4'
    con.fill()
}

function drawBraillePattern(con, x0, y0, p) {
    for (let n = 0; n < 8; ++n) {
        if (p & 0b1 === 1) {
            const x = x0 + BRAILLE_DOT_POS[n][0] * BRAILLE_PATTERN_SPACING + BRAILLE_PATTERN_PADDING
            const y = y0 + BRAILLE_DOT_POS[n][1] * BRAILLE_PATTERN_SPACING + BRAILLE_PATTERN_PADDING
            con.moveTo(x, y)
            con.arc(x, y, BRAILLE_DOT_SIZE, 0, MATH_2PI)
        }
        p = p >>> 1
    }
}
