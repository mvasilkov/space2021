'use strict'

const actions = {
    start() {
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

        pls[(pls.length * Math.random()) | 0].upgrade()
    },
}

function initActions() {
    for (let a in actions) {
        const b = document.getElementById('btn-' + a)

        b.addEventListener('click', function (event) {
            event.preventDefault()
            actions[a](event)
        })
    }
}
