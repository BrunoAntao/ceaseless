// import { Physics, Entity, Projectile } from './Physics.js';
// import { Vec2 } from './Vec2.js';

// export class Player extends Entity {

//     constructor(scene, position = new Vec2()) {

//         let options = {

//             anchor: new Vec2(0.5, 0.5)

//         }

//         super(scene, 'test', position, options)

//         this.scale = new Vec2(2, 2);

//         this.fireRate = 100;
//         this.lastFire = 0;

//         this.velocity = 0.6;

//         this.bulletsPhysicsGroup = new Physics.Group();

//         this.anchor = options.anchor || this.anchor;
//         this.body = new Physics.Body.Rectangle(this.asset.image.width * this.scale.x, this.asset.image.height * this.scale.y, options);
//         this.body.manager = scene.Modules.Physics;
//         this.body.parent = scene.Modules.Physics;
//         this.body.owner = this;
//         this.body.moveTo(new Vec2(this.position.x - this.anchor.x * this.width,
//             this.position.y - this.anchor.y * this.height));

//         this.hp = 10;
//         this.lastDamage = 0;
//         this.iWindow = 500;

//     }

//     damage(damage) {

//         if (Date.now() - this.lastDamage > this.iWindow) {

//             this.hp -= damage;
//             this.lastDamage = Date.now();

//         }

//     }

//     move(vec = new Vec2()) {

//         let body = this.getBody();
//         body.velocity = Vec2.sum(body.velocity, vec);

//     }

//     update() {

//         if (this.hp < 1) {

//             this.remove();

//         }

//         super.update();

//         if (this.scene.Modules.InputHandler) {

//             if (this.scene.Modules.InputHandler.keys["w"]) {

//                 this.move(new Vec2(0, -this.velocity));

//             }

//             if (this.scene.Modules.InputHandler.keys["s"]) {

//                 this.move(new Vec2(0, this.velocity));

//             }

//             if (this.scene.Modules.InputHandler.keys["a"]) {

//                 this.move(new Vec2(-this.velocity, 0));

//             }

//             if (this.scene.Modules.InputHandler.keys["d"]) {

//                 this.move(new Vec2(this.velocity, 0));

//             }

//             if (this.scene.Modules.InputHandler.mouse.left) {

//                 if (Date.now() - this.lastFire > this.fireRate) {

//                     let projectile = new Projectile(
//                         this.scene,
//                         'test_projectile',
//                         Vec2.sum(this.position.clone(), new Vec2(0, 10)),
//                         this.position.angleBetween(
//                             new Vec2(
//                                 this.scene.Modules.InputHandler.mouse.x,
//                                 this.scene.Modules.InputHandler.mouse.y
//                             )
//                         )
//                     );

//                     projectile.scale = new Vec2(4, 4);

//                     this.bulletsPhysicsGroup.add(projectile.getBody());
//                     this.lastFire = Date.now();
//                 }
//             }

//         }

//     }

// }