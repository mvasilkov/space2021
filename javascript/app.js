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
    if (state.phase === GAME_STARTING) {
        const progress = lerp(state.lastProgress, state.progress, t)
        const planetSize = lerp(GAME_STARTING_PLANET_SIZE, GAME_PLANET_SIZE,
            progress / GAME_STARTING_TIME) // & 0b11111100

        state.planet.resize(planetSize, planetSize)
    }

    paintBraille(cons.a, canvases.b, 0, 0, state.planet.render(), state.planet.enc)

    renderDefenses(state.defenses, cons.a, t)

    renderCannons(state.defenses, cons.a, t)

    renderInvaders(state.invaders, cons.a, t)
}

function run() {
    initActions()

    paintBrailleInit(cons.b)

    resetState()

    paintBackground(cons.s, state.stars) // the background is static, so this should not be in render()

    startMainloop(update, render)
}

run()
