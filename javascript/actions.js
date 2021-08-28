'use strict'

const actions = {
    start() {
    },
    build() {
        for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
            const pl = state.defenses[n]

            if (pl.job === PLATFORM_MISSING) {
                pl.build()
                break
            }
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
