document.addEventListener('DOMContentLoaded', (event) => {

    let scene = new Scene({

        backgroundColor: "rgba(33, 33, 33, 1)",

        // drawBodies: true

    });

    scene.useModule(new InputHandler().module());

    let player = new Player(scene, new Vec2(64, 64));
    // let enemy = new Entity(scene, new Vec2(128, 64));

    // Physics.Detector(scene, [player.bulletsPhysicsGroup, enemy], () => {

    //     enemy.remove();

    // })

    // Physics.Detector(scene, [player, enemy], () => {

    //     enemy.remove();

    // })

    scene.update = () => {

        // if (Physics.collides(newBody1, newBody2).length > 0) {

        //     sprite2.position.x++;

        // }

    }

});