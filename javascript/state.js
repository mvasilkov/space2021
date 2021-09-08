'use strict'

const GAME_BEFORE_START = 0
const GAME_STARTING = 1
const GAME_INVADERS_ACTIVE = 2
const GAME_PLANET_DECAY = 3
const GAME_BAD_END = 4

const state = {}

function resetState() {
    state.phase = GAME_BEFORE_START

    /** Related to the current phase */
    state.progress = state.lastProgress = 0

    state.funds = state.lastFunds = 2

    state.kills = 0

    state.costs = {
        build: 2,
        upgrade: 8,
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

    state.toClearHeadline = 0
}

function advancePhase(toPhase) {
    if (state.phase !== toPhase - 1) return

    state.phase = toPhase

    switch (toPhase) {
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

            // Make sure the planet size isn't fractional, like 100.05
            state.planet.resize(GAME_PLANET_SIZE, GAME_PLANET_SIZE)

            for (let n = 0; n < TOTAL_INVADERS; ++n) {
                state.invaders[n].initialize()
            }
            break
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
            if (t > 0.75) state.planetColor = PAL_FFAA6E
            else if (t > 0.50) state.planetColor = PAL_FFE091
            else if (t > 0.25) state.planetColor = PAL_C1D9F2
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

    ++state.funds

    if (++state.kills === 16) {
        newsEnter('losses')
    }

    rocket.target.initialize()
}
