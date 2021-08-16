'use strict'

const TOTAL_CANNONS = 12
const CANNON_BUILD_TIME = 50 // ticks, 1 second = 50 ticks
const CANNON_RELOAD_TIME = 100

const canvases = {
    b: document.getElementById('b'),
}

const cons = {
    b: canvases.b.getContext('2d'),
}

canvases.b.height = BRAILLE_CANVAS_HEIGHT
canvases.b.width = BRAILLE_CANVAS_WIDTH
