'use strict'

const INVADER_MISSING = 0
const INVADER_ALIVE = 1

class Invader {
    constructor() {
        this.job = INVADER_MISSING
        this.pos = null
        this.lastPos = null
    }

    initialize() {
        this.job = INVADER_ALIVE
        this.pos = new Vec2(
            GAME_CANVAS_WIDTH * Math.random(),
            GAME_CANVAS_HEIGHT * Math.random())
        this.lastPos = new Vec2
        this.lastPos.copy(this.pos)
    }
}

/** Batch render all invaders */
function renderInvaders(invaders, con, t) {
    con.beginPath()

    for (let n = 0; n < TOTAL_INVADERS; ++n) {
        if (invaders[n].job === INVADER_MISSING) continue

        const subj = invaders[n]
        const x = lerp(subj.lastPos.x, subj.pos.x, t)
        const y = lerp(subj.lastPos.y, subj.pos.y, t)

        con.rect(x - 4, y - 4, 8, 8)
    }

    con.closePath()

    con.lineWidth = 2
    con.strokeStyle = '#ff0080'
    con.stroke()
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
