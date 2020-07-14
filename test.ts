// 在此处添加您的代码
let playerSprite = sprites.create(img`
    . . . . . f f f f f f . . . . .
    . . . f f e e e e f 2 f . . . .
    . . f f e e e e f 2 2 2 f . . .
    . . f e e e f f e e e e f . . .
    . . f f f f e e 2 2 2 2 e f . .
    . . f e 2 2 2 f f f f e 2 f . .
    . f f f f f f f e e e f f f . .
    . f f e 4 4 e b f 4 4 e e f . .
    . f e e 4 d 4 1 f d d e f f . .
    . . f e e e 4 d d d d f d d f .
    . . . f f e e 4 e e e f b b f .
    . . . . f 2 2 2 4 d d e b b f .
    . . . . e 2 2 2 e d d e b f . .
    . . . . f 4 4 4 f e e f f . . .
    . . . . . f f f f f f . . . . .
    . . . . . . f f f . . . . . . .
`, SpriteKind.Player)
controller.player1.moveSprite(playerSprite)

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    attackEffect.laserAttack(playerSprite, attackEffect.LaserAttackDirection.RIGHT, 40, 1000, SpriteKind.Enemy, function (sprites: Sprite[]) {
        console.log(sprites.length)
        for (let sprite of sprites) {
            sprite.startEffect(effects.bubbles)
        }
    })
})

let enemySprite = sprites.create(img`
    . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . f f f f . . . . . . . . . .
    . . . . . . . . f f 1 1 1 1 f f . . . . . . . .
    . . . . . . . f b 1 1 1 1 1 1 b f . . . . . . .
    . . . . . . . f 1 1 1 1 1 1 1 d f . . . . . . .
    . . . . . . f d 1 1 1 1 1 1 1 d d f . . . . . .
    . . . . . . f d 1 1 1 1 1 1 d d d f . . . . . .
    . . . . . . f d 1 1 1 d d d d d d f . . . . . .
    . . . . . . f d 1 d f b d d d d b f . . . . . .
    . . . . . . f b d d f c d b b b c f . . . . . .
    . . . . . . . f 1 1 1 1 1 b b c f . . . . . . .
    . . . . . . . f 1 b 1 f f f f f . . . . . . . .
    . . . . . . . f b f c 1 1 1 b f . . . . . . . .
    . . . . . . . . f f 1 b 1 b f f . . . . . . . .
    . . . . . . . . . f b f b f f f . f . . . . . .
    . . . . . . . . . . f f f f f f f f . . . . . .
    . . . . . . . . . . . . f f f f f . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . .
`, SpriteKind.Enemy)