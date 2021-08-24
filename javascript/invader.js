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

    con.strokeStyle = '#ff0080'
    con.stroke()
}
