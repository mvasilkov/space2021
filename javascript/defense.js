'use strict'

const PLATFORM_MISSING = 0
const PLATFORM_BUILDING = 1
const PLATFORM_UPGRADING = 2
const PLATFORM_READY = 3
const PLATFORM_RECYCLING = 4

const PLATFORM_TOP_LEVEL = 4

// Rendering constants
const PLATFORM_ALTITUDE = 350
const PLATFORM_ANGULAR_WIDTH = 2 * Math.PI / TOTAL_PLATFORMS
const PLATFORM_HEIGHT = 30

class DefensePl {
    constructor(n) {
        this.cannons = Array(PLATFORM_TOP_LEVEL)
        this.n = n

        this._changeJob(PLATFORM_MISSING, 0)
    }

    _changeJob(job, level) {
        this.job = job
        this.progress = 0
        this.lastProgress = 0
        this.level = level
    }

    build() {
        this._changeJob(PLATFORM_BUILDING, 0)
    }

    upgrade() {
        this._changeJob(PLATFORM_UPGRADING, this.level)
    }

    update() {
        switch (this.job) {
            case PLATFORM_BUILDING:
                if (this.progress === PLATFORM_BUILD_TIME) {
                    this._changeJob(PLATFORM_READY, 1)
                    this.cannons[0]._changeJob(CANNON_READY) // can rewrite to [this.level - 1]
                }
                else {
                    ++this.progress
                }
                break

            case PLATFORM_UPGRADING:
                if (this.progress === PLATFORM_UPGRADE_TIME) {
                    this._changeJob(PLATFORM_READY, 2 * this.level)
                    if (this.level === 2) {
                        this.cannons[1]._changeJob(CANNON_READY) // can rewrite to [this.level - 1]
                    }
                    else { // this.level === PLATFORM_TOP_LEVEL
                        this.cannons[2]._changeJob(CANNON_READY)
                        this.cannons[3]._changeJob(CANNON_READY)
                    }
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

function updateDefenses(defenses) {
    state.lastRotation = state.rotation
    if (++state.rotation === PLATFORM_ROTATE_TIME) {
        state.rotation = 0
    }

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = defenses[n]

        pl.update()
    }
}

/** Batch render all defenses */
function renderDefenses(defenses, con, t) {
    const rotation = lerp(
        state.lastRotation,
        state.rotation + (state.rotation < state.lastRotation ? PLATFORM_ROTATE_TIME : 0),
        t)

    con.save()
    con.translate(0.5 * GAME_CANVAS_WIDTH, 0.5 * GAME_CANVAS_WIDTH)
    con.rotate(2 * Math.PI * rotation / PLATFORM_ROTATE_TIME)

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

    // con.restore() -- this happens in renderCannons
}
