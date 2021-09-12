'use strict'

function update() {
    if (state.ended === true) return

    updateGlobalState()

    updateDefenses(state.defenses)

    updateCannons(state.cannons)

    updateInvaders(state.invaders)

    updateRockets(state.rockets)

    updateDebris(state.debris)
}

function render(t) {
    if (state.ended === true) return

    cons.a.clearRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_WIDTH)

    // Resize the planet
    let planetOffset = 0.5 * GAME_CANVAS_WIDTH - 3 *
        (state.phase === GAME_BEFORE_START ? GAME_STARTING_PLANET_SIZE : GAME_PLANET_SIZE)

    if (state.phase === GAME_BEFORE_START) {
        paintBackgroundMask(cons.a, 3 * GAME_STARTING_PLANET_SIZE)
    }
    else if (state.phase === GAME_STARTING) {
        const progress = lerp(state.lastProgress, state.progress, t)
        const planetSize = lerp(GAME_STARTING_PLANET_SIZE, GAME_PLANET_SIZE,
            easeOutQuad(progress / GAME_STARTING_TIME)) // & 0b11111100

        state.planet.resize(planetSize, planetSize)

        planetOffset = (0.5 * GAME_CANVAS_WIDTH - 3 * planetSize) & 0xffe

        // Paint the background only during the GAME_BEFORE_START | GAME_STARTING transition
        paintBackgroundMask(cons.a, 3 * planetSize)
    }

    paintBraille(cons.a, planetOffset, planetOffset, state.planetColor,
        state.planet.render(), state.planet.enc)

    if (state.phase === GAME_PLANET_DECAY) {
        paintPlanetDecay(cons.a, state.planetColor, state.progress)
    }

    renderDefenses(state.defenses, cons.a, t)

    renderCannons(state.defenses, cons.a, t)

    renderInvaders(state.invaders, cons.a, t)

    renderRockets(state.rockets, cons.a, t)

    renderDebris(state.debris, cons.a, t)
}

function run() {
    actionSetEnabled('music', false)
    actionSetEnabled('sound', false)

    // Prevent unwanted browser features
    document.body.addEventListener('contextmenu', event => {
        event.preventDefault()
    })

    // Initialization
    initActions()

    resetState()

    paintBackground(cons.b, state.stars)
    paintBackgroundMask(cons.b, 3 * GAME_PLANET_SIZE)

    startMainloop(update, render)
}

run()
