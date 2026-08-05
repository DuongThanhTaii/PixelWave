"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvasService = void 0;
const prisma_1 = require("../lib/prisma");
class CanvasService {
    pixels = new Map();
    dirtyPixels = new Map();
    currentVersion = 0n;
    isFlushing = false;
    FLUSH_INTERVAL_MS = 5000;
    constructor() {
        // Start flush interval
        setInterval(() => this.flush(), this.FLUSH_INTERVAL_MS);
    }
    // Load initial state from DB
    async init() {
        console.log('Loading canvas state from database...');
        const allPixels = await prisma_1.prisma.pixel.findMany();
        let maxVersion = 0n;
        for (const p of allPixels) {
            this.pixels.set(`${p.x},${p.y}`, {
                x: p.x,
                y: p.y,
                color: p.color,
                fandomId: p.fandomId,
                userId: p.userId,
                placedAt: p.placedAt,
                version: p.version
            });
            if (p.version > maxVersion) {
                maxVersion = p.version;
            }
        }
        this.currentVersion = maxVersion;
        console.log(`Loaded ${this.pixels.size} pixels. Current Version: ${this.currentVersion}`);
    }
    // Get current state
    getAllPixels() {
        return Array.from(this.pixels.values());
    }
    getVersion() {
        return this.currentVersion.toString();
    }
    // Place a pixel
    placePixel(data) {
        this.currentVersion += 1n;
        const newPixel = {
            ...data,
            placedAt: new Date(),
            version: this.currentVersion
        };
        const key = `${data.x},${data.y}`;
        // Update memory cache
        this.pixels.set(key, newPixel);
        // Add to dirty set for next flush
        this.dirtyPixels.set(key, newPixel);
        return newPixel;
    }
    // Flush to database
    async flush() {
        if (this.isFlushing || this.dirtyPixels.size === 0)
            return;
        this.isFlushing = true;
        // Copy the dirty pixels and clear the map
        const toFlush = Array.from(this.dirtyPixels.values());
        this.dirtyPixels.clear();
        try {
            console.log(`Flushing ${toFlush.length} pixels to database...`);
            // Use a transaction for bulk upsert
            await prisma_1.prisma.$transaction(toFlush.map(pixel => prisma_1.prisma.pixel.upsert({
                where: {
                    x_y: {
                        x: pixel.x,
                        y: pixel.y
                    }
                },
                update: {
                    color: pixel.color,
                    fandomId: pixel.fandomId,
                    userId: pixel.userId,
                    version: pixel.version,
                    placedAt: pixel.placedAt,
                    overriddenAt: new Date(), // For history tracking logic later
                },
                create: {
                    x: pixel.x,
                    y: pixel.y,
                    color: pixel.color,
                    fandomId: pixel.fandomId,
                    userId: pixel.userId,
                    version: pixel.version,
                    placedAt: pixel.placedAt
                }
            })));
        }
        catch (error) {
            console.error('Error flushing pixels to database:', error);
            // Restore failed pixels to dirty map (simple retry mechanism)
            for (const pixel of toFlush) {
                const key = `${pixel.x},${pixel.y}`;
                if (!this.dirtyPixels.has(key)) {
                    this.dirtyPixels.set(key, pixel);
                }
            }
        }
        finally {
            this.isFlushing = false;
        }
    }
}
exports.canvasService = new CanvasService();
