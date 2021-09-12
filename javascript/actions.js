'use strict'

const actions = {
    start() {
        actionLeave('start')
        advancePhase(GAME_STARTING)
    },
    attack(cans) {
        cans = state.cannons.filter(can => can.job === CANNON_READY)
        if (cans.length === 0) return 0

        if (state.kills === 0) actionLeave('peace')

        const rocket = state.rockets.find(rocket =>
            rocket.job === ROCKET_MISSING)

        const target = state.invaders.find(subj =>
            subj.job === INVADER_ALIVE && !subj.targeted)

        if (rocket !== undefined && target !== undefined) {
            cans[(cans.length * Math.random()) | 0].attack(rocket, target)
        }

        return cans.length
    },
    build(pls) {
        if (state.toGoodEnding !== 0) {
            clearTimeout(state.toGoodEnding)
            state.toGoodEnding = 0
        }

        pls = state.defenses.filter(pl => pl.job === PLATFORM_MISSING)
        if (pls.length === 0) return
        if (pls.length === 1) {
            newsEnter('plat')

            actionLeave('build')
        }
        else if (pls.length === TOTAL_PLATFORMS - 1) newsEnter('build')

        actionSetCost('build', state.costs.build *= 2)

        pls[(pls.length * Math.random()) | 0].build()
    },
    upgrade(pls) {
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

            newsEnter('upg')

            actionLeave('upgrade')
        }
        else actionSetCost('upgrade', state.costs.upgrade *= 2)

        pls[(pls.length * Math.random()) | 0].upgrade()
    },
    bonus() {
        actionLeave('bonus')
        enterBasedOnFunds()
    },
    speed() {
        state.rocketSpeed *= 1.2

        actionLeave('speed')
    },
    reload() {
        state.reloadTime *= 0.8

        for (let n = 0; n < state.cannons.length; ++n) {
            const can = state.cannons[n]
            if (can.job === CANNON_RELOADING && can.progress > state.reloadTime) {
                can.progress = can.lastProgress = state.reloadTime
            }
        }

        actionLeave('reload')
    },
    auto1() {
        state.afEnabled = true

        newsEnter('spend')

        actionLeave('auto1')
        actionEnter('auto2')
    },
    auto2() {
        state.afTicks *= 0.5

        newsEnter('spend2')

        actionLeave('auto2')
        actionEnter('auto3')
    },
    auto3() {
        state.afTicks *= 0.5

        newsEnter('ai')

        actionLeave('auto3')

        setTimeout(() => {
            newsEnter('decay')
            advancePhase(GAME_PLANET_DECAY)
        }, SUPREMACY_TO_DECAY_TIME)
    },
    ubi1() {
        state.revenuePerHit *= 2

        newsEnter('eco')

        actionLeave('ubi1')
        actionEnter('ubi2')
    },
    ubi2() {
        state.revenuePerHit *= 2

        newsEnter('eco2')

        actionLeave('ubi2')
        actionEnter('ubi3')
    },
    ubi3() {
        state.revenuePerHit *= 2

        actionLeave('ubi3')
    },
    strip() {
        stripAllDefenses(state.defenses)

        actionLeave('attack')
        actionLeave('strip')
    },
    peace() {
        actionLeave('peace')
        advancePhase(GAME_GOOD_END)
    },
    music() {
        document.getElementById('btn-music').firstChild.textContent =
            'music ' + ((state.optMusic = !state.optMusic) ? 'on' : 'off')
        out.gain.value = state.optMusic ? 0.4 : 0
    },
    sound() {
        document.getElementById('btn-sound').firstChild.textContent =
            'sound ' + ((state.optSound = !state.optSound) ? 'on' : 'off')
    },
}

function initActions() {
    for (let a in actions) {
        const b = document.getElementById('btn-' + a)

        b.addEventListener('click', function (event) {
            // event.stopImmediatePropagation()
            event.preventDefault()

            if (a === 'start') {
                initializeAudio()
                actionSetEnabled('music', true)
                actionSetEnabled('sound', true)
            }
            else if (a !== 'attack' && a !== 'music' && a !== 'sound') sound(sndButton)

            const cost = state.costs[a]
            if (typeof cost === 'number') {
                if (state.funds >= cost) {
                    state.funds -= state.costs[a]
                    state.spent += state.costs[a]
                }
                else return // Don't call the event handler if we couldn't afford it.
            }

            actions[a]()
        })
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === ' ' || event.code === 'Space' || event.keyCode === 32) {
            event.preventDefault()

            if (!event.repeat && state.entered.has('attack')) {
                const x = document.getElementById('btn-attack')
                if (x.className === '') actions.attack()
            }
        }
    })
}
