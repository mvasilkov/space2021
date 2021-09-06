'use strict'

const CANNON_MISSING = 0
const CANNON_READY = 1
const CANNON_RELOADING = 2

// Rendering constants
const CANNON_BASE_SIZE = 10
const CANNON_BARREL_LENGTH = 25

class Cannon {
    constructor(pl, n) {
        this.pl = pl
        this.n = n
        // Used for rendering
        this.x = 0
        this.y = 0

        this._changeJob(CANNON_MISSING)
    }

    _changeJob(job) {
        this.job = job
        this.progress = 0
        this.lastProgress = 0
    }

    attack() {
        this._changeJob(CANNON_RELOADING)
    }

    render(con) {
        con.save()

        con.translate(this.x, this.y)
        con.rotate(Math.atan2(this.y, this.x))

        con.moveTo(0, CANNON_BASE_SIZE)
        con.arc(0, 0, CANNON_BASE_SIZE, 0.5 * Math.PI, 1.5 * Math.PI)
        con.lineTo(CANNON_BARREL_LENGTH, 0.6 * -CANNON_BASE_SIZE)
        con.lineTo(CANNON_BARREL_LENGTH, 0.6 * CANNON_BASE_SIZE)
        con.closePath()

        con.restore()
    }

    render2(con, t) {
        const effectiveLength = t * (CANNON_BASE_SIZE + CANNON_BARREL_LENGTH)
        const x = effectiveLength - CANNON_BASE_SIZE

        con.save()

        con.translate(this.x, this.y)
        con.rotate(Math.atan2(this.y, this.x))

        if (effectiveLength <= CANNON_BASE_SIZE) {
            const a = Math.acos(x / CANNON_BASE_SIZE) // can replace with t
            const y = CANNON_BASE_SIZE * Math.sin(a)

            con.moveTo(x, y)
            con.arc(0, 0, CANNON_BASE_SIZE, a, MATH_2PI - a)
        }
        else {
            t = x / CANNON_BARREL_LENGTH
            const y = lerp(1, 0.6, t) * CANNON_BASE_SIZE

            con.moveTo(0, CANNON_BASE_SIZE)
            con.arc(0, 0, CANNON_BASE_SIZE, 0.5 * Math.PI, 1.5 * Math.PI)
            con.lineTo(x, -y)
            con.lineTo(x, y)
        }

        con.closePath()

        con.restore()
    }
}

function updateCannons(cannons) {
    for (let n = 0; n < TOTAL_CANNONS; ++n) {
        const can = cannons[n]

        if (can.job === CANNON_RELOADING) {
            can.lastProgress = can.progress

            if (can.progress === CANNON_RELOAD_TIME) {
                can._changeJob(CANNON_READY)
            }
            else {
                ++can.progress
            }
        }
    }
}

const cannonsReady = Array(TOTAL_CANNONS)
const cannonsReloading = Array(TOTAL_CANNONS)

function renderCannons(defenses, con, t) {
    let countReady = 0
    let countReloading = 0

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = defenses[n]

        if (pl.job === PLATFORM_UPGRADING || pl.job === PLATFORM_READY) {
            const sizeLevel = (pl.job === PLATFORM_UPGRADING ? 2 * pl.level : pl.level)
            const plSizeMul = 0.064 * sizeLevel + 0.14

            const a0 = PLATFORM_ANGULAR_WIDTH * (pl.n - plSizeMul)
            const a1 = PLATFORM_ANGULAR_WIDTH * (pl.n + plSizeMul)

            const rp = PLATFORM_ALTITUDE + 0.74 * PLATFORM_HEIGHT

            const x0 = rp * Math.cos(a0)
            const y0 = rp * Math.sin(a0)
            const x1 = rp * Math.cos(a1)
            const y1 = rp * Math.sin(a1)

            for (let cn = 0; cn < pl.level; ++cn) {
                const ct = (cn + 1) / (sizeLevel + 1)
                const can = pl.cannons[cn]

                can.x = lerp(x0, x1, ct)
                can.y = lerp(y0, y1, ct)

                if (can.job === CANNON_READY) cannonsReady[countReady++] = can
                else cannonsReloading[countReloading++] = can // can.job === CANNON_RELOADING
            }
        }
    }

    // Paint ready

    con.beginPath()

    for (let n = 0; n < countReady; ++n) {
        cannonsReady[n].render(con)
    }

    con.closePath()

    con.fillStyle = PAL_FFA5D5
    con.fill()

    con.lineWidth = 8
    con.strokeStyle = PAL_BLACK
    con.stroke()

    con.lineWidth = 4
    con.strokeStyle = PAL_FFA5D5
    con.stroke()

    // Paint reloading

    con.beginPath()

    for (let n = 0; n < countReloading; ++n) {
        const can = cannonsReloading[n]

        can.render2(con, lerp(can.lastProgress, can.progress, t) / CANNON_RELOAD_TIME)
    }

    con.closePath()

    con.lineWidth = 4
    con.strokeStyle = PAL_BLACK
    con.stroke()

    con.fillStyle = PAL_FFE091
    con.fill()

    // Paint reloading hulls

    con.beginPath()

    for (let n = 0; n < countReloading; ++n) {
        const can = cannonsReloading[n]

        can.render(con)
    }

    con.closePath()

    con.lineWidth = 8
    con.strokeStyle = PAL_BLACK
    con.stroke()

    con.lineWidth = 4
    con.strokeStyle = PAL_FFA5D5
    con.stroke()

    con.restore() // saved in renderDefenses
}
