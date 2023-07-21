let t1;
let verbNum, conjNum, varNum;
let bigKegel;
let smallKegel;
let answer;
let bgcolor = "#000000";
let tip;
let prefix = [["je ", "j'"], ["tu "], ["il ", "elle ", "on "], ["nous "], ["vous "], ["ils ", "elles "]];
let vowels = ['a', 'à', 'â', 'æ', 'e', 'é', 'è', 'ê', 'ë', 'i', 'î', 'ï', 'o', 'ô', 'u', 'û', 'ù', 'ù', 'œ', 'h'];
let weird = [['i', 'î'], ['e', 'é', 'è', 'ê', 'ë'], ['a', 'à', 'â'], ['o', 'ô', 'ö'], ['u', 'ù', 'û', 'ü'], ['c', 'ç'], ['y', 'ÿ']];
function preload() {
  t1 = loadTable('assets/premierepresent.csv', 'csv', 'header');
}

function setup() {
  tip = false;
  createCanvas(windowWidth, windowHeight);
  bigKegel =  height/10;
  smallKegel = 0.35*bigKegel;
  next();
}

function next() {
  answer = "";
  verbNum = int(random(0, t1.getRowCount()));
  conjNum = int(random(1, 7));
  if (conjNum == 3 || conjNum == 6) {
    varNum = int(random(0, prefix[conjNum-1].length));
  } else if (conjNum == 1) {
    let firstLetter = t1.getString(verbNum, conjNum).charAt(0);
    if (vowels.includes(firstLetter)) {
      varNum = 1;
    } else {
      varNum = 0;
    }
  } else {
    varNum = 0;
  }
  if (t1.getString(verbNum, 8) == 1) {
    bgcolor = "#000000";
  } else {
    bgcolor = "#0000FF";
  }
  tip = false;
}


function draw() {
  background(bgcolor);
  fill(255);
  textAlign(CENTER);

  textSize(bigKegel);
  text(t1.getString(verbNum, 0), width/2, bigKegel);
  textSize(smallKegel);
  text("["+t1.getString(verbNum, 7)+"]", width/2, bigKegel + 1.25*smallKegel);
  textSize(bigKegel);
  text(prefix[conjNum-1][varNum] + answer, width/2, height/2);
  if (tip) {
    textSize(smallKegel);
    text(t1.getString(verbNum, 1)+"\n"+t1.getString(verbNum, 2)+"\n"+t1.getString(verbNum, 3)+"\n"+t1.getString(verbNum, 4)+"\n"+t1.getString(verbNum, 5)+"\n"+t1.getString(verbNum, 6), width/2, height - 7*smallKegel);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyTyped() {
  if (keyCode == BACKSPACE || keyCode == DELETE) {
    if (answer.length>0) {
      answer = answer.substring(0, answer.length-1);
    }
  } else if (keyCode == ENTER || keyCode == RETURN) {
    if (answer == t1.getString(verbNum, conjNum)) {
      next();
    }
  } else if (key == ' ') {
    tip = true;
  } else {
    answer = answer+key;
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    if (answer.length>0) {
      let lastSymbol = answer.charAt(answer.length-1);
      for (let i = 0; i < weird.length; i++) {

        for (let j = 0; j < weird[i].length; j++) {

          if (lastSymbol == weird[i][j]) {

            let n = constrain(j-1, 0, weird[i].length-1);
            answer = answer.substring(0, answer.length-1)+weird[i][n];
            j = weird[i].length;
            i = weird.length;
          }
        }
      }
    }
  } else if (keyCode === UP_ARROW) {
    if (answer.length>0) {
      let lastSymbol = answer.charAt(answer.length-1);
      for (let i = 0; i < weird.length; i++) {
        
        for (let j = 0; j < weird[i].length; j++) {
          
          if (lastSymbol == weird[i][j]) {
            
            let n = constrain(j+1, 0, weird[i].length-1);
            answer = answer.substring(0, answer.length-1)+weird[i][n];
            j = weird[i].length;
            i = weird.length;
          }
        }
      }
    }
  }
}
