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

            drawBraillePattern(con,
                x0 + BRAILLE_PATTERN_WIDTH * x,
                y0 + BRAILLE_PATTERN_HEIGHT * y,
                BRAILLE_DOT_SIZE, char)
        }
    }

    con.fillStyle = color
    con.fill()
}

// Not the best place to put this function but oh well
const DECAY_BAR_HEIGHT = 1 * BRAILLE_PATTERN_HEIGHT
const DECAY_BAR_WIDTH = 20 * BRAILLE_PATTERN_WIDTH

function paintPlanetDecay(con, color, decay) {
    const x0 = 0.5 * GAME_CANVAS_WIDTH - 0.5 * DECAY_BAR_WIDTH
    const y0 = 0.5 * GAME_CANVAS_HEIGHT - 0.5 * DECAY_BAR_HEIGHT

    con.fillStyle = PAL_BLACK
    con.lineWidth = BRAILLE_DOT_SIZE
    con.strokeStyle = color

    con.fillRect(x0 - 3 * BRAILLE_DOT_SIZE,
        y0 - 3 * BRAILLE_DOT_SIZE,
        DECAY_BAR_WIDTH + 6 * BRAILLE_DOT_SIZE,
        DECAY_BAR_HEIGHT + 6 * BRAILLE_DOT_SIZE)
    con.strokeRect(x0 - 1.5 * BRAILLE_DOT_SIZE,
        y0 - 1.5 * BRAILLE_DOT_SIZE,
        DECAY_BAR_WIDTH + 3 * BRAILLE_DOT_SIZE,
        DECAY_BAR_HEIGHT + 3 * BRAILLE_DOT_SIZE)

    con.fillStyle = color
    con.fillRect(x0, y0,
        DECAY_BAR_WIDTH * (GAME_DECAY_TIME - decay) / GAME_DECAY_TIME,
        DECAY_BAR_HEIGHT)
}
