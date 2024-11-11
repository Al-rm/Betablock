//////////// PATTERN GENERATION
function createGrid(rows, cols, spacing, object) {
  let array = [];
  for (let j = 1; j < rows+1; j++) {
      for (let i = 1; i < cols-1; i++) {
          let x = i * spacing;
          if (j % 2 == 0) {
              x += spacing;
          };
          let y = spacing + j * spacing/3;
          let o = object;
          object.x = x;
          object.y = y;
          array.push(o);
      }
  }
  return array;
};
function createVertices(n, width, height){
  angleMode(RADIANS)
  let middlePoint = {
      x: (width * .5),
      y: (height * .5)
  };
  let vertices = [];
    for (let p = 0; p < n; p++) {
      let angle = p * TWO_PI / n;
      let v = p5.Vector.fromAngle(angle);
      v.mult(height*.5);
      v.add(middlePoint.x, middlePoint.y);
      vertices.push(v);
  }
  return vertices;
}
function createChaosPoint(vertices, width, height) {
  let previous;
  let current = createVector(random(width), random(height));
  let next = random(vertices); 
  if (next !== previous) {
    current.x = lerp(current.x, next.x, .5);
    current.y = lerp(current.y, next.y, .5);
    previous = next;
  }
  return current;
}
function generateChaosPattern(vertices, qnt, width, height, options = {isExclusive: false, edgeProximity: .5}) {
  if (!vertices) {
    vertices = createVertices(3, width, height);
  };
  let points = [];
  let previous;
  let current = createVector(random(width), random(height));
  for (let i = 0; i < qnt; i++) {
      let next = random(vertices); 
      if (next !== previous) {
          current.x = lerp(current.x, next.x, options.edgeProximity);
          current.y = lerp(current.y, next.y, options.edgeProximity);
          points.push(current);
          previous = next;
      } else if (options.isExclusive){
          i--;
      }
  }
  return points;
}


//////////// MATHs & Physics
function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min)
};
function applyForce(force, body) {
  let f = force.copy();
  f.div(body.mass);
  body.acceleration.add(f);
}

//////////// COLLISIONS
function containerEdgeCollision(width, height, body){
  if (body.position.x > width - body.circleRadius) {
      body.position.x = height - body.circleRadius;
      body.velocity.x *= -1;
  } else if (body.position.x < body.circleRadius) {
      body.position.x = body.circleRadius;
      body.velocity.x *= -1;
  }
  if (body.position.y < body.circleRadius) {
      body.position.y = body.circleRadius;
      body.velocity.y *= -1; 
  }
};
function conservedEnergyCollision (bodyA, bodyB) {
  let impactVector = p5.Vector.sub(bodyB.position, bodyA.position);
  let d = impactVector.mag();
  if (d < bodyA.r + bodyB.r) {
      //get distance
      let overlap = d - (bodyA.r + bodyB.r)
      let dir = impactVector.copy();
      dir.setMag(overlap * 0.5);
      bodyA.position.add(dir);
      bodyB.position.sub(dir);
      //distance correction
      d = bodyA.r + bodyB.r;
      impactVector.setMag(d);
      //conserve energy formula
      let mSum = bodyA.mass + bodyB.mass;
      let vDiff = p5.Vector.sub(bodyB.velocity, bodyA.velocity);
      let num = vDiff.dot(impactVector);
      let den = mSum * d * d;
      //bodyA
      let deltaVA = impactVector.copy();
          deltaVA.mult(2 * bodyB.mass * num / den);
          bodyA.velocity.add(deltaVA);
      //bodyB
      let deltaVB = impactVector.copy();
          deltaVB.mult(-2 * this.mass * num / den);
          bodyB.velocity.add(deltaVB)
  }
};
/////////////// COLOR SETTINGS
function changeColor(color, level, increment, mod = "sustain") {
  //@mod: increase, decrease, sustain
  let cc = color;
  let iMin = 77;
  let iMax = 222;
  let sMin = 33;
  let sMax = 66;
  let diff = round((iMax - iMin)/increment);    //lvl(min || max) color(min-max);
  let newColor;
  if (mod == "increase") {
      newColor = ceil(iMin + diff*(level));
      return clamp(newColor, iMin, iMax);
  } else if (mod == "decrease") {
      newColor = ceil(iMax - diff*(level));
      return clamp(newColor, iMin, iMax)
  } else {
      diff = round((sMax - sMin)/increment);
      newColor = ceil(sMin + diff*(level));
      return clamp(newColor, sMin, sMax)
  }        
};
function updateColorByLevel(color, level, increment) {
  let currentR, currentG, currentB;
  currentR = color.r;
  currentG = color.g;
  currentB = color.b;
  let modularLvl = level%increment;
  if (modularLvl == 0) {
    modularLvl = 5;
  }
  let levelPower = ceil(level / increment);
  let r, g, b;
  switch (levelPower) {
    case 1:
      r = changeColor(currentR, modularLvl, increment, "increase");
      g = changeColor(currentG, modularLvl, increment);
      b = changeColor(currentB, modularLvl, increment);
      break;
    case 2:
      r = 222;
      g = changeColor(currentG, modularLvl, increment, "increase");
      b = changeColor(currentB, modularLvl, increment);
      break;
    case 3:
      r = changeColor(currentR, modularLvl, increment, "decrease");
      g = 222;
      b = changeColor(currentB, modularLvl, increment);
      break;
    case 4:
      r = changeColor(currentR, modularLvl, increment);
      g = 222;
      b = changeColor(currentB, modularLvl, increment, "increase");
      break;
    case 5:
      r = changeColor(currentR, modularLvl, increment);
      g = changeColor(currentG, modularLvl, increment, "decrease");
      b = 222;
      break;
    case 6:
      r = changeColor(currentR, modularLvl, increment, "increase");
      g = changeColor(currentG, modularLvl, increment);
      b = 222;
      break;
    case 7:
    case 8:
      r = 222;
      g = changeColor(currentG, modularLvl, increment,"increase");
      b = 222;
      break;
    case 9:
    case 10:
      r = 222;
      g = 222;
      b = 222;
      console.log("9, 10")
      break;    
    case 11:
    case 12:
    case 13:
      r = changeColor(currentR, modularLvl, increment, "decrease");
      g = changeColor(currentG, modularLvl, increment, "decrease");
      b = changeColor(currentB, modularLvl, increment, "decrease");
      console.log(modularLvl)
      break;
    default:
      r = 33;
      g = 33;
      b = 33;
      break;
  }
  let result = {
    r: r,
    g: g,
    b: b
  }
  return result;
};