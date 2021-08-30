'use strict'

const CANNON_MISSING = 0
const CANNON_READY = 1
const CANNON_RELOADING = 2

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
        con.rect(x - 5, y - 5, 10, 10)
    }
}

function updateCannons(cannons) {
}

function renderCannons(defenses, con, t) {
    con.beginPath()

    for (let n = 0; n < TOTAL_PLATFORMS; ++n) {
        const pl = defenses[n]

        if (pl.job === PLATFORM_BUILDING || pl.job === PLATFORM_READY) {
            // This is a copy of DefensePl#render
            const a0 = PLATFORM_ANGULAR_WIDTH * pl.n - 0.44 * PLATFORM_ANGULAR_WIDTH
            const a1 = PLATFORM_ANGULAR_WIDTH * pl.n + 0.44 * PLATFORM_ANGULAR_WIDTH
            const rb = PLATFORM_ALTITUDE + 0.5 * PLATFORM_HEIGHT

            const x0 = rb * Math.cos(a0)
            const y0 = rb * Math.sin(a0)
            const x1 = rb * Math.cos(a1)
            const y1 = rb * Math.sin(a1)

            for (let cn = 0; cn < pl.level; ++cn) {
                const ct = (cn + 1) / (pl.level + 1)

                pl.cannons[cn].render(con,
                    lerp(x0, x1, ct),
                    lerp(y0, y1, ct))
            }
        }
    }

    con.closePath()

    con.lineWidth = 2
    con.strokeStyle = '#f00'
    con.stroke()

    con.restore() // saved in renderDefenses
}
