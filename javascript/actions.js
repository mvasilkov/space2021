'use strict'

const actions = {
    start() {
        actionLeave('start')
        advancePhase(GAME_STARTING)
    },
    attack(_unused, cans) {
        cans = state.cannons.filter(can => can.job === CANNON_READY)
        if (cans.length === 0) return

        const rocket = state.rockets.find(rocket =>
            rocket.job === ROCKET_MISSING)

        const target = state.invaders.find(subj =>
            subj.job === INVADER_ALIVE && !subj.targeted)

        if (rocket !== undefined && target !== undefined) {
            cans[(cans.length * Math.random()) | 0].attack(rocket, target)
        }
    },
    build(_unused, pls) {
        pls = state.defenses.filter(pl => pl.job === PLATFORM_MISSING)
        if (pls.length === 0) return
        if (pls.length === 1) actionLeave('build')
        else if (pls.length === TOTAL_PLATFORMS - 1) newsEnter('build')

        actionSetCost('build', state.costs.build *= 2)

        pls[(pls.length * Math.random()) | 0].build()
    },
    upgrade(_unused, pls) {
        pls = state.defenses.filter(pl => pl.job === PLATFORM_READY)

        const plsLevel1 = pls.filter(pl => pl.level === 1)
        const plsLevel2 = pls.filter(pl => pl.level === 2)

        if (plsLevel1.length !== 0) {
            pls = plsLevel1
        }
        else if (plsLevel2.length !== 0) {
            pls = plsLevel2
        }
        else return

        if (state.defenses.filter(pl =>
            !(pl.job === PLATFORM_READY && pl.level === 4) &&
            !(pl.job === PLATFORM_UPGRADING && pl.level === 2)).length === 1) {

            actionLeave('upgrade')
        }
        else actionSetCost('upgrade', state.costs.upgrade *= 2)

        pls[(pls.length * Math.random()) | 0].upgrade()
    },
    bonus() {
        actionLeave('bonus')
    },
    strip() {
        stripAllDefenses(state.defenses)

        actionLeave('strip')
    },
}

function initActions() {
    for (let a in actions) {
        const b = document.getElementById('btn-' + a)

        b.addEventListener('click', function (event) {
            event.preventDefault()

            const cost = state.costs[a]
            if (typeof cost === 'number') {
                if (state.funds >= cost)
                    state.funds -= state.costs[a]
                else return // Don't call the event handler if we couldn't afford it.
            }

            actions[a](event)
        })
    }
}
