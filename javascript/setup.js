'use strict'

const TOTAL_PLATFORMS = 12
const PLATFORM_BUILD_TIME = 50 // ticks, 1 second = 50 ticks
const PLATFORM_UPGRADE_TIME = 50
const PLATFORM_ROTATE_TIME = 1991

const CANNON_RELOAD_TIME = 100

const TOTAL_INVADERS = 16

const GAME_CANVAS_HEIGHT = 1080
const GAME_CANVAS_WIDTH = 1080

const FONTS = `-apple-system, 'Segoe UI', 'DejaVu Sans', system-ui, sans-serif`

const canvases = {
    /** Main screen canvas */
    a: document.getElementById('a'),
    /** Braille canvas */
    b: document.getElementById('b'),
    /** Background canvas */
    s: document.getElementById('s'),
}

const cons = {
    /** Main screen rendering context */
    a: canvases.a.getContext('2d'),
    /** Braille rendering context */
    b: canvases.b.getContext('2d'),
    /** Background rendering context */
    s: canvases.s.getContext('2d'),
}

canvases.a.height = canvases.s.height = GAME_CANVAS_HEIGHT
canvases.a.width = canvases.s.width = GAME_CANVAS_WIDTH

canvases.b.height = BRAILLE_CANVAS_HEIGHT
canvases.b.width = BRAILLE_CANVAS_WIDTH

// Utility functions

function lerp(a, b, t) {
    return a * (1 - t) + b * t
}
