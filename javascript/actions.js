'use strict'

const actions = {
    start() {
    },
    build() {
        for (let n = 0; n < TOTAL_CANNONS; ++n) {
            const cannon = state.cannons[n]

            if (cannon.job === CANNON_MISSING) {
                cannon.build()
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
