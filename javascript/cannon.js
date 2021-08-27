'use strict'

const CANNON_MISSING = 0
const CANNON_BUILDING = 1
const CANNON_UPGRADING = 2
const CANNON_READY = 3
const CANNON_RELOADING = 4
const CANNON_RECYCLING = 5

// Rendering constants
const CANNON_ALTITUDE = 300
const CANNON_ANGULAR_WIDTH = 2 * Math.PI / TOTAL_CANNONS
const CANNON_HEIGHT = 40

class Cannon {
    constructor() {
        this._changeJob(CANNON_MISSING)
    }

    _changeJob(job) {
        this.job = job
        this.progress = 0
        this.lastProgress = 0
    }

    build() {
        this._changeJob(CANNON_BUILDING)
    }

    update() {
        switch (this.job) {
            case CANNON_BUILDING:
                if (this.progress === CANNON_BUILD_TIME) {
                    this._changeJob(CANNON_READY)
                }
                else {
                    ++this.progress
                }
                break
        }
    }

    render(con, n) {
        const a0 = CANNON_ANGULAR_WIDTH * n - 0.5 * CANNON_ANGULAR_WIDTH
        const a1 = CANNON_ANGULAR_WIDTH * n + 0.5 * CANNON_ANGULAR_WIDTH
        const r0 = CANNON_ALTITUDE
        const r1 = CANNON_ALTITUDE + CANNON_HEIGHT

        con.moveTo(r0 * Math.cos(a0), r0 * Math.sin(a0))
        con.lineTo(r1 * Math.cos(a0), r1 * Math.sin(a0))
        con.lineTo(r1 * Math.cos(a1), r1 * Math.sin(a1))
        con.lineTo(r0 * Math.cos(a1), r0 * Math.sin(a1))
        con.lineTo(r0 * Math.cos(a0), r0 * Math.sin(a0))
    }
}

/** Batch render all cannons */
function renderCannons(cannons, con, t) {
    con.save()
    con.translate(0.5 * GAME_CANVAS_WIDTH, 0.5 * GAME_CANVAS_WIDTH)

    con.beginPath()

    for (let n = 0; n < TOTAL_CANNONS; ++n) {
        const cannon = cannons[n]

        if (cannon.job === CANNON_BUILDING || cannon.job === CANNON_READY) {
            cannon.render(con, n)
        }
    }

    con.closePath()

    con.lineWidth = 2
    con.strokeStyle = '#0080ff'
    con.stroke()

    con.restore()
}
