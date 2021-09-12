'use strict'

const TOTAL_PLATFORMS = 12
const PLATFORM_BUILD_TIME = 100 // ticks, 1 second = 50 ticks
const PLATFORM_UPGRADE_TIME = 150
const PLATFORM_RECYCLE_TIME = 200
const PLATFORM_ROTATE_TIME = 3000
const PLATFORM_TOP_LEVEL = 4

const GAME_STARTING_TIME = 120
const GAME_STARTING_PLANET_SIZE = 190
const GAME_PLANET_SIZE = 90
const GAME_DECAY_TIME = 5000

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

const HEADLINE_DURATION = 9000

const SUPREMACY_TO_DECAY_TIME = 20_000
const GOOD_END_WAIT = 60_000

const COIL_BONUS = 200

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

const fundsTitle = document.getElementById('fun')
const fundsDisplay = document.getElementById('doge').firstChild

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

function actionEnter(action) {
    if (state.entered.has(action)) return
    state.entered.add(action)

    const x = document.getElementById('fn-' + action)
    if (x.className !== 'fn enter') x.className = 'fn enter'
}

function actionLeave(action) {
    const x = document.getElementById('fn-' + action)
    if (x.className !== 'fn') x.className = 'fn'
}

function actionSetEnabled(action, enabled) {
    if (enabled && action === 'upgrade') {
        enabled = state.defenses.filter(pl =>
            pl.job === PLATFORM_READY && pl.level < PLATFORM_TOP_LEVEL).length !== 0
    }

    const desiredClassName = enabled ? '' : 'off'
    const x = document.getElementById('btn-' + action)
    if (x.className !== desiredClassName) x.className = desiredClassName
}

function actionSetCost(action, cost) {
    const x = document.getElementById('c-' + action)
    x.firstChild.textContent = '' + cost
}

function newsEnter(news) {
    if (state.entered.has('.' + news)) return
    state.entered.add('.' + news)

    const x = document.getElementById('nt-' + news)
    if (x.className !== 'nt enter') {
        clearTimeout(state.toClearHeadline)
        newsLeave()

        x.className = 'nt enter'

        state.toClearHeadline = setTimeout(newsLeave, HEADLINE_DURATION)

        if (news.indexOf('decay') === 0) sound(sndBad)
        else sound(sndNews)
    }
}

function newsLeave() {
    const xs = document.getElementsByClassName('nt')
    for (let n = 0; n < xs.length; ++n) {
        if (xs[n].className !== 'nt') xs[n].className = 'nt'
    }
}

function endingEnter(end) {
    state.ended = true

    const nu = document.getElementById('nu')
    nu.style.display = 'none'

    const x = document.getElementById('end-' + end)
    if (end === 'b') {
        x.firstChild.textContent = `Under your glorious leadership, a small amount of ${state.spent} billion Dogecoins were well spent on annihilating a group of ${state.kills} alien space vessels. This might not have been entirely necessary, but a victory is a victory.\n\nWritten by Mark Vasilkov for js13kGames in 2021.`
    }
    else {
        x.firstChild.textContent = `Contacting the highly advanced aliens ushered humanity into a golden age of technology, which lasted until the onset of the Age of Strife in the 25th Millennium. But that's a completely different story.\n\nWritten by Mark Vasilkov for js13kGames in 2021.`
    }
    x.style.display = 'block'

    setTimeout(() => {
        document.getElementById('end').className = 'enter'

        sound(sndEnd)
    }, 100)
}

function nop() {
}

function wrapInc(val, start, end) {
    return val < start ? end : val >= end ? -end : 0
}

function wrapAngleInc(val) {
    return val < -Math.PI ? MATH_2PI : val >= Math.PI ? -MATH_2PI : 0
}

// Play a sound.
function sound(snd) {
    if (!state.optSound) return
    try {
        if (snd.buf === null) {
            snd.buf = ac.createBuffer(1, snd.raw.length, zzfxR)
            snd.buf.getChannelData(0).set(snd.raw)
        }
        const bufs = ac.createBufferSource()
        bufs.buffer = snd.buf
        bufs.connect(ac.destination)
        bufs.start()
    }
    catch (err) {
    }
}

const sndButton = {
    raw: zzfxMicro.apply(null, [, , 417, , .01, .01, , .94, -0.1, 2.5, -9, , , , , , , , .07, .01]),
    buf: null,
}

const sndNews = {
    raw: zzfxMicro.apply(null, [, , 345, .01, .17, .87, 1, 1.05, .2, , 67, .03, .02, , -0.2, , , .79, , .04]),
    buf: null,
}

const sndBad = {
    raw: zzfxMicro.apply(null, [, , 382, , , .48, 2, .35, -0.6, , , , , , , , .2, .72, .09]),
    buf: null,
}

const sndEnd = {
    raw: zzfxMicro.apply(null, [1.65, , 348, .09, .37, .29, 2, 1.3, 4, -5.5, 182, .1, .1, .1, , , .13, .88, .04, .28]),
    buf: null,
}

let audioInitialized = false

// Initialize audio.
function initializeAudio() {
    try {
        audioInit().then(playLoop)
    }
    catch (err) {
    }
    audioInitialized = true
}
