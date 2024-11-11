function Walls() {
    let options = {
        isStatic:true,
        friction: 0,
        restitution: 0,
        collisionFilter: { category: 0x0001}
    }
    this.bottom = Bodies.rectangle(0, screenRes[1]*.97, screenRes[0]*2, screenRes[1]*.03, options);
    this.left = Bodies.rectangle(0,0,screenRes[1]*.01, screenRes[1]*2, options);
    this.top = Bodies.rectangle(0,0,screenRes[0]*2, screenRes[1]*.01, options);
    this.right = Bodies.rectangle(screenRes[0], 0, screenRes[1]*.01, screenRes[1]*2, options);
    this.bottom.label = "Bottom";
    this.left.label = "Wall";
    this.top.label = "Wall";
    this.right.label = "Wall";
    Composite.add(game.engine.world, [this.bottom, this.left, this.right, this.top]);
    // World.add(world, [this.bottom, this.left, this.right, this.top])

    this.show = function () {
        push();
        rectMode(CENTER)
            noStroke();
            fill(0);
            rect(0, screenRes[1]*.97, screenRes[0]*2, screenRes[1]*.03)               //bottom
            fill(111)
            rect(0,0,screenRes[1]*.01, screenRes[1]*2)                                //left
            rect(0,0,screenRes[0]*2, screenRes[1]*.01)                                //top
            rect(screenRes[0], 0, screenRes[1]*.01, screenRes[1]*2)  //right

        pop();
    }
}