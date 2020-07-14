//% weight=100 color=#6699CC icon="\uf140" block="SpecialAttack"
//% groups='["attack"]'
namespace attackEffect {

    export enum LaserAttackDirection {
        RIGHT,
        LEFT,
        UP,
        DOWN
    }

    const COLOR_WHITE = 1
    const COLOR_RED = 2

    function spriteInRange(candidate: Sprite, x: number, y: number, direction: LaserAttackDirection, width: number) {

    }

    class LaserAttackChecker {

        private left: number
        private right: number
        private top: number
        private bottom: number


        private spriteKind: number
        private sprite: Sprite
        private width: number
        private spriteDamageCallback: (sprites: Sprite[]) => void
        private direction: LaserAttackDirection

        private active: boolean

        define(sprite: Sprite, width: number, direction: LaserAttackDirection, spriteKind: number, spriteDamageCallback: (sprites: Sprite[]) => void) {
            this.active = true
            this.sprite = sprite
            this.width = width
            this.direction = direction
            this.spriteKind = spriteKind
            this.spriteDamageCallback = spriteDamageCallback

        }

        createCheckerImage():Image {
            let result = null;
            if (this.direction == LaserAttackDirection.RIGHT) {
                this.left = this.sprite.x
                this.right = 120
                this.top = this.sprite.y - this.width / 2
                this.bottom = this.sprite.y + this.width / 2

                result = image.create(this.right - this.left, this.bottom - this.top) 
                

            }
            result.fill(1)
            return result
        }

        
        constructor() {
            this._init()
        }

        stop() {
            this.active = false;
        }


        onUpdateListener() {
            if (!this.active) {
                return;
            }

            let attackSprites: Sprite[] = []

            let checkerImage = this.createCheckerImage()

            for (let candidate of sprites.allOfKind(this.spriteKind)) {
                if (candidate.flags & (sprites.Flag.Ghost | sprites.Flag.RelativeToCamera)) {
                    continue
                }

                if (candidate.image.overlapsWith(checkerImage, candidate.x - this.sprite.x, candidate.y - this.sprite.y + this.width / 2)) {
                    attackSprites.push(candidate)
                }
            }
            this.spriteDamageCallback(attackSprites)
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
                scene.addBackgroundLayer(LaserAttackAnimation.laserAttackAnimationBgImage, 100, BackgroundAlignment.Left)
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

            LaserAttackAnimation.laserAttackAnimationBgImage.fillCircle(this.x, this.y, this.width, COLOR_RED)
            switch (this.direction) {
                case LaserAttackDirection.RIGHT:
                    LaserAttackAnimation.laserAttackAnimationBgImage.fillRect(this.x, this.y - this.width / 2, 160 - this.x, this.width, COLOR_RED)
                    LaserAttackAnimation.laserAttackAnimationBgImage.fillRect(this.x, this.y - this.width / 4, 160 - this.x, this.width / 2, COLOR_WHITE)
            }
            LaserAttackAnimation.laserAttackAnimationBgImage.fillCircle(this.x, this.y, this.width / 2, COLOR_WHITE)
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

    //%block
    export function laserAttack(sprite: Sprite, direction: LaserAttackDirection,
        width: number, duration: number,
        spriteKind: number, spriteDamageCallback: (sprites: Sprite[]) => void) {

        checker.define(sprite, width, direction, spriteKind, spriteDamageCallback)
        laserAttackAnimation.define(sprite, width, direction)

        control.runInParallel(function () {
            pause(duration)
            checker.stop()
            laserAttackAnimation.stopAnimation()
        })
    }

}
