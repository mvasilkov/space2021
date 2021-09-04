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

        this._changeJob(CANNON_MISSING)
    }

    _changeJob(job) {
        this.job = job
        this.progress = 0
        this.lastProgress = 0
    }

    render(con, x, y) {
        con.save()

        con.translate(x, y)
        con.rotate(Math.atan2(y, x))

        con.moveTo(0, CANNON_BASE_SIZE)
        con.arc(0, 0, CANNON_BASE_SIZE, 0.5 * Math.PI, 1.5 * Math.PI)
        con.lineTo(CANNON_BARREL_LENGTH, 0.6 * -CANNON_BASE_SIZE)
        con.lineTo(CANNON_BARREL_LENGTH, 0.6 * CANNON_BASE_SIZE)
        con.lineTo(0, CANNON_BASE_SIZE)

        con.restore()
    }
}

function updateCannons(cannons) {
}

function renderCannons(defenses, con, t) {
    con.beginPath()

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

                pl.cannons[cn].render(con,
                    lerp(x0, x1, ct),
                    lerp(y0, y1, ct))
            }
        }
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

    con.restore() // saved in renderDefenses
}
