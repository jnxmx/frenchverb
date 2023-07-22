let t1;
let inp, preinp;
let verbNum, conjNum, varNum;
let bigKegel;
let smallKegel;
let inpWidth;
let answer;
let bgcolor = "#000000";
let tipcolor = bgcolor;
let tip;
let prefix = [
  ["je ", "j'"],
  ["tu "],
  ["il ", "elle ", "on "],
  ["nous "],
  ["vous "],
  ["ils ", "elles "],
];
let vowels = [
  "a",
  "à",
  "â",
  "æ",
  "e",
  "é",
  "è",
  "ê",
  "ë",
  "i",
  "î",
  "ï",
  "o",
  "ô",
  "u",
  "û",
  "ù",
  "ù",
  "œ",
  "h",
];
let weird = [
  ["i", "î"],
  ["e", "é", "è", "ê", "ë"],
  ["a", "à", "â"],
  ["o", "ô", "ö"],
  ["u", "ù", "û", "ü"],
  ["c", "ç"],
  ["y", "ÿ"],
];
function preload() {
  t1 = loadTable("assets/premierepresent.csv", "csv", "header");
}

function setup() {
  tip = false;
  createCanvas(windowWidth, windowHeight);
  bigKegel = height * 0.085;
  smallKegel = 0.35 * bigKegel;
  inpWidth = 0.5 * bigKegel;
  inp = createInput("");
  inp.input(inputTyped);
  inp.style("font-size", bigKegel + "px");
  inp.style("color", "#FFFFFF");
  inp.style("background-color", "rgba(0,0,0,0)");
  inp.style("outline", "rgba(0,0,0,0)");
  inp.style("border", "rgba(0,0,0,0)");
  inp.style("border-bottom", 0.05 * bigKegel + "px solid rgb(87,87,87)");
  inp.style("padding", "0");
  inp.style("margin", "0 0 0 0");
  inp.elt.setAttribute("type", "text");
  inp.changed(inputAnswer);
  inp.elt.focus();

  preinp = createInput("");
  preinp.style("font-size", bigKegel + "px");
  preinp.style("color", "rgb(255,255,255)");
  preinp.style("background-color", "rgba(0,0,0,0)");
  preinp.style("outline", "rgba(0,0,0,0)");
  preinp.style("border", "rgba(0,0,0,0)");
  preinp.style("padding", "0");
  preinp.style("margin", "0 0 0 0");
  preinp.elt.setAttribute("readonly", "true");

  next();
}

function next() {
  verbNum = int(random(0, t1.getRowCount()));
  conjNum = int(random(1, 7));
  if (conjNum == 3 || conjNum == 6) {
    varNum = int(random(0, prefix[conjNum - 1].length));
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
  if (t1.getString(verbNum, 8) == 0) {
    bgcolor = "#0000FF";
  } else {
    bgcolor = "#000000";
  }
  tipcolor = bgcolor;
  tip = false;

  preinp.value(prefix[conjNum - 1][varNum]);
  inp.value("");
  updatePosition();
  inp.size(inpWidth);
}

function draw() {
  if (!tip) {
    background(bgcolor);
  } else {
    tipcolor.toString();

    tipcolor = color(tipcolor);

    tipcolor = lerpColor(
      tipcolor,
      lerpColor(color(bgcolor), color("rgb(255,255,255)"), 0.75),
      0.005
    );
    background(tipcolor);
  }
  fill(255);
  textAlign(CENTER);

  textSize(bigKegel);
  text(t1.getString(verbNum, 0), width / 2, bigKegel);
  textSize(smallKegel);
  text(
    "[" + t1.getString(verbNum, 7) + "]",
    width / 2,
    bigKegel + 1.25 * smallKegel
  );
  textSize(bigKegel);
  textAlign(LEFT);
  //text(prefix[conjNum-1][varNum], width/2 -  0.5*textWidth(inp.value()+prefix[conjNum-1][varNum]), height/2);
  textAlign(CENTER);
  if (tip) {
    textSize(smallKegel);
    fill(bgcolor);
    textLeading(0.95 * smallKegel);
    text(
      t1.getString(verbNum, 1) +
        "\n" +
        t1.getString(verbNum, 2) +
        "\n" +
        t1.getString(verbNum, 3) +
        "\n" +
        t1.getString(verbNum, 4) +
        "\n" +
        t1.getString(verbNum, 5) +
        "\n" +
        t1.getString(verbNum, 6),
      width / 2,
      height - 7 * smallKegel
    );
  }
}

// function windowResized() {
//   clear();
//   resizeCanvas(windowWidth, windowHeight);
//   setup();
// }

function inputTyped() {
  inp.value(inp.value().toLowerCase());
  updatePosition();

  if (textWidth(inp.value()) > inpWidth) {
    inp.size(textWidth(inp.value()));
  } else {
    inp.size(inpWidth + 0.1 * bigKegel);
  }
}

function inputAnswer() {
  if (inp.value() == t1.getString(verbNum, conjNum)) {
    next();
  }
}

function updatePosition() {
  textSize(bigKegel);

  inp.position(
    width / 2 -
      0.5 * textWidth(inp.value()) +
      0.5 * textWidth(prefix[conjNum - 1][varNum]),
    height / 2 - bigKegel
  );

  preinp.position(
    width / 2 - 0.5 * textWidth(inp.value() + prefix[conjNum - 1][varNum]),
    height / 2 - bigKegel
  );
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    if (inp.value().length > 0) {
      let lastSymbol = inp.value().charAt(inp.value().length - 1);
      for (let i = 0; i < weird.length; i++) {
        for (let j = 0; j < weird[i].length; j++) {
          if (lastSymbol == weird[i][j]) {
            let n = constrain(j - 1, 0, weird[i].length - 1);
            inp.value(
              inp.value().substring(0, inp.value().length - 1) + weird[i][n]
            );
            j = weird[i].length;
            i = weird.length-1;
          }
        }
      }
    }
    
  } else if (keyCode === UP_ARROW) {
    if (inp.value().length > 0) {
      let lastSymbol = inp.value().charAt(inp.value().length - 1);
      for (let i = 0; i < weird.length; i++) {
        for (let j = 0; j < weird[i].length; j++) {
          if (lastSymbol == weird[i][j]) {
            let n = constrain(j + 1, 0, weird[i].length - 1);
            inp.value(
              inp.value().substring(0, inp.value().length - 1) + weird[i][n]
            );
            j = weird[i].length;
            i = weird.length-1;
          }
        }
      }
    }
    
  }
  

}

function touchStarted() {
  // Focus on the input element when the canvas is touched
  tip = true;
}

function touchEnded() {
  tipcolor = bgcolor;
  tip = false;
  inp.elt.focus();
}
