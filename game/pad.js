class Pad {
    constructor() {
        this.x = screenRes[0]*.5;
        this.y = screenRes[1]*.95666;
        this.width = screenRes[0]*.2;
        this.height = screenRes[0]*.0233;
        this.border = this.width*.03;
        this.force = createVector(0,0);
        this.isGrabbing = true;
        this.isAiming = true;
        this.ballSlot = {x: this.x, y: this.y-this.height}
        let options = {
            // mass: 1000,
            // density: 1000,
            restitution: 1,
            friction: 0,
            collisonFilter: { category: 0x0001}
        }
        // this.plataform = Bodies.rectangle(x, this.y - this.height*0.5, this.width, this.height*0.5)
        this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, options);
        this.body.circleRadius = this.border;
        this.body.label = "Pad";
        Composite.add(game.engine.world, this.body);
        this.xmin = this.x - this.width * .5;
        this.xmax = this.x + this.width * .5;
        this.ymin = this. y - this.height * 0.5;
        this.ymax = this.y + this.height * 0.5;

    }
    update(x){
        let cp = this.width/2;
        if (x<=cp) {
            x = cp;               
        } else if (x >= screenRes[0] - cp){
            x = screenRes[0]-cp;
        }
        //update pad position and size
        this.x = x;
        // this.width = size;
        this.body.position.x = x;
        this.xmin = this.x - this.width * .5;
        this.xmax = this.x + this.width * .5;
        this.ballSlot.x = x;
    }
    bounce(ball) {
        if ((ball.position.y >= this.y - this.height) && (ball.position.x >= this.xmin) && (ball.position.x <= this.xmax)) {
            ball.velocity.y = 5;
            ball.velocity.y *= -1;
            if ((Math.floor(ball.position.x) == Math.floor(this.xmin)) || Math.ceil(ball.position.x) == Math.ceil(this.xmax)) {
                ball.velocity.x *= 2;
            }
        }
    }
    grabBall(ball) {
        if (this.isGrabbing) {
            ball.position.x = this.ballSlot.x + ball.r/2;
            ball.position.y = this.ballSlot.y;
        }
    }
    releaseBall(ball, x) {
        let vx = map(x, 0, screenRes[0], -5, 5);
        // let vy = map(y, screenRes[1],0, -5, 5);
        this.isGrabbing = false;
        ball.velocity.x = vx;
        ball.velocity.y = -5;
        if (this.isAiming) {
            this.aim()
        }
    }
    aim() {
        if (!this.isAiming) {
            this.isAiming = true;
        } else {
            this.isAiming = false;
        }
    }
    show(x){
        rectMode(CENTER);
        if (this.isAiming) {
            if(this.isGrabbing) {
                push()
                stroke(255);
                strokeWeight(2);
                line(this.ballSlot.x, this.ballSlot.y-7, mouseX, mouseY);
                pop();
            }
        } else {
            this.update(x)
        } 
        push();
            strokeWeight(this.border/2);
            ellipseMode(CENTER);
            rectMode(CENTER)
            rect(this.x, this.y, this.width, this.height, this.border);
            stroke(222);
            fill(0,0);
            if (this.isGrabbing) {
                arc(this.ballSlot.x, this.ballSlot.y, this.width, this.height*2, PI, 0);
            }
        pop();

    }
}