let result, verbFrench, groupName, translation, tiplist;
let inp;
let verbNum, conjNum, varNum;
let bigKegel;
let smallKegel;
let answer;
let backgroundColor = "#4BC6DA";
let fontcolor = "#EFEFEF";
let backgroundColorLerp;
let tip;
let shortTable;
let fullTable;
let verbRow;
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
let conjugationText = [
  "indicative|present|first person singular",
  "indicative|present|second person singular",
  "indicative|present|third person singular",
  "indicative|present|first person plural",
  "indicative|present|second person plural",
  "indicative|present|third person plural",
];
let correctAnswer;

function preload() {
  fullTable = loadTable("assets/french-verb-conjugation.csv", "csv", "header");
  shortTable = loadTable("assets/mostpopular.csv", "csv", "header");
}

function setup() {
  setVariable("--background", backgroundColor);

  //create dom
  gradientBackgroundBox = createElement("div");
  verbFrench = createElement("div");
  translation = createElement("div");
  result = createElement("div");
  groupName = createElement("div");
  tiplist = createElement("div");
  //id
  gradientBackgroundBox.id("gradBox");
  result.id("result");
  verbFrench.id("verbFrench");
  translation.id("translation");
  tiplist.id("tip");
  groupName.id("group");
  //fake input
  inp = createInput("");
  inp.input(inputTyped);
  inp.changed(inputAnswer);
  inp.id("hiddenInput");
  inp.elt.setAttribute("type", "text");
  inp.elt.focus();

  noCanvas();
  setPosition();

  tip = false;

  next();
}

function next() {
  let reflexive = ["", "", "", "", "", ""];
  verbNum = int(random(0, shortTable.getRowCount()));
  let verb = shortTable.getString(verbNum, "verb");

  conjNum = int(random(0, 6));

  if (verb.substring(0, 2) == "s'") {
    reflexive = ["m'", "t'", "s'", "nous ", "vous ", "s'"];

    verb = verb.substring(2);
  } else if (verb.substring(0, 3) == "se ") {
    reflexive = ["me ", "te ", "se ", "nous ", "vous ", "se "];

    verb = verb.substring(3);
  }
  verbRow = fullTable.findRow(verb, "infinitive");

  //varNum:
  if (conjNum == 2 || conjNum == 5) {
    varNum = int(random(0, prefix[conjNum].length));
  } else if (conjNum == 0) {
    let firstLetter = verb.charAt(0);
    if (vowels.includes(firstLetter)) {
      varNum = 1;
    } else {
      varNum = 0;
    }
  } else {
    varNum = 0;
  }

  //falloir etc.
  if (verbRow.getString(conjugationText[0]) == "") {
    conjNum = 2;
    varNum = 0;
  }

  backgroundColorLerp = backgroundColor;

  inp.value("");
  answer = inp.value();
  result.html(prefix[conjNum][varNum] + answer);
  verbFrench.html(shortTable.getString(verbNum, "verb"));
  translation.html("[" + shortTable.getString(verbNum, "russian") + "]");

  correctAnswer =
    reflexive[conjNum] + verbRow.getString(conjugationText[conjNum]);
  tiplist.html(
    reflexive[0] +
      verbRow.getString(conjugationText[0]) +
      "<br/>" +
      reflexive[1] +
      verbRow.getString(conjugationText[1]) +
      "<br/>" +
      reflexive[2] +
      verbRow.getString(conjugationText[2]) +
      "<br/>" +
      reflexive[3] +
      verbRow.getString(conjugationText[3]) +
      "<br/>" +
      reflexive[4] +
      verbRow.getString(conjugationText[4]) +
      "<br/>" +
      reflexive[5] +
      verbRow.getString(conjugationText[5])
  );

  groupName.html("(" + "...)");
}

function windowResized() {
  setPosition();
}

function draw() {
  //update background color
  colorMode(HSB, 1200);
  backgroundColor = color(
    (hue(backgroundColor) + 2.1 * sin(radians(frameCount))) % 1200,
    saturation(backgroundColor),
    brightness(backgroundColor)
  );
  colorMode(RGB, 255);
  backgroundColorLerp = lerpColor(
    color(backgroundColorLerp),
    color(backgroundColor),
    0.1
  );
  setVariable("--background", backgroundColorLerp);
}

function touchStarted() {
  setVariable("--opacityLevel", lookUpValue("gradBox", "opacity"));
  tiplist.style(
    "animation",
    "fly-in 0.4s forwards 0.1s cubic-bezier(0.18,1,0.74,1)"
  );
  result.style("animation", "blur-in 0.5s forwards  ");
  verbFrench.style("animation", "blur-in 0.5s forwards   ");
  groupName.style("animation", "blur-in 0.5s forwards  ");
  translation.style("animation", "blur-in 0.5s forwards   ");
  gradientBackgroundBox.style("animation", "fade-in 0.8s forwards ease-out");
  inp.elt.blur();
}

function touchEnded() {
  setVariable("--opacityLevel", lookUpValue("gradBox", "opacity"));

  let tipPos = float(lookUpValue("tip", "left"));
  if (tipPos >= windowWidth * 0.45) {
    tiplist.style("animation", "fly-out 0.35s forwards");
  } else {
    setVariable("--tipPosition", lookUpValue("tip", "left"));
    setVariable("--tipOpacity", lookUpValue("tip", "opacity"));
    tiplist.style("animation", "fly-back 0.35s");
  }
  let bLev = float(splitTokens(lookUpValue("result", "text-shadow"), "px ")[5]);

  setVariable("--blurLevel", bLev + "px");
  result.style("animation", "blur-out 0.5s ease-in");
  verbFrench.style("animation", "blur-out 0.5s ease-in");
  groupName.style("animation", "blur-out 0.5s ease-in");
  translation.style("animation", "blur-out 0.5s ease-in");
  gradientBackgroundBox.style("animation", "fade-out 0.4s ease-in");
  inp.elt.focus();
}

function setPosition() {
  //select("body").style("background", backgroundColor);
  if (windowWidth * 0.1 > windowHeight * 0.085) {
    bigKegel = windowHeight * 0.085;
  } else {
    bigKegel = windowWidth * 0.1;
  }
  setVariable("--bigKegel", bigKegel + "px");
}

function setVariable(variable, val) {
  document.documentElement.style.setProperty(variable, val);
}

function getVariable(variable) {
  window.getComputedStyle(document.documentElement).getPropertyValue(variable);
}

function lookUpValue(elm, atr) {
  let z = window
    .getComputedStyle(document.getElementById(elm))
    .getPropertyValue(atr);
  return z;
}

function inputTyped() {
  inp.value(inp.value().toLowerCase());
  answer = inp.value();
  result.html(prefix[conjNum][varNum] + answer);
}

function inputAnswer() {
  if (answer == correctAnswer) {
    next();
  } else {
    gradientBackgroundBox.style("animation", "shake 0.35s");
  }
}

function keyPressed() {
  setCaretPosition("hiddenInput", inp.value().length);
  let weird = [
    ["i", "î"],
    ["e", "é", "è", "ê", "ë"],
    ["a", "à", "â"],
    ["o", "ô", "ö"],
    ["u", "ù", "û", "ü"],
    ["c", "ç"],
    ["y", "ÿ"],
  ];
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
            i = weird.length - 1;
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
            i = weird.length - 1;
          }
        }
      }
    }
  }
  inputTyped();
}

function setCaretPosition(elemId, caretPos) {
  var el = document.getElementById(elemId);
  if (el !== null) {
    if (el.createTextRange) {
      var range = el.createTextRange();
      range.move("character", caretPos);
      range.select();
      return true;
    } else {
      if (el.selectionStart || el.selectionStart === 0) {
        el.focus();
        el.setSelectionRange(caretPos, caretPos);
        return true;
      } else {
        el.focus();
        return false;
      }
    }
  }
}
