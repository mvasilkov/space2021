'use strict'

const PLATFORM_MISSING = 0
const PLATFORM_BUILDING = 1
const PLATFORM_UPGRADING = 2
const PLATFORM_READY = 3
const PLATFORM_RECYCLING = 4

// Rendering constants
const PLATFORM_ALTITUDE = 350
const PLATFORM_ANGULAR_WIDTH = MATH_2PI / TOTAL_PLATFORMS
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

    updateCannonsRelativeToRotation(callback) {
        // if (this.job === PLATFORM_UPGRADING || this.job === PLATFORM_READY)

        const sizeLevel = (this.job === PLATFORM_UPGRADING ? 2 * this.level : this.level)
        const plSizeMul = 0.064 * sizeLevel + 0.14

        const a0 = PLATFORM_ANGULAR_WIDTH * (this.n - plSizeMul)
        const a1 = PLATFORM_ANGULAR_WIDTH * (this.n + plSizeMul)

        const rp = PLATFORM_ALTITUDE + 0.74 * PLATFORM_HEIGHT

        const x0 = rp * Math.cos(a0)
        const y0 = rp * Math.sin(a0)
        const x1 = rp * Math.cos(a1)
        const y1 = rp * Math.sin(a1)

        for (let cn = 0; cn < this.level; ++cn) {
            const ct = (cn + 1) / (sizeLevel + 1)
            const can = this.cannons[cn]

            can.x = lerp(x0, x1, ct)
            can.y = lerp(y0, y1, ct)

            callback(can)
        }
    }

    update() {
        switch (this.job) {
            case PLATFORM_BUILDING:
                this.lastProgress = this.progress

                if (this.progress === PLATFORM_BUILD_TIME) {
                    this._changeJob(PLATFORM_READY, 1)
                    this.cannons[this.level - 1]._changeJob(CANNON_RELOADING)

                    // Enable the capacity upgrade button
                    if (state.defenses.filter(pl => pl.job === PLATFORM_READY).length === 2) {
                        actionEnter('upgrade')
                        if (document.monetization && document.monetization.state === 'started') {
                            actionEnter('bonus')
                        }
                    }
                    actionSetEnabled('upgrade', state.funds >= state.costs.upgrade)
                }
                else {
                    ++this.progress
                }
                break

            case PLATFORM_UPGRADING:
                this.lastProgress = this.progress

                if (this.progress === PLATFORM_UPGRADE_TIME) {
                    this._changeJob(PLATFORM_READY, 2 * this.level)
                    this.cannons[this.level - 1]._changeJob(CANNON_RELOADING)
                    if (this.level === PLATFORM_TOP_LEVEL) {
                        this.cannons[2]._changeJob(CANNON_RELOADING)
                    }
                    else {
                        actionEnter('speed')

                        // Enable the capacity upgrade button
                        actionSetEnabled('upgrade', state.funds >= state.costs.upgrade)
                    }
                }
                else {
                    ++this.progress
                }
                break

            case PLATFORM_RECYCLING:
                this.lastProgress = this.progress

                if (this.progress === PLATFORM_RECYCLE_TIME) {
                    this._changeJob(PLATFORM_MISSING, 0)

                    // Trigger the bad ending, if not triggered already
                    if (state.toBadEnding === 0) {
                        state.toBadEnding = setTimeout(() => {
                            endingEnter('b')
                        }, 600)
                    }
                }
                else {
                    ++this.progress
                }
        }
    }

    getSizeLevel() {
        return this.job === PLATFORM_UPGRADING ? 2 * this.level :
            this.job === PLATFORM_BUILDING ? 1 : this.level
    }

    render(con, t) {
        const plSizeMul = 0.064 * this.getSizeLevel() + 0.1

        const a0 = PLATFORM_ANGULAR_WIDTH * (this.n - plSizeMul)
        const a1 = PLATFORM_ANGULAR_WIDTH * (this.n + plSizeMul)
        const r0 = PLATFORM_ALTITUDE
        const r1 = PLATFORM_ALTITUDE + PLATFORM_HEIGHT

        const ca0 = Math.cos(a0)
        const ca1 = Math.cos(a1)
        const sa0 = Math.sin(a0)
        const sa1 = Math.sin(a1)

        const x0 = r0 * ca0
        const y0 = r0 * sa0
        const x1 = r1 * ca0
        const y1 = r1 * sa0
        // const x2 = r1 * ca1
        // const y2 = r1 * sa1
        // const x3 = r0 * ca1
        // const y3 = r0 * sa1

        con.moveTo(x0, y0)
        con.lineTo(x1, y1)
        con.lineTo(lerp(x1, /* x2 = */ r1 * ca1, t), lerp(y1, /* y2 = */ r1 * sa1, t))
        con.lineTo(lerp(x0, /* x3 = */ r0 * ca1, t), lerp(y0, /* y3 = */ r0 * sa1, t))
        con.closePath()
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
    const rotation = lerp(state.lastRotation,
        state.rotation + (state.rotation < state.lastRotation ? PLATFORM_ROTATE_TIME : 0), t)

    con.save()
    con.translate(0.5 * GAME_CANVAS_WIDTH, 0.5 * GAME_CANVAS_WIDTH)
    con.rotate(MATH_2PI * rotation / PLATFORM_ROTATE_TIME)

    // Ready defenses

    con.beginPath()

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = defenses[n]

        if (pl.job === PLATFORM_READY) {
            pl.render(con, 1)
        }
    }

    con.fillStyle = PAL_8CFF9B
    con.fill()

    con.lineWidth = 8
    con.strokeStyle = PAL_BLACK
    con.stroke()

    con.lineWidth = 4
    con.strokeStyle = PAL_8CFF9B
    con.stroke()

    // Building | upgrading progress

    con.beginPath()

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = defenses[n]

        if (pl.job === PLATFORM_BUILDING || pl.job === PLATFORM_UPGRADING || pl.job === PLATFORM_RECYCLING) {
            const k = lerp(pl.lastProgress, pl.progress, t)
            pl.render(con, (pl.job === PLATFORM_RECYCLING ? PLATFORM_RECYCLE_TIME - k : k) /
                (pl.job === PLATFORM_BUILDING ? PLATFORM_BUILD_TIME :
                    pl.job === PLATFORM_UPGRADING ? PLATFORM_UPGRADE_TIME : PLATFORM_RECYCLE_TIME))
        }
    }

    con.fillStyle = PAL_FFE091
    con.fill()

    // Building | upgrading hulls

    con.beginPath()

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = defenses[n]

        if (pl.job === PLATFORM_BUILDING || pl.job === PLATFORM_UPGRADING || pl.job === PLATFORM_RECYCLING) {
            pl.render(con, 1)
        }
    }

    con.lineWidth = 8
    con.strokeStyle = PAL_BLACK
    con.stroke()

    con.lineWidth = 4
    con.strokeStyle = PAL_8CFF9B
    con.stroke()

    // con.restore() -- this happens in renderCannons
}

function stripAllDefenses(defenses) {
    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = defenses[n]

        if (pl.job !== PLATFORM_MISSING) {
            pl._changeJob(PLATFORM_RECYCLING, pl.getSizeLevel())

            for (let cn = 0; cn < pl.level; ++cn) {
                pl.cannons[cn]._changeJob(CANNON_MISSING)
            }
        }
    }
}
