let pad, walls, blocks = [], particles = [];
let test;
class Stages {
    constructor() {
        this.level = 1;
        this.levelIncrement = 50;
        this.type = "base" // "bonus", "rewards";
        let defaultColor = {r: 11, g: 11, b: 11};
        this.backgtoundColor = updateColorByLevel(defaultColor, this.level*10, this.levelIncrement)
    }
    createBall (color) {
        let newBall;
        if (color === undefined) {
          newBall = new Particle(random(screenRes[0]/2, screenRes[0]), random(300, screenRes[1]-100));  
        } else {
          newBall = new Particle(random(screenRes[0]/2, screenRes[0]), random(screenRes[1]), color);
        }
        particles.push(newBall);
        return newBall;
    };
    createBlockGrid(rows = 20, cols = 10, spacing = screenRes[0] / 10) {    // GRID
        let blockArray = [];
        for (let j = 1; j < rows+1; j++) {
            for (let i = 1; i < cols-1; i++) {
                let x = i * spacing;
                if (j % 2 == 0) {
                    x += spacing;
                };
                let y = spacing + j * spacing/3;
                let b = new Block(x, y);
                b.level += j+i-1
                b.density = b.level;
                b.update(b);
                blockArray.push(b);
            }
        }
        return blockArray;
    };
    generateChaosGamePattern(level) {
        angleMode(RADIANS)
        let blocks = [];
        let numBlocks = (level + 10) * 5;
        let spawnArea = [
            { x: screenRes[0] * 0.075, y: screenRes[1] * 0.325 },    //(0,1) ur
            { x: screenRes[0] * 0.075, y: screenRes[1] * 0.275 },   //(0.0) ul
            { x: screenRes[0] * 0.925, y: screenRes[1] * 0.325 },   //(1,0) dl
            { x: screenRes[0] * 0.925, y: screenRes[1] * 0.275 }     //(1,1) dr
        ];
        let middlePoint = {
            x: ((spawnArea[0].x + spawnArea[2].x) * .5),
            y: ((spawnArea[0].y + spawnArea[1].y) * .5)
        };
        console.log(middlePoint);
        test = middlePoint;
        let vertices, n, current, previous;
        vertices = [];
        n = floor(level%10) + 3;
        for (let p = 0; p < n; p++) {
            let angle = p * TWO_PI / n;
            let v = p5.Vector.fromAngle(angle);
            v.mult(screenRes[0]* .3);
            v.add(middlePoint.x, middlePoint.y);
            vertices.push(v);
        }
        current = createVector(random(screenRes[0]*.95), random(screenRes[1]*.95));
        for (let p of vertices) {
            let vBlock = new Block(p.x, p.y);
            blocks.push(vBlock);
        }
        for (let i = 0; i < numBlocks - vertices.length; i++) {
            let next = random(vertices); 
            if (next !== previous) {
                current.x = lerp(current.x, next.x+random(-screenRes[0]*.25,screenRes[0]*.25), .33);
                current.y = lerp(current.y, next.y+random(-screenRes[1]*.03,screenRes[1]*.03), .33);
                let block = new Block(current.x, current.y);
                blocks.push(block);
                previous = next;
            } else {
                i--;
            }
        }
        for (let b of blocks) {
            let blockLevelChance = random (100+level);
            let updateLvl = level;
            let rnd = random(1,5);
            if (blockLevelChance >= 99) {
                updateLvl += round(rnd);
            } else if (blockLevelChance >= 75) {
                updateLvl += round(random(3));
            } else if (blockLevelChance <= 10) {
                updateLvl -= round(rnd);
            } 
            if (updateLvl <= 0) {
                updateLvl = 1;
            }
            b.level = updateLvl;
            b.density = b.level;
            b.update(b);
        }
        return blocks;
    }
    createStage() {
        game.stageLevel += 1;
        if (pad == undefined) {
            pad = new Pad();
        }
        if (walls == undefined) {
            walls = new Walls();
        }
        let newBall = this.createBall({r: 166, g: 166, b:166});
        pad.isGrabbing = true;
        pad.grabBall(newBall);
        blocks = this.generateChaosGamePattern(this.level);
        // blocks = this.createBlockGrid(25, 10)
    }
    update() {
        if ((particles.length <= 0)) {
          game.state = "GameOver";
          game.saveScore(game.score);
          Composite.clear(game.engine.world);
        }
        if ((blocks.length <= 0)) {
            this.nextLevel();
        }
    }
    nextLevel() {
        this.level += 1;
        this.createStage( );
    };
    show() {
        background(this.backgtoundColor.r, this.backgtoundColor.g, this.backgtoundColor.b, 155)
        walls.show();
        pad.show(mouseX);
        for (let i = particles.length - 1; i >= 0; i--) {
          let particle = particles[i];
          particle.update();
          particle.show();
          particle.edges();
          particle.remove(particle, i);
          pad.grabBall(particle)
          pad.bounce(particle)
          for (let j = particles.length - 2; j >= 0; j--) {
            let particleB = particles[j];
            particle.colide(particleB);
          }
          for (let b = 0; b < blocks.length; b++) {
            let block = blocks[b];
            if (particle.distance(block) < particle.r) {
                block.getHit(block, b, particle);
            }
          }
        }
        for(let block of blocks) {
          block.show()
        }
        strokeWeight(3)
        // point(test.x, test.y, 10)
    }
}