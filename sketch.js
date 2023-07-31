const synth = window.speechSynthesis;
let theVoice;

let result, verbFrench, groupName, translation, tiplist, contentBox, menubutton, menu;
let menucontrol;
let inp;
let verbNum, conjNum, varNum;
let answer;
let backgroundColor = "#4BC6DA";
let fontcolor = "#F0F0D2";
let backgroundColorLerp;
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
let irregularGroupsSource;
let irregularGroups = [[]];
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
  setVariable("--background", backgroundColor);
  fullTable = loadTable("assets/french-verb-conjugation.csv", "csv", "header");
  shortTable = loadTable("assets/willdudziak147.csv", "csv", "header");
  irregularGroupsSource = loadStrings("assets/irregulargrouping.txt");
}

function setup() {
  setVoice();

  //set groups
  let index = 0;
  let subindex = 0;
  irregularGroups[0] = [];
  for (let i = 0; i < irregularGroupsSource.length; i++) {
    if (irregularGroupsSource[i] != "") {
      irregularGroups[index][subindex] = irregularGroupsSource[i];
      subindex++;
    } else {
      index++;
      irregularGroups[index] = [];
      subindex = 0;
    }
  }
  
  if ("virtualKeyboard" in navigator) {
    navigator.virtualKeyboard.overlaysContent = true;
  }
  
  //create dom
  setVariable("--fontColor", fontcolor);
  contentBox = createElement("div");
  gradientBackgroundBox = createElement("div");
  verbFrench = createElement("div");
  translation = createElement("div");
  result = createElement("div");
  groupName = createElement("div");
  tiplist = createElement("div");

  //id
  contentBox.id("contentBox");
  contentBox.touchStarted(showTip);
  contentBox.touchEnded(hideTip);
  contentBox.mousePressed(showTip);
  contentBox.mouseReleased(hideTip);
  gradientBackgroundBox.id("gradBox");
  gradientBackgroundBox.parent(contentBox);
  result.id("result");
  result.parent(contentBox);
  verbFrench.id("verbFrench");
  verbFrench.parent(contentBox);
  translation.id("translation");
  translation.parent(contentBox);
  tiplist.id("tip");
  tiplist.parent(contentBox);
  groupName.id("group");
  groupName.parent(contentBox);

  //menu
  menucontrol = createInput();
  menucontrol.attribute('type', 'checkbox');
  // menucontrol.attribute('checked', true);
  menucontrol.id("menubutton");
  menucontrol.changed(toggleMenu);
  menubutton = createElement('label', '≡');
  menubutton.attribute('for', "menubutton");
  menu = createElement("div");
  menu.class("menu");

  //input
  inp = createInput("");
  inp.id("hiddenInput");
  inp.elt.autocomplete = 'off';
  inp.elt.autocorrect= 'off';
  inp.elt.autocapitalize= 'off';
  inp.elt.spellcheck= 'off';
  inp.elt.setAttribute("type", "text");
  inp.elt.focus();
  //onkeypress
  inp.elt.addEventListener("input", (event) => {
    result.style("animation", "");
    const inputValue = event.target.value.toLowerCase();
    answer = inputValue;
    result.html(prefix[conjNum][varNum] + answer);
  });
  //onsend
  inp.elt.addEventListener("keyup", (event) => {
    event.preventDefault();
    setCaretPosition("hiddenInput", inp.value().length);
    if (event.keyCode == ENTER) {
      if (answer == correctAnswer) {
        speak(prefix[conjNum][varNum] + answer);
        correctAnimation();
      } else {
        result.style("animation", "0s ease 0s 1 normal none running none ");
        lookUpValue("result", "animation");
        result.style(
          "animation",
          "0.25s ease-out 0s 1 normal none running shake"
        );
      }
    }
    addAccentsWithUpDown(event.keyCode);
  });

  // inp.elt.addEventListener("keydown", (event) => {
  //   if (event.keyCode == LEFT_ARROW) {
  //     showTip();
  //   }
  // });

  noCanvas();

  createNext();
}

function createNext() {
  result.style(
    "animation",
    "1.6s ease-out 0s 1 normal forwards running resultIn"
  );
  verbFrench.style(
    "animation",
    "0.5s ease-in 0s 1 normal forwards running newVerb"
  );
  translation.style(
    "animation",
    "1.5s ease-in 0s 1 normal none running newGroup"
  );

  let reflexive = ["", "", "", "", "", ""];
  verbNum = int(random(0, shortTable.getRowCount()));
  let verb = shortTable.getString(verbNum, "verb");

  conjNum = int(random(0, 6));
  console.log(verb);
  if (verb.substring(0, 2) == "s'") {
    reflexive = ["m'", "t'", "s'", "nous ", "vous ", "s'"];

    verb = verb.substring(2);
  } else if (verb.substring(0, 3) == "se ") {
    reflexive = ["me ", "te ", "se ", "nous ", "vous ", "se "];

    verb = verb.substring(3);
  }

  verbRow = fullTable.findRow(verb, "infinitive");
  if (!verbRow) {
    shortTable.removeRow(verbNum);
    createNext();
  }
  speak(verb);
  //varNum:
  if (conjNum == 2 || conjNum == 5) {
    varNum = int(random(0, prefix[conjNum].length));
  } else if (conjNum == 0) {
    let firstLetter = verbRow.getString(conjugationText[0]).charAt(0);
    if (vowels.includes(firstLetter)) {
      varNum = 1;
    } else {
      varNum = 0;
    }
  } else {
    varNum = 0;
  }

  //falloir etc.
  if (verbRow.getString(conjugationText[0]).length < 1) {
    conjNum = 2;
    varNum = 0;
  }

  //group search
  groupName.style("animation", "");
  for (let i = 0; i < irregularGroups.length; i++) {
    if (irregularGroups[i].includes(verb)) {
      if (irregularGroups[i].length > 1) {
        groupName.html(join(irregularGroups[i], ", "));
      } else {
        groupName.html("!");
      }
      i = irregularGroups.length;
      if (groupName.elt.clientWidth > windowWidth) {
        groupName.html(", " + groupName.html() + ", " + groupName.html());
        setVariable("--scrollLength", groupName.elt.clientWidth + "px");
        setVariable(
          "--animationTime",
          (20 * groupName.elt.clientWidth) / windowWidth + "s"
        );
        groupName.style(
          "animation",
          "leftScroll var(--animationTime) linear 0s infinite"
        );
      }
    } else if (verb.endsWith("er")) {
      groupName.html("I");
    } else if (verb.endsWith("ir") || verb.endsWith("ïr")) {
      groupName.html("II");
    } else {
      groupName.html("?");
    }
  }
  groupName.style(
    "animation",
    lookUpValue("group", "animation") +
      ", " +
      "1.5s ease-in 0s 1 normal none running newGroup"
  );

  backgroundColorLerp = backgroundColor;

  inp.value("");
  answer = inp.value();
  result.html(prefix[conjNum][varNum] + answer);
  verbFrench.html(shortTable.getString(verbNum, "verb"));
  translation.html("[" + shortTable.getString(verbNum, "russian") + "]");

  correctAnswer =
    reflexive[conjNum] +
    splitTokens(verbRow.getString(conjugationText[conjNum]), ";")[0];
  tiplist.html(
    "<p>" +
      reflexive[0] +
      splitTokens(verbRow.getString(conjugationText[0]), ";")[0] +
      "</p><p>" +
      reflexive[1] +
      splitTokens(verbRow.getString(conjugationText[1]), ";")[0] +
      "</p><p>" +
      reflexive[2] +
      splitTokens(verbRow.getString(conjugationText[2]), ";")[0] +
      "</p><p>" +
      reflexive[3] +
      splitTokens(verbRow.getString(conjugationText[3]), ";")[0] +
      "</p><p>" +
      reflexive[4] +
      splitTokens(verbRow.getString(conjugationText[4]), ";")[0] +
      "</p><p>" +
      reflexive[5] +
      splitTokens(verbRow.getString(conjugationText[5]), ";")[0] +
      "</p>"
  );

  if (verbRow.getString(conjugationText[0]).length < 1) {
    tiplist.html(
      "<p>il " +
        splitTokens(verbRow.getString(conjugationText[2]), ";")[0] +
        "</p>"
    );
  }
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
  //waiting for next
  if (
    float(lookUpValue("verbFrench", "margin-top")) <
    -7.5 * float(lookUpValue("verbFrench", "font-size"))
  ) {
    createNext();
  }
}

function correctAnimation() {
  result.style(
    "animation",
    "1.45s linear 0s 1 normal forwards running resultOut"
  );
  verbFrench.style(
    "animation",
    "1.95s ease-in 0.05s 1 normal forwards running flyUp"
  );
  translation.style(
    "animation",
    "1.95s ease-in 0.1s 1 normal forwards running flyUp"
  );
  groupName.style(
    "animation",
    lookUpValue("group", "animation") +
      ", " +
      "1.95s ease-in 0.0s 1 normal forwards running flyUp"
  );
}

function showTip() {
  setVariable("--opacityLevel", lookUpValue("gradBox", "opacity"));
  tiplist.style(
    "animation",
    "fly-in 0.4s forwards 0.1s cubic-bezier(0.18,1,0.74,1)"
  );
  result.style("animation", "blur-in 0.5s forwards  ");
  verbFrench.style("animation", "blur-in 0.5s forwards   ");

  groupName.style(
    "animation",
    splitTokens(lookUpValue("group", "animation"), ",")[0] +
      ", group-blur-in 0.5s forwards"
  );

  translation.style("animation", "blur-in 0.5s forwards   ");
  gradientBackgroundBox.style("animation", "fade-in 0.8s forwards ease-out");
  inp.elt.blur();
  menubutton.class("fade");
}

function hideTip() {
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
  groupName.style(
    "animation",
    splitTokens(lookUpValue("group", "animation"), ",")[0] +
      ", group-blur-out 0.5s ease-in"
  );

  translation.style("animation", "blur-out 0.5s ease-in");
  gradientBackgroundBox.style("animation", "fade-out 0.4s ease-in");

  inp.elt.focus();
  menubutton.class("unfade");
}

//structure

function setVariable(variable, val) {
  document.documentElement.style.setProperty(variable, val);
}

function getVariable(variable) {
  let z = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(variable);
  return z;
  //getComputedStyle(document.documentElement).getPropertyValue(variable);
}

function lookUpValue(elm, atr) {
  let z = window
    .getComputedStyle(document.getElementById(elm))
    .getPropertyValue(atr);
  return z;
}

//input fixes

function addAccentsWithUpDown(code) {
  let weird = [
    ["i", "î"],
    ["e", "é", "è", "ê", "ë"],
    ["a", "à", "â"],
    ["o", "ô", "ö"],
    ["u", "ù", "û", "ü"],
    ["c", "ç"],
    ["y", "ÿ"],
  ];
  if (code == 40) {
    if (inp.value().length > 0) {
      let lastSymbol = inp.value().charAt(inp.value().length - 1);
      for (let i = 0; i < weird.length; i++) {
        for (let j = 0; j < weird[i].length; j++) {
          if (lastSymbol == weird[i][j]) {
            let n = constrain(j - 1, 0, weird[i].length - 1);
            inp.value(
              inp.value().substring(0, inp.value().length - 1) + weird[i][n]
            );
            answer = inp.value();
            result.html(prefix[conjNum][varNum] + answer);
            j = weird[i].length;
            i = weird.length - 1;
          }
        }
      }
    }
  } else if (code == 38) {
    if (inp.value().length > 0) {
      let lastSymbol = inp.value().charAt(inp.value().length - 1);
      for (let i = 0; i < weird.length; i++) {
        for (let j = 0; j < weird[i].length; j++) {
          if (lastSymbol == weird[i][j]) {
            let n = constrain(j + 1, 0, weird[i].length - 1);
            inp.value(
              inp.value().substring(0, inp.value().length - 1) + weird[i][n]
            );
            answer = inp.value();
            result.html(prefix[conjNum][varNum] + answer);
            j = weird[i].length;
            i = weird.length - 1;
          }
        }
      }
    }
  }
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

//sound

function speak(message) {
  if (synth.speaking) {
    //console.error("speechSynthesis.speaking");
    return;
  }
  if (message !== "") {
    const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.voice = theVoice;
    utterThis.lang = "fr_FR";
    utterThis.volume = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
  }
}

function setVoice() {
  window.speechSynthesis.getVoices();
  let voices = synth.getVoices().filter(function (voice) {
    return voice.lang.includes("FR");
  });

  if (
    voices.filter(function (voice) {
      return voice.name.startsWith("Microsoft Denise");
    })[0]
  ) {
    theVoice = voices.filter(function (voice) {
      return voice.name.startsWith("Microsoft");
    })[0];
  } else if (
    voices.filter(function (voice) {
      return voice.name.startsWith("Google");
    })[0]
  ) {
    theVoice = voices.filter(function (voice) {
      return voice.name.startsWith("Google");
    })[0];
  } else if (
    voices.filter(function (voice) {
      return voice.name.startsWith("Thomas");
    })[0]
  ) {
    theVoice = voices.filter(function (voice) {
      return voice.name.startsWith("Thomas");
    })[0];
  } else {
    console.log(
      voices.filter(function (voice) {
        return voice.lang.startsWith("fr-FR");
      })
    );
    theVoice = voices.filter(function (voice) {
      return voice.lang.startsWith("fr-FR");
    })[0];
  }
}

function toggleMenu() {
  if (this.elt.checked) {
        // Code to execute when the checkbox is checked (true)
        console.log("Checkbox is checked (ON)");
    inp.elt.blur();
      } else {
        // Code to execute when the checkbox is unchecked (false)
        console.log("Checkbox is unchecked (OFF)");
        createNext();
      }
}
