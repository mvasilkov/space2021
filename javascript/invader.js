'use strict'

const INVADER_MISSING = 0
const INVADER_ALIVE = 1
const INVADER_EXPLODING = 2
const INVADER_LEAVING = 3

class Invader {
    constructor() {
        this.job = INVADER_MISSING
        this.progress = 0
    }
}
