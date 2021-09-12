/* Copyright (c) 2021 by Jake Weary
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict'
const Planet = function () {
    // braille

    const enc = x => (x & 0x08) << 3 | (x & 0x70) >> 1 | (x & 0x87) // | 0x2800

    const create = (width, height) =>
        Array.from(Array((height >> 2) + 1), () => new Uint8Array((width >> 1) + 1))

    const set = (table, x, y) =>
        table[y >> 2][x >> 1] |= 1 << ((y & 3) | (x & 1) << 2)

    // bayer

    const bayer = (order, x, y) => {
        let z = 0
        for (let i = order; i--; x >>= 1, y >>= 1)
            z = (x & 1 ^ y & 1 | z << 1) << 1 | y & 1
        return z
    }

    const lut = order => {
        const size = 1 << order, area = size * size
        const lut = new Float32Array(area)
        for (let y = 0; y < size; ++y)
            for (let x = 0; x < size; ++x)
                lut[x + y * size] = (bayer(order, x, y) + .5) / area
        return (x, y) => lut[x % size + y % size * size]
    }

    return function Planet(prng, width, height) {
        // render

        const simplex = new SimplexNoise(prng)
        const bayer4 = lut(4)

        const fbm = (freq, amp, x, y, z) =>
            simplex.noise3D(x * (freq *= 2), y * freq, z * freq) * (amp *= .5) +
            simplex.noise3D(x * (freq *= 2), y * freq, z * freq) * (amp *= .5) +
            simplex.noise3D(x * (freq *= 2), y * freq, z * freq) * (amp *= .5) +
            simplex.noise3D(x * (freq *= 2), y * freq, z * freq) * (amp *= .5) +
            simplex.noise3D(x * (freq *= 2), y * freq, z * freq) * (amp *= .5) +
            // simplex.noise3D(x * (freq *= 2), y * freq, z * freq) * (amp *= .5) +
            // simplex.noise3D(x * (freq *= 2), y * freq, z * freq) * (amp *= .5) +
            simplex.noise3D(x * (freq *= 2), y * freq, z * freq) * (amp *= .5)

        const texture = (u, v, w) =>
            2 * (.5 + .5 * fbm(.5, 1, u, v, w)) % 1

        const globe = (x, y, u, v, w) => {
            const d = u * u + v * v
            if (d > 1) return false

            const f = 1 / ((1 - d ** .5) ** .5 + 1)
            const t = texture(1e-1 * w + f * u, f * v, 1e-2 * w)
            return t > bayer4(x, y)
        }

        let pixels = create(width, height)

        this.resize = function resize(toWidth, toHeight) {
            if (toWidth === width && toHeight === height) return

            pixels = create(width = toWidth, height = toHeight)
        }

        this.render = function render() {
            const time = 9e-4 * Date.now()

            for (let y = 0; y < pixels.length; ++y) {
                const line = pixels[y]
                for (let x = 0; x < line.length; ++x) {
                    line[x] = 0
                }
            }

            for (let y = 0; y < height; ++y) {
                const v = 2 * y / height - 1
                for (let x = 0; x < width; ++x) {
                    const u = 2 * x / width - 1
                    if (globe(x, y, u, v, time))
                        set(pixels, x, y)
                }
            }

            return pixels
        }

        this.enc = enc // used in paintBraille
    }
}()
