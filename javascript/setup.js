'use strict'

const TOTAL_CANNONS = 12
const CANNON_BUILD_TIME = 50 // ticks, 1 second = 50 ticks
const CANNON_RELOAD_TIME = 100

const GAME_CANVAS_HEIGHT = 540
const GAME_CANVAS_WIDTH = 540

const FONTS = `-apple-system, 'Segoe UI', 'DejaVu Sans', system-ui, sans-serif`

const canvases = {
    a: document.getElementById('a'),
    b: document.getElementById('b'),
}

const cons = {
    a: canvases.a.getContext('2d'),
    b: canvases.b.getContext('2d'),
}

canvases.a.height = GAME_CANVAS_HEIGHT
canvases.a.width = GAME_CANVAS_WIDTH

canvases.b.height = BRAILLE_CANVAS_HEIGHT
canvases.b.width = BRAILLE_CANVAS_WIDTH
