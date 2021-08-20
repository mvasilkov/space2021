'use strict'

const BRAILLE_DOT_SIZE = 4
const BRAILLE_PATTERN_HEIGHT = 24
const BRAILLE_PATTERN_WIDTH = 0.5 * BRAILLE_PATTERN_HEIGHT
const BRAILLE_PATTERN_SPACING = 0.5 * BRAILLE_PATTERN_WIDTH
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

function paintBrailleInit(con) {
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
            const x = x0 + BRAILLE_DOT_POS[n][0] * BRAILLE_PATTERN_SPACING
            const y = y0 + BRAILLE_DOT_POS[n][1] * BRAILLE_PATTERN_SPACING
            // con.moveTo(x, y)
            con.rect(x, y, BRAILLE_DOT_SIZE, BRAILLE_DOT_SIZE)
        }
        p = p >>> 1
    }
}

function paintBraille(con, canvasBraille, x0, y0, table, enc) {
    for (let y = 0; y < table.length; ++y) {
        const line = table[y]
        for (let x = 0; x < line.length; ++x) {
            const char = enc(line[x])
            const bx = char & 0b1111
            const by = (char >>> 4) & 0b1111
            con.drawImage(canvasBraille,
                BRAILLE_PATTERN_WIDTH * bx,
                BRAILLE_PATTERN_HEIGHT * by,
                BRAILLE_PATTERN_WIDTH,
                BRAILLE_PATTERN_HEIGHT,
                x0 + BRAILLE_PATTERN_WIDTH * x,
                y0 + BRAILLE_PATTERN_HEIGHT * y,
                BRAILLE_PATTERN_WIDTH,
                BRAILLE_PATTERN_HEIGHT,
            )
        }
    }
}
