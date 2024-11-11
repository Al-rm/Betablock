class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = Math.ceil(screenRes[1]*0.03);
        this.mass = 10;
        this.level = 1;
        this.levelIncrement = 5;
        this.density = this.level;
        this.dropChance = random(this.level, 1000);
        this.color = {
            r: 77,
            g: 33,
            b: 33
        }
        let options = {
            isStatic: true,
            collisionFilter: { category: 0x0001 }
        }
        this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, options);
        this.body.label = "Block"
        Composite.add(game.engine.world, this.body);
        this.xmin = this.x - this.width * .5;
        this.xmax = this.x + this.width * .5;
        this.ymin = this. y - this.height * 0.5;
        this.ymax = this.y + this.height * 0.5;
    };
    getHit(block, index, ball) {
        let check = 0;
        let xmin, xmax, ymin, ymax, bx, by, br;
        xmin = block.xmin;
        xmax = block.xmax;
        ymin = block.ymin;
        ymax = block.ymax;
        bx = ball.position.x;
        by = ball.position.y;
        br = ball.r;
        if ((bx >= xmin) && (bx <= xmax)) {
            if ((by - br <= ymax && by - br >= ymin) || 
                (by + br >= ymin && by + br <= ymax)) {
                ball.velocity.y *= -1;
                check = 1
            }
        };
        if ((by >= ymin) && (by <= ymax)) {
            if ((bx - br <= xmax && bx - br >= xmin) || 
                (bx + br >= xmin && bx + br <= xmax)) {
                ball.velocity.x *= -1;
                check = 2
            }
        };
        if (check == 0 ) {
            if (xmin-bx > ymin-by) {
                ball.velocity.x = 3.5;
                ball.velocity.y *= -1;
            } else {
                ball.velocity.x = -3.5;
                ball.velocity.y *= -1;
            } if (xmax-bx > ymax - by) {
                ball.velocity.x *= -1;
            } else {
                ball.velocity.x *= -1;
            }
        }
            //remove block
        block.density -= ball.strength;
        block.update(block)
        if (block.density <= 0) {
            Composite.remove(game.engine.world, block.body);
            blocks.splice(index, 1)
            game.score += block.level;
        }
    }
    update(block) {
        let currentColor = block.color;
        block.color = updateColorByLevel(currentColor, block.density, block.levelIncrement)
    }
    show() {
        push();
        rectMode(CENTER);
            textAlign(CENTER, CENTER);
            stroke(clamp(this.color.r+66, 0, 255), clamp(this.color.g+66, 0, 255), clamp(this.color.b+66, 0, 255));
            strokeWeight(this.mass/4);
            fill(this.color.r,this.color.g,this.color.b);
            rect(this.x, this.y, this.width, this.height, 3);
            fill(0)
            text(`${this.density}`, this.x, this.y)
        pop();
    }
}