var balls =[];
class Ball {
    constructor(x, y, color) {
        this.position = createVector(x, y);
        this.velocity = createVector(-1,-1);
        this.velocity.mult(5);
        this.acceleration = createVector(0,0);
        this.mass = screenRes[0]*screenRes[1]/1000000*36;
        this.r = sqrt(this.mass) * 2;
        this.strength = 1;
        this.color = color || {r: random(255), g: random(255), b: random(255)}
        var options = {
            density: 1,
            friction: 0,
            restitution: 1,
            mass: this.mass,
            density: this.mass,
            collisionFilter: { category: 0x0001 }
        }
        this.body = Bodies.circle(x, y, this.r, options)
        this.body.label = "Ball";
    }
    addBodytoComposite(composite) {
        Composite.add(composite, this.body);
    }
    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(1);
        this.body.position = this.position.copy();
    }
    applyForce(force) {
        let f = force.copy();
        f.div(this.mass);
        this.acceleration.add(f);
    }
    edges(otherWidth, otherHeigth){
        if (this.position.x > otherWidth - this.r) {
            this.position.x = otherHeigth - this.r;
            this.velocity.x *= -1;
        } else if (this.position.x < this.r) {
            this.position.x = this.r;
            this.velocity.x *= -1;
        }
        if (this.position.y < this.r) { //top
            this.position.y = this.r;
            this.velocity.y *= -1; 
        }
    }
    colide (other) {
        // collide with other ball
        let impactVector = p5.Vector.sub(other.position, this.position);
        let d = impactVector.mag();
        if (d < this.r + other.r) {
            //get distance
            let overlap = d - (this.r + other.r)
            let dir = impactVector.copy();
            dir.setMag(overlap * 0.5);
            this.position.add(dir);
            other.position.sub(dir);
            //distance correction
            d = this.r + other.r;
            impactVector.setMag(d);
            //conserve energy law
            let mSum = this.mass + other.mass;
            let vDiff = p5.Vector.sub(other.velocity, this.velocity);
            let num = vDiff.dot(impactVector);
            let den = mSum * d * d;
            //bodyA
            let deltaVA = impactVector.copy();
                deltaVA.mult(2 * other.mass * num / den);
                this.velocity.add(deltaVA);
            //bodyB
            let deltaVB = impactVector.copy();
                deltaVB.mult(-2 * this.mass * num / den);
                other.velocity.add(deltaVB)
        }
    }
    remove(ball, index) {
        if (ball.position.y >= screenRes[1]*0.97 - ball.r) { //bottom
            Composite.remove(game.engine.world, balls[index].body)
            balls.splice(index, 1);
        }
    }

    distance(object) {
        let nearX = clamp(this.position.x, object.xmin, object.xmax);
        let nearY = clamp(this.position.y, object.ymin, object.ymax);
        let dis = ((nearX - this.position.x) ** 2 + (nearY - this.position.y) ** 2) ** 0.5;
        return dis
    }
    show(){
        // var angle = this.body.angle;
        push();
        rectMode(CENTER)
        colorMode(RGB)
        // translate(this.body.position.x, this.body.position.y, '300ms')
        strokeWeight(1.5)
        stroke(166,133,77)      //tier 1 (166,133,77)) || tier 2 (166,166,166) || tier 3 (222,177,111)
        fill(this.color.r,this.color.g, this.color.b)
        circle(this.position.x,this.position.y,this.r*2)
        fill(0)
        textFont("Arial")
        textAlign(CENTER, CENTER)
        textSize(13)
        text("⛦", this.position.x,this.position.y)
        pop();
    }


}