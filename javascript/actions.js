'use strict'

const actions = {
    start() {
        advancePhase(GAME_STARTING)
    },
    build() {
        // TODO start at 12:00 and search clockwise
        for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
            const pl = state.defenses[n]

            if (pl.job === PLATFORM_MISSING) {
                pl.build()
                break
            }
        }
    },
    upgrade() {
        let plLevel1 = null
        let plLevel2 = null

        // TODO start at 12:00 and search clockwise
        for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
            const pl = state.defenses[n]

            if (pl.job === PLATFORM_READY) {
                if (pl.level === 1 && plLevel1 === null) {
                    plLevel1 = pl
                }
                else if (pl.level === 2 && plLevel2 === null) {
                    plLevel2 = pl
                }
            }

            if (plLevel1 !== null && plLevel2 !== null) {
                break
            }
        }

        if (plLevel1) {
            plLevel1.upgrade()
        }
        else if (plLevel2) {
            plLevel2.upgrade()
        }
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
