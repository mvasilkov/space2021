'use strict'

const PLATFORM_MISSING = 0
const PLATFORM_BUILDING = 1
const PLATFORM_UPGRADING = 2
const PLATFORM_READY = 3
const PLATFORM_RECYCLING = 4

// Rendering constants
const PLATFORM_ALTITUDE = 300
const PLATFORM_ANGULAR_WIDTH = 2 * Math.PI / TOTAL_PLATFORMS
const PLATFORM_HEIGHT = 30

class DefensePl {
    constructor(n) {
        this.cannons = []
        this.n = n

        this._changeJob(PLATFORM_MISSING)
    }

    _changeJob(job) {
        this.job = job
        this.progress = 0
        this.lastProgress = 0
    }

    build() {
        this._changeJob(PLATFORM_BUILDING)
    }

    update() {
        switch (this.job) {
            case PLATFORM_BUILDING:
                if (this.progress === PLATFORM_BUILD_TIME) {
                    this._changeJob(PLATFORM_READY)
                    this.cannons[0]._changeJob(CANNON_READY)
                }
                else {
                    ++this.progress
                }
                break
        }
    }

    render(con) {
        const a0 = PLATFORM_ANGULAR_WIDTH * this.n - 0.44 * PLATFORM_ANGULAR_WIDTH
        const a1 = PLATFORM_ANGULAR_WIDTH * this.n + 0.44 * PLATFORM_ANGULAR_WIDTH
        const r0 = PLATFORM_ALTITUDE
        const r1 = PLATFORM_ALTITUDE + PLATFORM_HEIGHT

        con.moveTo(r0 * Math.cos(a0), r0 * Math.sin(a0))
        con.lineTo(r1 * Math.cos(a0), r1 * Math.sin(a0))
        con.lineTo(r1 * Math.cos(a1), r1 * Math.sin(a1))
        con.lineTo(r0 * Math.cos(a1), r0 * Math.sin(a1))
        con.lineTo(r0 * Math.cos(a0), r0 * Math.sin(a0))
    }
}

/** Batch render all defenses */
function renderDefenses(defenses, con, t) {
    con.save()
    con.translate(0.5 * GAME_CANVAS_WIDTH, 0.5 * GAME_CANVAS_WIDTH)

    con.beginPath()

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = defenses[n]

        if (pl.job === PLATFORM_BUILDING || pl.job === PLATFORM_READY) {
            pl.render(con)
        }
    }

    con.closePath()

    con.lineWidth = 2
    con.strokeStyle = '#0080ff'
    con.stroke()

    con.restore()
}
