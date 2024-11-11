var runner, composite, collision, delta;
var stage = {};
class GAME {
  constructor() {
    this.state = "MainMenu"; // Start, Running, Paused, GameOver, HighScore
    this.stageLevel = 0;
    this.score = 0;
    this.highScore = JSON.parse(localStorage.getItem('scores')) || [];
    this.currentTime = 0;
    this.engine = Engine.create();
  }
  newGame() {
    this.engine.positionIterations = 10;
    this.engine.velocityIterations = 6; 
    this.engine.constraintIterations = 2;
    this.engine.timing.timeScale = 0.5;
    composite = Composite.create(this.engine);
    this.engine.gravity.y = 0;
    composite.gravity.y = 0;
    composite.world.gravity.y = 0;
    runner = Runner.create({maxFrameTime: 1000 / 30});
    delta = 1 / frameRate();
    this.currentTime = 0;
    // Runner.run(runner, this.engine);
    stage = new Stages();
    this.score = 0
    this.highScore = JSON.parse(localStorage.getItem('scores')) || [];
    this.state = "Running";
    stage.createStage();
  }
  update() {

  }
  pause() {
      if (game.state == "Running"){
        this.state = "Paused";
      } else {
        this.state = "Running";
      }
    }
  saveScore(score) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    if (scores.length < 10) {
      scores.push(score);
    } else {
      let minScore = Math.min(...scores);
      if (score > minScore) {
        scores[scores.indexOf(minScore)] = score;
      };
    };
    scores.sort((a, b) => b - a);
    localStorage.setItem('scores', JSON.stringify(scores));
    // this.loadScores();
  };
  loadScores() {
      let scores = JSON.parse(localStorage.getItem('scores'));
      return scores;
  };
  clearScores() {
    localStorage.removeItem('scores');
  };

  show() {
    noCursor()
    cursor(cursorAim);
    delta = floor(1000 / frameRate());
    Engine.update(this.engine, delta);
    if (this.state == "Running") {
        this.currentTime += delta*.001;
    }
    stage.update();
    stage.show();
    textFont(fontText)
    push() // game header [blocks(?), stageLvl(?) time, score, ]
      fill(255)
      stroke(255)
      textSize(33)
      text(`Blocks: ${blocks.length}`, screenRes[0]*0.03, 33);
      text(`Time : ${Math.ceil(this.currentTime)}`, screenRes[0]*0.43, 33)
      text(`Score: ${game.score}`, screenRes[0]*0.77, 33)
      text(`${delta}`, 30, screenRes[1]*.9)
    pop()

    //debug 
  }
}