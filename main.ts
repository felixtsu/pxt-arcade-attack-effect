// % weight=100 color=#6699CC icon="\u2593"
// block="SpecialAttack" % groups='["Attack"]'
namespace attackEffect {

    export enum LaserAttackDirection {
        RIGHT,
        LEFT,
        UP,
        DOWN
    }

    const COLOR_INNER = 1
    const COLOR_OUTER = 2

    class LaserAttackCallback {
        spriteKind: number
        callback: (sprite: Sprite) => void
        constructor(spriteKind: number, callback: (sprite: Sprite) => void) {
            this.spriteKind = spriteKind;
            this.callback = callback
        }
    }

    class LaserAttackChecker {
        private left: number
        private right: number
        private top: number
        private bottom: number

        private sprite: Sprite
        private width: number
        private direction: LaserAttackDirection

        private active: boolean

        private overlapCheckerImage: Image
        private overlapCheckerImageCenterX: number
        private overlapCheckerImageCenterY: number

        private onHitCallbacks: LaserAttackCallback[]

        private hitSprites :Sprite[]

        define(sprite: Sprite, width: number, direction: LaserAttackDirection) {
            this.active = true
            this.sprite = sprite
            this.width = width
            this.direction = direction

            // reset hit sprites every time
            this.hitSprites = []
        }

        resetOverlapChecker() {
            let result = null;
            if (this.direction == LaserAttackDirection.RIGHT) {
                this.left = this.sprite.x
                this.right = 180
                this.top = this.sprite.y - this.width / 2
                this.bottom = this.sprite.y + this.width / 2

                result = image.create(this.right - this.left, this.bottom - this.top)


            }
            result.fill(1)
            this.overlapCheckerImage = result
            this.overlapCheckerImageCenterX = (this.right + this.left) / 2
            this.overlapCheckerImageCenterY = (this.top + this.bottom) / 2
        }

        checkOverlap(candidate: Sprite) {
            if (this.direction == LaserAttackDirection.RIGHT) {
                if (candidate.x < this.left) {
                    return false;
                } else {
                    return this.top < candidate.y && candidate.y < this.bottom
                }
            }
            return false;
        }


        constructor() {
            this.onHitCallbacks = []
            this._init()
        }


        registerOnHitCallbacks(spriteKind: number, onHitCallback: (sprite: Sprite) => void) {
            this.onHitCallbacks.push(new LaserAttackCallback(spriteKind, onHitCallback))
        }

        stop() {
            this.active = false;
        }


        onUpdateListener() {
            if (!this.active) {
                return;
            }

            let attackSprites: Sprite[] = []

            this.resetOverlapChecker()

            for (let callback of this.onHitCallbacks) {
                for (let candidate of sprites.allOfKind(callback.spriteKind)) {
                    if (this.hitSprites.find((value:Sprite) => value === candidate)) {
                        continue
                    }

                    if (candidate.flags & (sprites.Flag.Ghost | sprites.Flag.RelativeToCamera)) {
                        continue
                    }

                    if (this.checkOverlap(candidate)) {
                        this.hitSprites.push(candidate)
                        control.runInParallel(function () {
                            callback.callback(candidate)
                        })
                    }
                }
                
            }


        }


        _init() {
            game.onUpdate(() => {
                this.onUpdateListener()
            })
        }

    }

    class LaserAttackAnimation {
        private static laserAttackAnimationBgImage: Image
        private direction: LaserAttackDirection
        private x: number
        private y: number
        private width: number
        private active: boolean
        private sprite: Sprite


        constructor() {
            this._init()
        }


        define(sprite: Sprite, width: number, direction: LaserAttackDirection) {
            this.sprite = sprite
            this.width = width
            this.direction = direction
            this.active = true
        }

        stopAnimation() {
            this.active = false;
            this.clearEffect()
        }


        public static _init = (() => {
            if (!LaserAttackAnimation.laserAttackAnimationBgImage) {
                LaserAttackAnimation.laserAttackAnimationBgImage = image.create(160, 120)
            }
            return true;
        })()

        clearEffect() {
            LaserAttackAnimation.laserAttackAnimationBgImage.fill(0)
        }

        _init() {
            game.onPaint(() => {
                this.onPaintListener()
            })
        }

        draw() {
            this.clearEffect()

            LaserAttackAnimation.laserAttackAnimationBgImage.fillCircle(this.x, this.y, this.width, COLOR_OUTER)
            switch (this.direction) {
                case LaserAttackDirection.RIGHT:
                    LaserAttackAnimation.laserAttackAnimationBgImage.fillRect(this.x, this.y - this.width / 2, 160 - this.x, this.width, COLOR_OUTER)
                    LaserAttackAnimation.laserAttackAnimationBgImage.fillRect(this.x, this.y - this.width / 4, 160 - this.x, this.width / 2, COLOR_INNER)
            }
            LaserAttackAnimation.laserAttackAnimationBgImage.fillCircle(this.x, this.y, this.width / 2, COLOR_INNER)
            screen.drawTransparentImage(LaserAttackAnimation.laserAttackAnimationBgImage, 0, 0)
        }

        onPaintListener() {
            if (this.active) {
                this.x = this.sprite.x
                this.y = this.sprite.y
                this.draw()
            }
        }
    }

    let checker = new LaserAttackChecker()
    let laserAttackAnimation = new LaserAttackAnimation()
    let laserAttackCallbacks: LaserAttackCallback[] = []

    //% blockId=launch_laser_attack
    //% block="launch laser attack from %sprite=variables_get(mySprite) to %direction=direction by %width for %duration=timePicker|ms"
     //% width.defl=40 duration.defl=1000 direction.defl= LaserAttackDirection.RIGHT
    //% group="Attack"
    export function laserAttack(sprite: Sprite, direction: LaserAttackDirection,
        width: number, duration: number) {

        checker.define(sprite, width, direction)
        laserAttackAnimation.define(sprite, width, direction)

        control.runInParallel(function () {
            pause(duration)
            checker.stop()
            laserAttackAnimation.stopAnimation()
        })
    }



    //% blockId=on_laser_hit
    //% group="Attack"
    //% block="on laser hits of %spriteKind=spritekind"
    //% draggableParameters="sprite"
    export function onLaserHit(spriteKind: number, spriteHitCallback: (sprite: Sprite) => void) {
        checker.registerOnHitCallbacks(spriteKind, spriteHitCallback)
    }

}
