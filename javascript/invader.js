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

        if (state.phase !== GAME_GOOD_END &&
            this.pos.distanceSquared(0.5 * GAME_CANVAS_WIDTH, 0.5 * GAME_CANVAS_WIDTH) < 2e5) {

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

        // Invaders leave.
        if (state.phase === GAME_BAD_END) {
            if (this.pos.x < 1 ||
                this.pos.y < 1 ||
                this.pos.x > GAME_CANVAS_WIDTH - 2 ||
                this.pos.y > GAME_CANVAS_HEIGHT - 2) {

                this.job = INVADER_MISSING

                if (this.targeted) {
                    const rocket = state.rockets.find(subj => subj.target === this)
                    if (rocket !== undefined) rocket.job = ROCKET_MISSING
                }
            }
        }
    }

    render(con, t) {
        con.save()

        con.translate(
            lerp(this.lastPos.x, this.pos.x, t),
            lerp(this.lastPos.y, this.pos.y, t))
        con.rotate(lerp(this.lastAngle, this.angle, t))

        con.moveTo(-8, 0)
        con.lineTo(-12, -15)
        con.lineTo(20, 0)
        con.lineTo(-12, 15)
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

    if (state.phase === GAME_GOOD_END) {
        con.lineWidth = 8
        con.strokeStyle = PAL_BLACK
        con.stroke()

        con.lineWidth = 4
        con.strokeStyle = PAL_8CFF9B
        con.stroke()

        return
    }

    con.lineWidth = 4
    con.strokeStyle = PAL_FFA5D5
    con.stroke()
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
