const synth = window.speechSynthesis;
let theVoice;
let lang, dict;
let result,
  verbFrench,
  groupName,
  translation,
  tiplist,
  contentBox,
  menubutton,
  menu;

let mode, muteSpeech, passe;
let menucontrol;
let inp;
let verbNum = "0",
  conjNum,
  varNum;
let answer;
let backgroundColor = "#4BC6DA";
let fontcolor = "#F0F0D2";
let backgroundColorLerp;
let shortTable;
let fullTable;
let listFileName = [
  "assets/willdudziak147.csv",
  "assets/willdudziak681.csv",
  "assets/50verbs.csv",
];
let listName = [
  "147 by Will Dudziak",
  "681 by Will Dudziak",
  "50 most popular",
];
let verbRow;
let prefix = [
  ["je ", "j'"],
  ["tu "],
  ["il ", "elle ", "on "],
  ["nous "],
  ["vous "],
  ["ils ", "elles "],
  ["il a ", "il est "],
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
  "past participle",
];
let etreVerbs = [
  "naître",
  "mourir",
  "monter",
  "descendre",
  "aller",
  "venir",
  "partir",
  "arriver",
  "retourner",
  "rester",
  "entrer",
  "sortir",
  "tomber",
  "devenir",
];
let correctAnswer;

function preload() {
  setVariable("--background", backgroundColor);
  fullTable = loadTable("assets/french-verb-conjugation.csv", "csv", "header");
  shortTable = loadTable(listFileName[0], "csv", "header");
  irregularGroupsSource = loadStrings("assets/irregulargrouping.txt");
}
function windowResized() {
  setBigKegel();
}
window.speechSynthesis.onvoiceschanged = function() {
  console.log(":)");
    setVoice();
};
function setup() {
  

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

  //create dom
  setBigKegel();
  lv = createElement("div");
  lv.id("layoutViewport");
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
  menucontrol.attribute("type", "checkbox");
  // menucontrol.attribute('checked', true);
  menucontrol.id("menubutton");
  menucontrol.changed(toggleMenu);
  menubutton = createElement("label", "");
  menubutton.html("☰");
  menubutton.style("top", lookUpValue("contentBox", "height"));
  menubutton.attribute("for", "menubutton");
  menu = createElement("div");
  menu.class("menu");

  //name
  let newP = createElement("p");
  newP.parent(menu);
  newP.id("verba");
  newP.html("Verbose");
  //description
  newP = createElement("p");
  newP.parent(menu);
  newP.html(
    "I made this webapp as a personal aid for learning French conjugations. Tap and hold for the conjugations list, adjust vowel accents with desktop arrow buttons."
  );
  //translation
  newP.class("double");
  let pTrans1 = createElement("p");
  pTrans1.parent(menu);
  pTrans1.html("Translation language:");
  let pTrans2 = createElement("p");
  pTrans2.parent(menu);
  pTrans2.class("radio-wrapper");
  lang = createRadio("Language");
  lang.option("russian", "russian");
  lang.option("english", "english");
  lang.selected("english");
  lang.parent(pTrans2);

  //dict
  let pVerb1 = createElement("p");
  pVerb1.parent(menu);
  pVerb1.html("Verb list:");
  let pVerb2 = createElement("p");
  pVerb2.parent(menu);
  pVerb1.class("radio-wrapper");
  let dict = createRadio("Dictionary");
  dict.changed(changeList);
  for (let i = 0; i < listFileName.length; i++) {
    dict.option(listFileName[i], listName[i]);
  }
  dict.selected(listFileName[0]);
  dict.parent(pVerb2);
  //mode
  let pMode1 = createElement("p");
  pMode1.parent(menu);
  pMode1.html("Optional:");
  let pMode2 = createElement("p");
  pMode2.parent(menu);
  passe = createCheckbox("add past participle form", false);
  passe.parent(pMode2);
  mode = createCheckbox("show translation only", false);
  mode.parent(pMode2);
  muteSpeech = createCheckbox("mute speech", false);
  muteSpeech.parent(pMode2);
  pVerb1 = createElement("p");
  pVerb1.parent(menu);
  pVerb1.class("double");

  pVerb1.html(
    "Coding and design by Ivan Yakushev. Tested on Chrome & Safari only."
  );
  pVerb1.style("align-self", "end");
  //input
  inp = createInput("");
  inp.id("hiddenInput");
  inp.elt.autocomplete = "off";
  inp.elt.autocorrect = "off";
  inp.elt.autocapitalize = "off";
  inp.elt.spellcheck = "off";
  inp.elt.setAttribute("type", "text");
  inp.elt.focus();
  //onkeypress
  inp.elt.addEventListener("input", (event) => {
    const inputValue = event.target.value.toLowerCase();
    answer = inputValue;
    result.html(prefix[conjNum][varNum] + answer);
  });
  //onsend
  inp.elt.addEventListener("keyup", (event) => {
    event.preventDefault();
    setCaretPosition("hiddenInput", inp.value().length);
    if (event.keyCode == ENTER) {
      if (answer == correctAnswer || answer == correctAnswer + " ") {
        speak(prefix[conjNum][varNum] + answer);
        correctAnimation();
      } else {
        findMistake();
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

  addEventListener(
    "animationend",
    function (e) {
      if (e.animationName == "resultOut") createNext();
    },
    false
  );

  noCanvas();

  createNext();
}

function createNext() {
  //choode verb
  verbNum = int(random(0, shortTable.getRowCount()));
  let verb = shortTable.getString(verbNum, "verb");
  let reflexive;
  let past = false,
    refl = false;
  if (!passe.checked()) {
    conjNum = int(random(0, 6));
  } else {
    conjNum = int(random(0, 7));
  }
  console.log(verb);
  //cut reflexive
  if (verb.substring(0, 2) == "s'") {
    refl = true;
    reflexive = ["m'", "t'", "s'", "nous ", "vous ", "s'", "s'"];
    verb = verb.substring(2);
  } else if (verb.substring(0, 3) == "se ") {
    refl = true;
    reflexive = ["me ", "te ", "se ", "nous ", "vous ", "se ", "se "];
    verb = verb.substring(3);
  } else {
    refl = false;
    reflexive = ["", "", "", "", "", "", "", ""];
  }
  //find conjugation
  verbRow = fullTable.findRow(verb, "infinitive");

  //fix errors:
  if (!verbRow) {
    console.log("no verb " + verb + " in table");
    for (let i = 0; i < verb.length; i++) {
      verbRow = fullTable.findRow(verb.substring(i), "infinitive");
      if (verbRow) {
        verb = verb.substring(i);
        console.log("changed to " + verb);
        i = verb.length;
      }
    }
  }
  if (!verbRow) {
    console.log("deleting");
    shortTable.removeRow(verbNum);
    createNext();
  }

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
  } else if (conjNum == 6) {
    for (let etreVerb of etreVerbs) {
      if (
        (verb.endsWith(etreVerb) &&
          verbRow.getString("compound verb") != "avoir") ||
        refl
      ) {
        varNum = 1;
        break;
      } else {
        varNum = 0;
      }
    }
  } else {
    varNum = 0;
  }

  //falloir etc.
  let impersonal = false;
  if (verbRow.getString(conjugationText[0]).length < 1 || verb == "advenir") {
    impersonal = true;
    if (conjNum != 6) {
      conjNum = 2;
      varNum = 0;
    }
  }

  //group search
  setAnimation(groupName, "", 0, 0);
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
        setAnimation(
          groupName,
          "leftScroll linear infinite",
          (20.0 * groupName.elt.clientWidth) / windowWidth,
          0
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

  backgroundColorLerp = backgroundColor;

  inp.value("");
  answer = inp.value();
  result.html(prefix[conjNum][varNum] + answer);
  correctAnswer =
    reflexive[conjNum] +
    splitTokens(verbRow.getString(conjugationText[conjNum]), ";")[0];
  //tip:
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
  if (impersonal) {
    tiplist.html(
      "<p>il " +
        splitTokens(verbRow.getString(conjugationText[2]), ";")[0] +
        "</p>"
    );
  }
  //tip passe:
  if (passe.checked()) {
    tiplist.html(
      tiplist.html() +
        "</p></br><p>" +
        splitTokens(verbRow.getString("past participle"), ";")[0] +
        "</p>"
    );
  }

  //normal
  if (!mode.checked()) {
    if (!muteSpeech.checked()) {
      speak(verb);
    }
    verbFrench.html(shortTable.getString(verbNum, "verb"));
    translation.html("[" + shortTable.getString(verbNum, lang.value()) + "]");
    //translation mode
  } else {
    verbFrench.html(shortTable.getString(verbNum, lang.value()));
    translation.html("");
    groupName.html("");
    tiplist.html(
      "<p>" +
        shortTable.getString(verbNum, "verb") +
        "</p></br>" +
        tiplist.html()
    );
  }

  setAnimation(result, "resultIn ease-out forwards", 1.6, 0);
  setAnimation(verbFrench, "newVerb ease-in forwards", 0.5, 0);
  setAnimation(translation, "newGroup ease-in", 1.5, 0);
  secondAnimation(groupName, "newGroup ease-in", 1.5, 0);
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
  setVariable("--background", backgroundColor);
}

function findMistake() {
  let startIndex = 0;
  let endIndex = answer.length;
  let start = "",
    end = "",
    strike = "";
  for (let i = 0; i <= answer.length; i++) {
    if (correctAnswer.startsWith(answer.substring(0, i))) {
      startIndex = i;
    }
  }
  for (let i = answer.length; i >= 0; i--) {
    if (correctAnswer.substring(startIndex).endsWith(answer.substring(i))) {
      endIndex = i;
    }
  }
  if (startIndex > endIndex) {
    start = answer.substring(0, endIndex);
    end = answer.substring(startIndex);
    strike = answer.substring(endIndex, startIndex);
  } else {
    start = answer.substring(0, startIndex);
    end = answer.substring(endIndex);
    strike = answer.substring(startIndex, endIndex);
  }
  result.html(prefix[conjNum][varNum] + start + "<s>" + strike + "</s>" + end);
}

function correctAnimation() {
  setAnimation(result, "resultOut linear forwards", 1.45, 0);
  secondAnimation(groupName, "flyUp ease-in forwards", 1.95, 0);
  setAnimation(verbFrench, "flyUp ease-in forwards", 1.95, 0.05);
  setAnimation(translation, "flyUp ease-in forwards", 1.95, 0.1);
}

function showTip() {
  setVariable("--opacityLevel", lookUpValue("gradBox", "opacity"));
  setAnimation(
    tiplist,
    "fly-in forwards cubic-bezier(0.18,1,0.74,1)",
    0.4,
    0.1
  );
  secondAnimation(result, "blur-in forwards", 0.5, 0);
  secondAnimation(verbFrench, "blur-in forwards", 0.5, 0);
  addAnimation(groupName, "group-blur-in forwards", 0.5, 0);
  secondAnimation(translation, "blur-in forwards", 0.5, 0);
  setAnimation(gradientBackgroundBox, "fade-in forwards ease-out", 0.8, 0);
  //setAnimation(menubutton,"ease forwards opacity-fade", 0.4, 0);
  menubutton.style("animation", "ease forwards opacity-fade 0.4s 0s");
  inp.elt.blur();
}

function hideTip() {
  setVariable("--opacityLevel", lookUpValue("gradBox", "opacity"));

  let tipPos = float(lookUpValue("tip", "left"));
  if (tipPos >= windowWidth * 0.45) {
    setAnimation(tiplist, "fly-out forwards", 0.35, 0.0);
  } else {
    setVariable("--tipPosition", lookUpValue("tip", "left"));
    setVariable("--tipOpacity", lookUpValue("tip", "opacity"));
    setAnimation(tiplist, "fly-back", 0.35, 0.0);
  }
  let bLev = float(splitTokens(lookUpValue("result", "text-shadow"), "px ")[5]);

  setVariable("--blurLevel", bLev + "px");
  setAnimation(result, "blur-out ease-in", 0.5, 0);
  setAnimation(verbFrench, "blur-out ease-in", 0.5, 0);
  secondAnimation(groupName, "group-blur-out ease-in", 0.5, 0);
  setAnimation(translation, "blur-out ease-in", 0.5, 0);
  setAnimation(gradientBackgroundBox, "fade-out ease-in", 0.4, 0);
  //setAnimation(menubutton,"ease forwards opacity-unfade", 0.5, 0);
  menubutton.style("animation", "ease opacity-unfade 0.5s 0s");
  inp.elt.focus();
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
    ["i", "î", "ï"],
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
    if(!theVoice) {
    setVoice();
  }
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
    if (!muteSpeech.checked()) {
      synth.speak(utterThis);
    }
  }
}

function setVoice() {
  window.speechSynthesis.getVoices();
  let voices = synth.getVoices().filter(function (voice) {
    return voice.lang.includes("FR");
  });
  console.log("Available french voices:");
  for (let a of voices) console.log(a.name + " " + a.lang);
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
    theVoice = voices[0];
  }
  console.log("Using: " + theVoice.name);
}

function toggleMenu() {
  if (this.elt.checked) {
    secondAnimation(groupName, "flyUp forwards ease-in", 1.95, 0);
    setAnimation(translation, "newVerb reverse forwards", 0.4, 0.5);
    setAnimation(verbFrench, "newVerb reverse forwards", 0.4, 0.55);
    setAnimation(result, "newVerb reverse forwards", 0.4, 0.4);
    inp.elt.blur();
    menubutton.html("×");
  } else {
    setAnimation(result, "", "0s ease 0s 1 normal none running none ");
    verbFrench.style("animation", "0s ease 0s 1 normal none running none ");
    translation.style("animation", "0s ease 0s 1 normal none running none ");
    groupName.style("animation", "0s ease 0s 1 normal none running none ");
    createNext();
    inp.elt.focus();
    menubutton.html("☰");
  }
}

function changeList() {
  shortTable = loadTable(this.value(), "csv", "header");
}

function setBigKegel() {
  setVariable(
    "--bigKegel",
    min(
      windowHeight * 0.1,
      (windowWidth * textSize()) / textWidth("nous déconceptualisons")
    ) + "px"
  );
}

function setAnimation(elem, name, time, delay) {
  elem.style("animation", "0s ease 0s 1 normal none running none ");
  lookUpValue(elem.elt.id, "animation");
  elem.style("animation", name + " " + time + "s" + " " + delay + "s");
}
function secondAnimation(elem, name, time, delay) {
  elem.style(
    "animation",
    splitTokens(lookUpValue(elem.elt.id, "animation"), ",")[0] +
      ", " +
      name +
      " " +
      time +
      "s" +
      " " +
      delay +
      "s"
  );
}
function addAnimation(elem, name, time, delay) {
  elem.style(
    "animation",
    lookUpValue(elem.elt.id, "animation") +
      ", " +
      name +
      " " +
      time +
      "s" +
      " " +
      delay +
      "s"
  );
}
