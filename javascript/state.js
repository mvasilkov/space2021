'use strict'

const GAME_BEFORE_START = 0
const GAME_STARTING = 1
const GAME_INVADERS_ACTIVE = 2
const GAME_PLANET_DECAY = 3
const GAME_BAD_END = 4
const GAME_GOOD_END = 5

const state = {}

function resetState() {
    state.phase = GAME_BEFORE_START

    /** Related to the current phase */
    state.progress = state.lastProgress = 0

    state.funds = state.lastFunds = 2

    state.spent = 0
    state.kills = 0

    state.entered = new Set

    state.costs = {
        build: 2,
        upgrade: 8,
        bonus: -COIL_BONUS,
        speed: 25,
        reload: 250,
        auto1: 48,
        auto2: 300,
        auto3: 500,
        ubi1: 100,
        ubi2: 666,
        ubi3: 900,
        peace: 2,
    }

    /** Background stars */
    state.stars = Array(TOTAL_STARS)

    for (let n = 0; n < TOTAL_STARS; ++n) {
        state.stars[n] = new Star
    }

    state.planet = new Planet(Math, GAME_STARTING_PLANET_SIZE,
        GAME_STARTING_PLANET_SIZE)

    state.planetColor = PAL_78FAE6

    state.defenses = Array(TOTAL_PLATFORMS)

    state.cannons = Array(TOTAL_CANNONS)

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = new DefensePl(n)

        for (let cn = 0; cn < PLATFORM_TOP_LEVEL; ++cn) {
            const can = new Cannon(pl, cn)

            pl.cannons[cn] = state.cannons[PLATFORM_TOP_LEVEL * n + cn] = can
        }

        state.defenses[n] = pl
    }

    /** Defenses' rotation */
    state.rotation = state.lastRotation = 0

    state.invaders = Array(TOTAL_INVADERS)

    for (let n = 0; n < TOTAL_INVADERS; ++n) {
        state.invaders[n] = new Invader
    }

    state.rockets = Array(TOTAL_ROCKETS)

    for (let n = 0; n < TOTAL_ROCKETS; ++n) {
        state.rockets[n] = new Rocket
    }

    state.debris = Array(TOTAL_DEBRIS)

    for (let n = 0; n < TOTAL_DEBRIS; ++n) {
        state.debris[n] = new Debris
    }

    state.toClearHeadline = state.toGoodEnding = state.toBadEnding = 0

    state.optMusic = true
    state.optSound = true

    state.rocketSpeed = ROCKET_SPEED
    state.reloadTime = CANNON_RELOAD_TIME
    state.revenuePerHit = 1

    // Auto-fire
    state.afEnabled = false
    state.afTicks = 12
    state.afProgress = 0

    state.ended = false
}

function advancePhase(toPhase) {
    if (state.phase !== toPhase - 1 &&
        (state.phase !== GAME_INVADERS_ACTIVE || toPhase !== GAME_GOOD_END)) return

    switch (state.phase = toPhase) {
        case GAME_STARTING:
        case GAME_PLANET_DECAY:
            state.progress = state.lastProgress = 0
            break

        case GAME_INVADERS_ACTIVE:
            fundsTitle.style.opacity = '1'

            setTimeout(() => {
                newsEnter('first')
            }, 250)

            setTimeout(() => {
                actionEnter('attack')
                actionEnter('build')
            }, 500)

            state.toGoodEnding = setTimeout(() => {
                actionEnter('peace')
                state.toGoodEnding = 0
            }, GOOD_END_WAIT)

            // Make sure the planet size isn't fractional, like 100.05
            state.planet.resize(GAME_PLANET_SIZE, GAME_PLANET_SIZE)

            for (let n = 0; n < TOTAL_INVADERS; ++n) {
                state.invaders[n].initialize()
            }
            break

        case GAME_GOOD_END:
            setTimeout(() => {
                newsEnter('end')
            }, 600)

            setTimeout(() => {
                endingEnter('g')
            }, 6000)

            actionLeave('attack')
            actionLeave('build')
            break

        case GAME_BAD_END:
            // attack stays but it's disabled
            actionLeave('build')
            actionLeave('upgrade')
            actionLeave('bonus')
            actionLeave('speed')
            actionLeave('reload')
            // no auto{1,2,3} as they're required for bad end anyway
            actionLeave('ubi1')
            actionLeave('ubi2')
            actionLeave('ubi3')

            actionEnter('strip')
    }
}

function updateGlobalState() {
    if (state.funds !== state.lastFunds) {
        fundsDisplay.textContent = '' + (state.lastFunds = state.funds)

        // Update buttons' availability

        for (let action in state.costs) {
            actionSetEnabled(action, state.funds >= state.costs[action])
        }
    }

    if (state.phase === GAME_STARTING) {
        state.lastProgress = state.progress

        if (state.progress === GAME_STARTING_TIME) {
            advancePhase(GAME_INVADERS_ACTIVE)
        }
        else {
            ++state.progress
        }
    }
    else if (state.phase === GAME_PLANET_DECAY) {
        state.lastProgress = state.progress

        if (state.progress === GAME_DECAY_TIME) {
            state.planetColor = PAL_FF695A
            advancePhase(GAME_BAD_END)
        }
        else {
            ++state.progress

            const t = state.progress / GAME_DECAY_TIME
            if (t > 0.75) {
                newsEnter('decay4')
                state.planetColor = PAL_FFAA6E
            }
            else if (t > 0.50) {
                newsEnter('decay3')
                state.planetColor = PAL_FFE091
            }
            else if (t > 0.25) {
                newsEnter('decay2')
                state.planetColor = PAL_C1D9F2
            }
            // else state.planetColor = PAL_78FAE6
        }
    }
}

function rocketHit(rocket) {
    rocket.job = ROCKET_MISSING

    let allocatedDebris = 0

    for (let n = 0; n < TOTAL_DEBRIS; ++n) {
        const deb = state.debris[n]

        if (deb.job === DEBRIS_MISSING) {
            deb.initialize(rocket.target.pos.x, rocket.target.pos.y)

            if (++allocatedDebris === HIT_DEBRIS) break
        }
    }

    if ((state.funds += state.revenuePerHit) > COIL_BONUS) {
        actionLeave('bonus')
    }

    enterBasedOnFunds()

    if (++state.kills === 24) {
        newsEnter('loss')
    }
    else if (state.kills === 800) {
        newsEnter('loss2')
    }

    rocket.target.initialize()
}

function enterBasedOnFunds() {
    // After the player upgraded capacity at least once
    if (!state.entered.has('speed')) return

    switch (true) {
        /*
        case state.funds >= 600:
            if (state.entered.has('ubi2')) actionEnter('ubi3')

        case state.funds >= 444:
            if (state.entered.has('ubi1')) actionEnter('ubi2')

        case state.funds >= 400:
            if (state.entered.has('auto2')) actionEnter('auto3')

        case state.funds >= 200:
            if (state.entered.has('auto1')) actionEnter('auto2')
        */

        case state.funds >= 125:
            actionEnter('reload')

        case state.funds >= 44:
            actionEnter('ubi1')

        case state.funds >= 24:
            actionEnter('auto1')
    }
}
