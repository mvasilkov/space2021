'use strict'

const TOTAL_PLATFORMS = 12
const PLATFORM_BUILD_TIME = 100 // ticks, 1 second = 50 ticks
const PLATFORM_UPGRADE_TIME = 150
const PLATFORM_ROTATE_TIME = 3000
const PLATFORM_TOP_LEVEL = 4

const GAME_STARTING_TIME = 120
const GAME_STARTING_PLANET_SIZE = 190
const GAME_PLANET_SIZE = 90

const TOTAL_CANNONS = PLATFORM_TOP_LEVEL * TOTAL_PLATFORMS
const CANNON_RELOAD_TIME = 50

const TOTAL_INVADERS = 16
const INVADER_SPEED = 6
const INVADER_STEERING = 0.1 * Math.PI

const TOTAL_ROCKETS = TOTAL_INVADERS
const ROCKET_SPEED = 9
const ROCKET_STEERING = 0.01 * Math.PI

const HIT_DEBRIS = 6
const TOTAL_DEBRIS = TOTAL_INVADERS * HIT_DEBRIS
const DEBRIS_LIFE_TIME = 50
const DEBRIS_SPEED = 5

const GAME_CANVAS_HEIGHT = 1200
const GAME_CANVAS_WIDTH = 1200

const FONTS = `-apple-system, 'Segoe UI', 'DejaVu Sans', system-ui, sans-serif`

const MATH_2PI = 2 * Math.PI

const canvases = {
    /** Main screen canvas */
    a: document.getElementById('a'),
    /** Background canvas */
    b: document.getElementById('b'),
}

const cons = {
    /** Main screen rendering context */
    a: canvases.a.getContext('2d'),
    /** Background rendering context */
    b: canvases.b.getContext('2d'),
}

canvases.a.height = canvases.b.height = GAME_CANVAS_HEIGHT
canvases.a.width = canvases.b.width = GAME_CANVAS_WIDTH

cons.a.miterLimit = 1

// Utility functions

function lerp(a, b, t) {
    return a * (1 - t) + b * t
}

function easeInQuad(t) {
    return t * t
}

function easeOutQuad(t) {
    return t * (2 - t)
}

function easeInOutQuad(t) {
    return t < 0.5 ?
        2 * t * t :
        2 * t * (2 - t) - 1
}

function nop() {
}

function wrapInc(val, start, end) {
    return val < start ? end : val >= end ? -end : 0
}

function wrapAngleInc(val) {
    return val < -Math.PI ? MATH_2PI : val >= Math.PI ? -MATH_2PI : 0
}
