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
}
