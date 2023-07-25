let v = [];
let result, verbFrench, translation, tiplist;
let shake,
  displace = 0.0,
  angle = 0.0;
let inp;
let verbNum, conjNum, varNum;
let bigKegel;
let smallKegel;
let answer;
let backgroundColor = "#4B63DA";
let fontcolor = "#EFEFEF";
let tipBackground = "#FFFFFF";
let backgroundColorLerp;
let tip;
let groupName;
let fileName = ["3.csv"];
let sourceTable = [];
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


//let grpbox = [];


function preload() {
  for (let i = 0; i < fileName.length; i++) {
    sourceTable[i] = loadTable("assets/" + fileName[i], "csv", "header");
    
  }
}

class Verb {
  constructor(verbRow) {
    let conjugationText = [ 
  "je","tu","il/elle/on","nous","vous","ils/elles"
]
    this.infinitive = verbRow.getString("verb");
    this.present = [];
    this.present[0] = verbRow.getString(conjugationText[0]);
    this.present[1] = verbRow.getString(conjugationText[1]);
    this.present[2] = verbRow.getString(conjugationText[2]);
    this.present[3] = verbRow.getString(conjugationText[3]);
    this.present[4] = verbRow.getString(conjugationText[4]);
    console.log(this.present);
    this.present[5] = verbRow.getString(conjugationText[5]);
    this.russian = verbRow.getString("russian");
    this.group = "";
  }
  setGroupName(verbExamples) {
    this.group = verbExamples;
  }
}

function setup() {
  //table
  for (let j = 0; j < sourceTable.length; j++) {    
  for (let i = 0; i < sourceTable[j].getColumnCount(); i++) {
    if (sourceTable[j].columns[i]!="russian") {
    //sourceTable[j].removeTokens(" ", i);
    }
  }
    let groupString=sourceTable[j].getRow(0).getString(0)+", "+sourceTable[j].getRow(1).getString(0)+", "+sourceTable[j].getRow(2).getString(0);
    for (let i = 0; i < sourceTable[j].getRowCount(); i++) {
      r = sourceTable[j].getRow(i);
      if(r.getString(0)!="-") {
      v[v.length] = new Verb(r);
      v[v.length-1].setGroupName(groupString);
      } else {
        groupString = ""
        for(let l = i+1; l<min(i+4,sourceTable[j].getRowCount()); l++) {
          
          if(sourceTable[j].getRow(l).getString(0)!="-") {
            if(l>i+1) {
            groupString+=", "
          }
          groupString+=sourceTable[j].getRow(l).getString(0);
          } else {
            l = i+4;
          }
        }
        
      }
    }
  }
  
  
  
  //create dom
  gradbox = createElement("div");
  verbFrench = createElement("div");
translation = createElement("div");
  result = createElement("div");
  tiplist = createElement("div");
  groupName = createElement("div");
  
  
  gradbox.id("gradBox");
  result.id('result');
  verbFrench.id('verbFrench'); 
  translation.id('translation'); 
  tiplist.id('tip');
  groupName.id('group');
  
  
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

//   for (let i = 0; i < 4; i++) {
//     grpbox[i] = createCheckbox(groupeName[i], false);

//         //grpbox[i].style("display", "none");
//     grpbox[i].class("groupBox");
//     grpbox[i].style("font-size", smallKegel + "px");
//     grpbox[i].style("color", fontcolor);
//     grpbox[i].position(
//       width / 2 + (i - 2) * 6 * smallKegel,
//       min(height, width) - 2 * smallKegel
//     );


//     grpbox[i].changed(changeGroup);
//     grpbox[i].checked(true);
//   }

  next();
}

function next() {
  verbNum = int(random(0, v.length));
  conjNum = int(random(0, 6));
  if (conjNum == 2 || conjNum == 5) {
    varNum = int(random(0, prefix[conjNum].length));
  } else if (conjNum == 0) {
    let firstLetter = v[verbNum].present[conjNum].charAt(0);
    if (vowels.includes(firstLetter)) {
      varNum = 1;
    } else {
      varNum = 0;
    }
  } else {
    varNum = 0;
  }
  // if (localTable.getString(verbNum, 8) == 0) {
  //   backgroundColor = "#0000FF";
  // } else {
  //   backgroundColor = "#000000";
  // }
  backgroundColorLerp = backgroundColor;
  tiplist.style("color",backgroundColor)
  tip = false;
  inp.value("");
  answer = inp.value();
  result.html(prefix[conjNum][varNum] + answer);
  verbFrench.html(v[verbNum].infinitive);
  translation.html("[" + v[verbNum].russian + "]");
  tiplist.html(v[verbNum].present[0] +
        "\n" +
        v[verbNum].present[1] +
        "\n" +
        v[verbNum].present[2] +
        "\n" +
        v[verbNum].present[3] +
        "\n" +
        v[verbNum].present[4] +
        "\n" +
        v[verbNum].present[5]);
  if(v[verbNum].group.length>0) {
  groupName.html("("+v[verbNum].group+"...)");
  }
}

function draw() {
  if (shake > 0) {
    displace = shake * sin(radians(shake));
    angle = radians(
      lerp((15 * shake * sin(radians(3 * shake))) / bigKegel, 0, 0.1)
    );
    shake = lerp(shake, 0, 0.1);
  }
  result.position(windowWidth*0.5+displace,result.position().y);
  
  if (!tip) {
    if(backgroundColorLerp!=backgroundColor) {
    backgroundColorLerp =  lerpColor(color(backgroundColorLerp), color(backgroundColor), 0.1);
    select("body").style("background",backgroundColorString(backgroundColorLerp));
        gradbox.style("background-image", "linear-gradient("+
    backgroundColorLerp+" 0%,"+
    lerpColor(color(backgroundColor),color(fontcolor),0.9)+" 100%)");
  
    }
    //result.show();
    tiplist.hide();
  } else {
    backgroundColorLerp =  lerpColor(color(backgroundColorLerp), lerpColor(color(backgroundColor),color(fontcolor),0.9), 0.1);
    select("body").style("background",backgroundColorString( backgroundColorLerp));
    gradbox.style("background-image", "linear-gradient("+
    backgroundColorLerp+" 0%,"+
    lerpColor(color(backgroundColor),color(fontcolor),0.9)+" 100%)");
    //result.hide();
    tiplist.show();
  }
}

function backgroundColorString(col) {
  return "rgb(" + red(col) + ", " + green(col) + ", " + blue(col) + ")";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setPosition();
}

function inputTyped() {
  inp.value(inp.value().toLowerCase());
  answer = inp.value();
  result.html(prefix[conjNum][varNum] + answer);        
}



function inputAnswer() {

  if (answer == v[verbNum].present[conjNum]) {
    next();
  } else {
    shake = bigKegel;
  }
}

function keyPressed() {
  setCaretPosition('hiddenInput', inp.value().length);
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
                range.move('character', caretPos);
                range.select();
                return true;
            }
            
            else {
                if (el.selectionStart || el.selectionStart === 0) {
                    el.focus();
                    el.setSelectionRange(caretPos, caretPos);
                    return true;
                }
                
                else  { // fail city, fortunately this never happens (as far as I've tested) :)
                    el.focus();
                    return false;
                }
            }
        }
    }

function touchStarted() {
  tip = true;
}

function touchEnded() {
  tip = false;
  inp.elt.focus();
}

function setPosition() {
  select("body").style("background",backgroundColor);
  
  gradbox.style("background-image", "linear-gradient("+
    backgroundColor+" 0%,"+
    lerpColor(color(backgroundColor),color(fontcolor),0.9)+" 100%)"
  );
  if(windowWidth * 0.1>windowHeight * 0.085) {
    bigKegel = windowHeight * 0.085;
    smallKegel = 0.45 * bigKegel;
    result.style("top", "50%");
    tiplist.style("top",windowHeight*0.5+ "px");
    groupName.style("bottom", smallKegel+ "px");
    gradbox.style("height",2*smallKegel+ "px");
  } else {
    bigKegel = windowWidth * 0.1;
    smallKegel = 0.45 * bigKegel;
    result.style("top", windowHeight*0.3+ "px");
    tiplist.style("top",windowHeight*0.3+ "px");
    groupName.style("bottom", windowHeight*0.5-bigKegel+ "px");
    gradbox.style("height",windowHeight*0.5-bigKegel+ "px");
  }
  
  
  result.style("font-size", bigKegel + "px");
  result.style("color", fontcolor);
  
  verbFrench.style("font-size", bigKegel + "px");
  verbFrench.style("color", fontcolor);
  verbFrench.style("top",bigKegel+"px");    

  translation.style("font-size", smallKegel + "px");
  translation.style("color", fontcolor);
  translation.style("top",float(bigKegel+1.75*smallKegel)+"px");
  
  tiplist.style("font-size", smallKegel + "px");
  tiplist.style("color", backgroundColor);
  
  tiplist.style("left", "50%")
  tiplist.hide();
  
  
  groupName.style("font-size", smallKegel + "px");
  groupName.style("color", fontcolor);
  groupName.style("left", "50%")
}

