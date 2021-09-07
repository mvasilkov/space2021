'use strict'

const INVADER_MISSING = 0
const INVADER_ALIVE = 1

class Invader {
    constructor() {
        this.job = INVADER_MISSING
        this.pos = new Vec2
        this.lastPos = new Vec2
        this.angle = 0
        this.lastAngle = 0
        this.targeted = false
    }

    initialize() {
        const spawn = Math.random() < 0.5
        const coord = GAME_CANVAS_WIDTH * Math.random()

        this.job = INVADER_ALIVE
        this.pos.set(
            spawn ? coord : 0,
            spawn ? 0 : coord)
        this.lastPos.copy(this.pos)
        this.angle = this.lastAngle = MATH_2PI * Math.random() - Math.PI
        this.targeted = false
    }

    update() {
        this.lastPos.copy(this.pos)
        this.lastAngle = this.angle

        if (this.pos.distanceSquared(0.5 * GAME_CANVAS_WIDTH, 0.5 * GAME_CANVAS_WIDTH) < 2e5) {
            // Avoid planet
            const desiredAngle = Math.atan2(
                this.pos.y - 0.5 * GAME_CANVAS_HEIGHT,
                this.pos.x - 0.5 * GAME_CANVAS_WIDTH)

            let difference = this.angle - desiredAngle
            difference += wrapAngleInc(difference)

            this.angle += difference > 0 ? -INVADER_STEERING : INVADER_STEERING
        }
        else {
            this.angle += INVADER_STEERING * (Math.random() - 0.5)
        }

        goAndWrap(this, INVADER_SPEED)
    }

    render(con, t) {
        con.save()

        con.translate(
            lerp(this.lastPos.x, this.pos.x, t),
            lerp(this.lastPos.y, this.pos.y, t))
        con.rotate(lerp(this.lastAngle, this.angle, t))

        con.moveTo(-10, 10)
        con.lineTo(20, 0)
        con.lineTo(-10, -10)
        con.closePath()

        con.restore()
    }
}

function updateInvaders(invaders) {
    for (let n = 0; n < TOTAL_INVADERS; ++n) {
        if (invaders[n].job === INVADER_ALIVE) {
            invaders[n].update()
        }
    }
}

/** Batch render all invaders */
function renderInvaders(invaders, con, t) {
    con.beginPath()

    for (let n = 0; n < TOTAL_INVADERS; ++n) {
        if (invaders[n].job === INVADER_ALIVE) {
            invaders[n].render(con, t)
        }
    }

    con.lineWidth = 4
    con.strokeStyle = PAL_FFA5D5
    con.stroke()

    // con.lineWidth = 4
    // con.fillStyle = PAL_FFA5D5
    // con.fill()
}

// Random walk: choose a direction, go 4 units in that direction
function brownianMotion(invaders) {
    for (let n = 0; n < TOTAL_INVADERS; ++n) {
        if (invaders[n].job === INVADER_MISSING) continue

        const subj = invaders[n]
        const angle = Math.random() * MATH_2PI

        subj.lastPos.copy(subj.pos)
        subj.pos.x += 4 * Math.cos(angle)
        subj.pos.y += 4 * Math.sin(angle)
    }
}

// Invader and rocket really should've inherited from the same class.
function goAndWrap(subj, speed) {
    subj.pos.x += speed * Math.cos(subj.angle)
    subj.pos.y += speed * Math.sin(subj.angle)

    const dx = wrapInc(subj.pos.x, 0, GAME_CANVAS_WIDTH)
    const dy = wrapInc(subj.pos.y, 0, GAME_CANVAS_HEIGHT)
    const da = wrapAngleInc(subj.angle)

    subj.pos.x += dx
    subj.lastPos.x += dx
    subj.pos.y += dy
    subj.lastPos.y += dy
    subj.angle += da
    subj.lastAngle += da
}
