/* This file is part of natlib.
 * natlib, a library for games, is planned to release in early 2022.
 * https://github.com/mvasilkov/natlib
 */
'use strict'
/** Mulberry32 PRNG class */
export class Mulberry32 {
    constructor(seed) {
        this.state = seed | 0
    }
    /** Return a pseudorandom uint32. */
    randomUint32() {
        let z = this.state = (this.state + 0x6D2B79F5) | 0
        z = Math.imul(z ^ (z >>> 15), z | 1)
        z ^= z + Math.imul(z ^ (z >>> 7), z | 61)
        return (z ^ (z >>> 14)) >>> 0
    }
    /** Return a pseudorandom number in the range [0, 1). */
    random() {
        return this.randomUint32() / (2 ** 32)
    }
}
