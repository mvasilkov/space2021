'use strict'

const ROCKET_MISSING = 0
const ROCKET_ALIVE = 1

class Rocket {
    constructor() {
        this.job = ROCKET_MISSING
        this.pos = new Vec2
        this.lastPos = new Vec2
        this.target = null
    }

    initialize(cannon, target) {
        this.job = ROCKET_ALIVE

        target.targeted = true

        // Correct for rotation
        const rot = MATH_2PI * state.rotation / PLATFORM_ROTATE_TIME
        const ca = Math.cos(rot)
        const sa = Math.sin(rot)

        const x = 1.1 * (ca * cannon.x - sa * cannon.y) + 0.5 * GAME_CANVAS_WIDTH
        const y = 1.1 * (ca * cannon.y + sa * cannon.x) + 0.5 * GAME_CANVAS_WIDTH

        this.pos.set(x, y)
        this.lastPos.set(x, y)

        this.target = target
    }

    update() {
        const dist = this.pos.distanceSquared(this.target.pos.x, this.target.pos.y)
        if (dist < ROCKET_SPEED * ROCKET_SPEED) {
            this.job = ROCKET_MISSING
            this.target.initialize()
        }

        const direction = Math.atan2(
            this.target.pos.y - this.pos.y,
            this.target.pos.x - this.pos.x)

        this.lastPos.copy(this.pos)

        this.pos.x += ROCKET_SPEED * Math.cos(direction)
        this.pos.y += ROCKET_SPEED * Math.sin(direction)
    }

    render(con, t) {
        const x = lerp(this.lastPos.x, this.pos.x, t)
        const y = lerp(this.lastPos.y, this.pos.y, t)

        con.rect(x - 5, y - 5, 10, 10)
    }
}

function updateRockets(rockets) {
    for (let n = 0; n < TOTAL_ROCKETS; ++n) {
        if (rockets[n].job === ROCKET_ALIVE) {
            rockets[n].update()
        }
    }
}

/** Batch render all rockets */
function renderRockets(rockets, con, t) {
    con.beginPath()

    for (let n = 0; n < TOTAL_ROCKETS; ++n) {
        if (rockets[n].job === ROCKET_ALIVE) {
            rockets[n].render(con, t)
        }
    }

    con.lineWidth = 4
    con.strokeStyle = PAL_FF6675
    con.stroke()
}
