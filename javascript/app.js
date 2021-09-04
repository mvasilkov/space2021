'use strict'

function update() {
    updateGlobalState()

    updateDefenses(state.defenses)

    updateCannons(state.cannons)

    brownianMotion(state.invaders)
}

function render(t) {
    cons.a.clearRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_WIDTH)

    // Resize the planet
    let planetOffset = 0.5 * GAME_CANVAS_WIDTH - 3 *
        (state.phase === GAME_BEFORE_START ? GAME_STARTING_PLANET_SIZE : GAME_PLANET_SIZE)

    if (state.phase === GAME_STARTING) {
        const progress = lerp(state.lastProgress, state.progress, t)
        const planetSize = lerp(GAME_STARTING_PLANET_SIZE, GAME_PLANET_SIZE,
            easeOutQuad(progress / GAME_STARTING_TIME)) // & 0b11111100

        state.planet.resize(planetSize, planetSize)

        planetOffset = (0.5 * GAME_CANVAS_WIDTH - 3 * planetSize) & 0xffe
    }

    paintBraille(cons.a, canvases.bt, planetOffset, planetOffset,
        state.planet.render(), state.planet.enc)

    renderDefenses(state.defenses, cons.a, t)

    renderCannons(state.defenses, cons.a, t)

    renderInvaders(state.invaders, cons.a, t)
}

function run() {
    initActions()

    paintBrailleInit(cons.bt)

    resetState()

    paintBackground(cons.b, state.stars) // the background is static, so this should not be in render()

    startMainloop(update, render)
}

run()
