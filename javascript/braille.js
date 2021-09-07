'use strict'

const BRAILLE_DOT_SIZE = 6
const BRAILLE_PATTERN_HEIGHT = 24
const BRAILLE_PATTERN_WIDTH = 0.5 * BRAILLE_PATTERN_HEIGHT
const BRAILLE_PATTERN_SPACING = 0.5 * BRAILLE_PATTERN_WIDTH

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

function drawBraillePattern(con, x0, y0, dotSize, p) {
    for (let n = 0; n < 8; ++n) {
        if (p & 0b1 === 1) {
            const x = x0 + BRAILLE_DOT_POS[n][0] * BRAILLE_PATTERN_SPACING
            const y = y0 + BRAILLE_DOT_POS[n][1] * BRAILLE_PATTERN_SPACING

            con.rect(x, y, dotSize, dotSize)
        }
        p = p >>> 1
    }
}

function paintBraille(con, x0, y0, color, table, enc) {
    con.beginPath()

    for (let y = 0; y < table.length; ++y) {
        const line = table[y]

        for (let x = 0; x < line.length; ++x) {
            const char = enc(line[x])
            if (char === 0) continue

            const bx = char & 0b1111
            const by = (char >>> 4) & 0b1111

            drawBraillePattern(con,
                x0 + BRAILLE_PATTERN_WIDTH * x,
                y0 + BRAILLE_PATTERN_HEIGHT * y,
                BRAILLE_DOT_SIZE, char)
        }
    }

    con.fillStyle = color
    con.fill()
}
