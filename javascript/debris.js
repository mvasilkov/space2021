'use strict'

const DEBRIS_MISSING = 0
const DEBRIS_ALIVE = 1

class Debris {
    constructor() {
        this.job = DEBRIS_MISSING
        this.pos = new Vec2
        this.lastPos = new Vec2
        this.angle = 0
        this.lastAngle = 0 // not used. Required because goAndWrap updates it
        this.life = 0
    }

    initialize(x, y) {
        this.job = DEBRIS_ALIVE
        this.pos.set(x, y)
        this.lastPos.copy(this.pos)
        this.angle = this.lastAngle = MATH_2PI * Math.random() - Math.PI
        this.life = DEBRIS_LIFE_TIME
    }

    update() {
        this.lastPos.copy(this.pos)
        // this.lastAngle = this.angle

        if (--this.life === 0) {
            this.job = DEBRIS_MISSING
            return
        }

        goAndWrap(this, DEBRIS_SPEED)
    }
}

function updateDebris(debris) {
    for (let n = 0; n < TOTAL_DEBRIS; ++n) {
        if (debris[n].job === DEBRIS_ALIVE) {
            debris[n].update()
        }
    }
}

/** Batch render all debris */
function renderDebris(debris, con, t) {
    con.beginPath()

    for (let n = 0; n < TOTAL_DEBRIS; ++n) {
        const deb = debris[n]

        if (deb.job === DEBRIS_ALIVE) {
            const x = lerp(deb.lastPos.x, deb.pos.x, t)
            const y = lerp(deb.lastPos.y, deb.pos.y, t)
            const size = 6 * (deb.life / DEBRIS_LIFE_TIME) + 4

            con.rect(x, y, size, size)
        }
    }

    con.fillStyle = PAL_FFE091
    con.fill()
}
