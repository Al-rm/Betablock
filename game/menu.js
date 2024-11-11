class MENU {
    constructor() {
        this.title = {
            x: screenRes[0]*0.5,
            y:  screenRes[1]*0.21
        }
        this.buttons = [
            { label: "New Game", x: screenRes[0] * 0.5, y: screenRes[1] * 0.55, w: screenRes[0] * 0.33, h: screenRes[1] * 0.07, hover: false, clicked: false },
            { label: "HighScore", x: screenRes[0] * 0.5, y: screenRes[1] * 0.65, w: screenRes[0] * 0.33, h: screenRes[1] * 0.07, hover: false, clicked: false },
            { label: "Options", x: screenRes[0] * 0.5, y: screenRes[1] * 0.75, w: screenRes[0] * 0.33, h: screenRes[1] * 0.07, hover: false, clicked: false },
            { label: "Quit", x: screenRes[0] * 0.5, y: screenRes[1] * 0.85, w: screenRes[0] * 0.33, h: screenRes[1] * 0.07, hover: false, clicked: false }
        ];
    }
    options() {
        //game options [resolution, sounds, confineMouse, clear HighScore, ]
    }
    checkHover() {
        for (let button of this.buttons) {
            if (mouseX > button.x - button.w / 2 && mouseX < button.x + button.w / 2 &&
                mouseY > button.y - button.h / 2 && mouseY < button.y + button.h / 2) {
                button.hover = true;
            } else {
                button.hover = false;
            }
        }
    }
    checkClick() {
        for (let button of this.buttons) {
            if (button.hover) {
                button.clicked = true;
                this.buttonAction(button.label);
            } else {
                button.clicked = false;
            }
        }
    }
    buttonAction(label) {
            if (label === "New Game") {
                if (composite) { Composite.clear(composite) };
                game.newGame();
            } else if (label === "Resume") {
                game.pause();
            } else if (label === "HighScore") {
                game.highScore = game.loadScores();
                game.state = "HighScore";
            } else if (label === "Options") {
                game.clearScores();
                console.log("Abrindo opções..."); // game.state = "Options"
            } else if (label === "Back") {
                game.state = "MainMenu"
            } else if (label === "Quit") {
                window.close()
                // location.reload(); // reload page
            }
    }
    buttonShow(button) {
        push()
        textFont(fontText);
        rectMode(CENTER);
        textAlign(CENTER, CENTER)
            textSize(30);
            if (button.hover) {
                translate(0, -1)
                fill(177, 99, 177);
                strokeWeight(3);
                stroke(55,0,55);
                textSize(33);
                cursor('pointer')
            } else {
                translate(0,0);
                fill(69, 33, 69); // Cor normal
            }
            rect(button.x, button.y, button.w, button.h);
            fill(255);
            strokeWeight(1);
            text(`${button.label}`, button.x , button.y)
        pop();
    }
    show() {
        cursor("default");
        if (game.state === "MainMenu") {
            background(133,77,133,99)
        } else {
            background(222,222,222,3)
            
        }
        push() // TITLE
        let title = "BetaBlock"
            textFont(fontTitle);
            textAlign(CENTER)
            textSize(99);
            text(`${title}`, this.title.x*.99, this.title.y*1.01);
            fill(222,177,211);
            text(`${title}`, this.title.x*1.01, this.title.y*.99);
            fill(177,99,177);
            text(`${title}`, this.title.x, this.title.y);
            line(0, this.title.y*1.03,screenRes[0],this.title.y*1.03)
            strokeWeight(9)
            stroke(133, 77, 133)
            line(0, this.title.y-this.title.y*.36,screenRes[0],this.title.y-this.title.y*.36)
        pop()
        if(game.state === "Paused") {
            this.buttons[0].label = "Resume"
            push()
                textAlign(CENTER, CENTER)
                strokeWeight(22)
                stroke(222,222,222,111)
                stroke(222,111,111)
                fill(222,111,111)
                strokeWeight(4);
                textSize(111);
                fill(111,11,11)
                text("Paused", screenRes[0]*.5, screenRes[1]*.33)
            pop()
            // console.log(game)
        }
        if(game.state === "GameOver") {
            this.buttons[0].label = "New Game";
            push()
                textAlign(CENTER, CENTER)
                strokeWeight(22)
                stroke(222,222,222,111)
                strokeWeight(4);
                textSize(111);
                fill(111,11,11)
                text("Game Over", screenRes[0]*.5, screenRes[1]*.33);
                textSize(33);
                fill(222,222,222);
                strokeWeight(2);
                stroke(0);
                text(`High Score: ${game.score}`, screenRes[0]*.5, screenRes[1]*.45)
            pop()
        }
        if (game.state === "HighScore") {
            background(133,77,133,222);
            push();
            textAlign(CENTER, CENTER);
            strokeWeight(1)
            stroke(255,111);
            textSize(36);
            text("HighScore", screenRes[0] * .5, 166);
            line(0, 196, screenRes[0], 196);
            if ((game.highScore == undefined) ) {
                game.highScore = game.loadScores();
            } else {
                for (let i = 0; i < game.highScore.length; i++) {
                    text(`${i+1} _______ ${game.highScore[i]}`, screenRes[0]* .5, 222 + i * 30);
                }
            };
            pop();
        }
        if(game.state === "HighScore") {
            this.buttons[3].label = "Back";
            this.buttonShow(this.buttons[3])
        } else {
            this.buttons[3].label = "Quit";
            for ( let b = 0; b < this.buttons.length; b++) {
                let btn = this.buttons[b]
                this.buttonShow(btn)
            }
        }
        this.checkHover();
    }
}