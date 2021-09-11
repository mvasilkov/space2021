'use strict'

const ROCKET_MISSING = 0
const ROCKET_ALIVE = 1

class Rocket {
    constructor() {
        this.job = ROCKET_MISSING
        this.pos = new Vec2
        this.lastPos = new Vec2
        this.angle = 0
        this.lastAngle = 0
        this.target = null
    }

    initialize(cannon, target) {
        this.job = ROCKET_ALIVE

        target.targeted = true

        // Correct for rotation
        const rot = MATH_2PI * state.rotation / PLATFORM_ROTATE_TIME
        const ca = Math.cos(rot)
        const sa = Math.sin(rot)

        const x = 1.09 * (ca * cannon.x - sa * cannon.y) + 0.5 * GAME_CANVAS_WIDTH
        const y = 1.09 * (ca * cannon.y + sa * cannon.x) + 0.5 * GAME_CANVAS_WIDTH

        this.pos.set(x, y)
        this.lastPos.set(x, y)

        this.angle = this.lastAngle = rot + Math.atan2(cannon.y, cannon.x)

        this.target = target
    }

    update() {
        this.lastPos.copy(this.pos)
        this.lastAngle = this.angle

        // Find shortest distance

        let tx = this.target.pos.x
        let ty = this.target.pos.y
        let effectiveTx = tx
        let effectiveTy = ty
        let dist = this.pos.distanceSquared(tx, ty)
        let dist2

        if ((dist2 = this.pos.distanceSquared(tx + GAME_CANVAS_WIDTH, ty)) < dist) {
            dist = dist2
            effectiveTx = tx + GAME_CANVAS_WIDTH
            effectiveTy = ty
        }

        if ((dist2 = this.pos.distanceSquared(tx - GAME_CANVAS_WIDTH, ty)) < dist) {
            dist = dist2
            effectiveTx = tx - GAME_CANVAS_WIDTH
            effectiveTy = ty
        }

        if ((dist2 = this.pos.distanceSquared(tx, ty + GAME_CANVAS_HEIGHT)) < dist) {
            dist = dist2
            effectiveTx = tx
            effectiveTy = ty + GAME_CANVAS_HEIGHT
        }

        if ((dist2 = this.pos.distanceSquared(tx, ty - GAME_CANVAS_HEIGHT)) < dist) {
            dist = dist2
            effectiveTx = tx
            effectiveTy = ty - GAME_CANVAS_HEIGHT
        }

        // End shortest distance

        if (dist < state.rocketSpeed ** 2) {
            rocketHit(this)
            return
        }

        const direction = Math.atan2(
            effectiveTy - this.pos.y,
            effectiveTx - this.pos.x)

        let difference = this.angle - direction
        difference += wrapAngleInc(difference)

        this.angle += difference > 0 ? -INVADER_STEERING : INVADER_STEERING

        goAndWrap(this, state.rocketSpeed)
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

    con.fillStyle = PAL_78FAE6
    con.fill()
}
