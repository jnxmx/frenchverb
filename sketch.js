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
let shortTable;
let fullTable;
let listFileName = [
  "assets/willdudziak147.csv",
  "assets/willdudziak681.csv",
  "assets/50verbs.csv",
  "assets/reflexive.csv",
];
let listName = [
  "147 by Will Dudziak",
  "681 by Will Dudziak",
  "50 most popular",
  "40 reflexive verbs",
];
let verbRow;
let prefix = [
  ["je ", "j'"],
  ["tu "],
  ["il ", "elle ", "on "],
  ["nous "],
  ["vous "],
  ["ils ", "elles "],
  ["il a ", "il est ", "il s’est "],
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
  if (!synth.getVoices().length) {
    synth.addEventListener("voiceschanged", function () {
      console.log("!!!");
      setVoice();
    });
  } else {
    setVoice();
  }
}

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
  tutorialInput = createElement("div");
  tutorialInput.parent(contentBox);
  tutorialInput.id("tutorial-input");
  tutorialInput.html("↑</br>type verb conjugation here");
  tutorialMenu = createElement("div");
  tutorialMenu.id("tutorial-menu");
  tutorialMenu.style("visibility", "hidden");

  setAnimation(tutorialInput, "ease forwards svg-opacity-unfade", 0.6, 0);
      addAnimation(tutorialInput, "shine infinite alternate ease", 1, 0);

  //menu
  menucontrol = createInput();

  menucontrol.attribute("type", "checkbox");
  // menucontrol.attribute('checked', true);
  menucontrol.id("menubutton");
  menucontrol.changed(toggleMenu);
  menubutton = createElement("label", "");
  menubutton.id("button");
  menubutton.attribute("for", "menubutton");
  menubutton.html(
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 12 12";"><rect x="0" width="12" height="2.4"/><rect x="0" y="9.6" width="12" height="2.4"/><rect y="4.8" width="12" height="2.4"/></svg>'
  );
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
  let opts = createElement("p");
  opts.parent(menu);
  opts.id("optionsblock");
  //dict
  let pVerb1 = createElement("p");
  pVerb1.parent(opts);
  pVerb1.id("verbblock");
  pVerb1.html("Verb list:");
  let pVerb2 = createElement("p");
  pVerb2.parent(pVerb1);
  pVerb2.class("radio-wrapper");
  let dict = createRadio("Dictionary");
  dict.changed(changeList);
  for (let i = 0; i < listFileName.length; i++) {
    dict.option(listFileName[i], listName[i]);
  }
  dict.selected(listFileName[0]);
  dict.parent(pVerb2);
  let pTrans1 = createElement("p");
  pTrans1.parent(opts);
  pTrans1.id("transblock");
  pTrans1.html("Translation language:");
  let pTrans2 = createElement("p");
  pTrans2.parent(pTrans1);
  pTrans2.class("radio-wrapper");
  lang = createRadio("Language");
  lang.option("russian", "russian");
  lang.option("english", "english");
  lang.selected("english");
  lang.parent(pTrans2);
  //mode
  let pMode1 = createElement("p");
  pMode1.parent(opts);
  pMode1.id("modeblock");
  pMode1.html("Configuration:");
  let pMode2 = createElement("p");
  pMode2.parent(pMode1);
  passe = createCheckbox("past participle form", false);
  passe.parent(pMode2);
  mode = createCheckbox("translation only", false);
  mode.parent(pMode2);
  muteSpeech = createCheckbox("mute speech", false);
  muteSpeech.parent(pMode2);
  pVerb1 = createElement("p");
  pVerb1.parent(menu);
  //pVerb1.class("double");
  pVerb1.html(
    "Coding and design by Ivan Yakushev.</br>Font PP Radio Grotesk by Pangram Pangram.</br>Tested on Chrome & Safari only."
  );
  //pVerb1.style("align-self", "end");
  //input
  inp = createInput("");
  inp.id("hiddenInput");
  inp.elt.autocomplete = "one-time-code";
  inp.elt.autocorrect = "off";
  inp.elt.autocapitalize = "off";
  inp.elt.spellcheck = "off";
  inp.elt.focus();
  //onkeypress
  inp.elt.addEventListener("input", (event) => {
    const inputValue = event.target.value.toLowerCase().replace("'", "’");
    answer = inputValue;
    result.html(prefix[conjNum][varNum] + answer);
    if (lookUpValue("tutorial-input", "visibility") == "visible") {
      console.log("again");
      tutorialInput.style("visibility", "hidden");
      console.log(lookUpValue("tutorial-input", "visibility"));
      tutorialHold = createElement("div");
      tutorialHold.id("tutorial-hold");
      tutorialHold.parent(contentBox);
      tutorialHold.html("press & hold</br>→ screen ←</br>for tip");
    }
  });
  //onsend
  inp.elt.addEventListener("keyup", (event) => {
    event.preventDefault();
    setCaretPosition("hiddenInput", inp.value().length);
    if (event.keyCode === ENTER) {
      if (answer === correctAnswer || answer === correctAnswer + " ") {
        tutorialHold.style("visibility", "hidden");;
        tutorialMenu.style("visibility", "hidden");;
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
  //   if (event.keyCode === LEFT_ARROW) {
  //     showTip();
  //   }
  // });

  addEventListener(
    "animationend",
    function (e) {
      if (e.animationName === "resultOut") createNext();
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
  if (verb.substring(0, 2) === "s'") {
    refl = true;
    reflexive = ["m’", "t’", "s’", "nous ", "vous ", "s’", "se "];
    verb = verb.substring(2);
  } else if (verb.substring(0, 3) === "se ") {
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
  if (conjNum === 2 || conjNum === 5) {
    varNum = int(random(0, prefix[conjNum].length));
  } else if (conjNum === 0) {
    let firstLetter = verbRow.getString(conjugationText[0]).charAt(0);
    if (vowels.includes(firstLetter) && !refl) {
      varNum = 1;
    } else {
      varNum = 0;
    }
  } else if (conjNum === 6) {
    for (let etreVerb of etreVerbs) {
      if (refl) {
        varNum = 2;
      } else if (
        verb.endsWith(etreVerb) &&
        verbRow.getString("compound verb") != "avoir"
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
  if (verbRow.getString(conjugationText[0]).length < 1 || verb === "advenir") {
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
        reflexive[5] +
        splitTokens(verbRow.getString(conjugationText[2]), ";")[0] +
        "</p>"
    );
  }
  //tip passe:
  if (passe.checked()) {
    if (!refl) {
      tiplist.html(
        tiplist.html() +
          "</p></br><p>" +
          reflexive[6] +
          splitTokens(verbRow.getString("past participle"), ";")[0] +
          "</p>"
      );
    } else {
      tiplist.html(
        tiplist.html() +
          "</p></br><p>s’est " +
          splitTokens(verbRow.getString("past participle"), ";")[0] +
          "</p>"
      );
      correctAnswer = splitTokens(
        verbRow.getString(conjugationText[conjNum]),
        ";"
      )[0];
      console.log(correctAnswer);
    }
  }

  //normal
  if (!mode.checked()) {
    if (!muteSpeech.checked()) {
      speak(shortTable.getString(verbNum, "verb"));
    }
    verbFrench.html(shortTable.getString(verbNum, "verb").replace("'", "’"));
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
  if (!menucontrol.elt.checked) {
    if (
      document.getElementById("tutorial-hold") &&
      lookUpValue("tutorial-hold", "visibility") == "visible"
    ) {
      setAnimation(tutorialHold, "blur-in forwards", 0.5, 0);
      secondAnimation(tutorialHold, "ease forwards svg-opacity-fade", 0.5, 0);
    }
    if (lookUpValue("tutorial-input", "visibility") == "visible") {
      setAnimation(tutorialInput, "ease forwards tutorial-opacity-fade", 0.5, 0);
    }
    if (
      document.getElementById("tutorial-menu") &&
      lookUpValue("tutorial-menu", "visibility") == "visible"
    ) {
      setAnimation(tutorialMenu, "ease forwards tutorial-opacity-fade", 0.2, 0);
    }
    setVariable("--opacityLevel", lookUpValue("gradBox", "opacity"));
    setAnimation(
      tiplist,
      "fly-in forwards cubic-bezier(0.18,1,0.74,1)",
      0.4,
      0.1
    );
    secondAnimation(result, "blur-in forwards", 0.5, 0);
    secondAnimation(verbFrench, "blur-in forwards", 0.5, 0);
    addAnimation(groupName, "blur-in forwards", 0.5, 0);
    secondAnimation(translation, "blur-in forwards", 0.5, 0);
    setAnimation(gradientBackgroundBox, "fade-in forwards ease-out", 0.8, 0);
    setAnimation(menubutton, "ease forwards svg-opacity-fade", 0.2, 0);
    //menubutton.style("animation", "ease forwards svg-opacity-fade 0.4s 0s");
    inp.elt.blur();
  }
}

function hideTip() {
  if (!menucontrol.elt.checked) {
    if (
      document.getElementById("tutorial-hold") &&
      lookUpValue("tutorial-hold", "visibility") == "visible"
    ) {
      tutorialHold.style("visibility", "hidden");;
      tutorialMenu.style("visibility", "visible");
      tutorialMenu.parent(contentBox);
      tutorialMenu.html("adjust options</br>↓");
    }
    if (lookUpValue("tutorial-input", "visibility") == "visible") {
      setAnimation(tutorialInput, "ease forwards tutorial-opacity-unfade", 0.3, 0);
      addAnimation(tutorialInput, "shine infinite alternate ease", 1, 0.0);
    }
    if (
      document.getElementById("tutorial-menu") &&
      lookUpValue("tutorial-menu", "visibility") == "visible"
    ) {
      setAnimation(tutorialMenu, "ease forwards tutorial-opacity-unfade", 0.3, 0);     
      addAnimation(tutorialMenu, "shine infinite alternate ease", 1, 0.0);
    }
    setVariable("--opacityLevel", lookUpValue("gradBox", "opacity"));

    let tipPos = float(lookUpValue("tip", "left"));
    if (tipPos >= windowWidth * 0.45) {
      setAnimation(tiplist, "fly-out forwards", 0.35, 0.0);
    } else {
      setVariable("--tipPosition", lookUpValue("tip", "left"));
      setVariable("--tipOpacity", lookUpValue("tip", "opacity"));
      setAnimation(tiplist, "fly-back", 0.35, 0.0);
    }
    let bLev = float(
      splitTokens(lookUpValue("result", "text-shadow"), "px ")[5]
    );

    setVariable("--blurLevel", bLev + "px");
    setAnimation(result, "blur-out ease-in", 0.5, 0);
    setAnimation(verbFrench, "blur-out ease-in", 0.5, 0);
    secondAnimation(groupName, "blur-out ease-in", 0.5, 0);
    //console.log(lookUpValue(groupName.elt.id, "animation"));
    setAnimation(translation, "blur-out ease-in", 0.5, 0);
    setAnimation(gradientBackgroundBox, "fade-out ease-in", 0.4, 0);
    setAnimation(menubutton, "ease forwards svg-opacity-unfade", 0.2, 0);
    //menubutton.style("animation", "ease opacity-unfade 0.5s 0s");
    inp.elt.focus();
  }
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
  if (code === 40) {
    if (inp.value().length > 0) {
      let lastSymbol = inp.value().charAt(inp.value().length - 1);
      for (let i = 0; i < weird.length; i++) {
        for (let j = 0; j < weird[i].length; j++) {
          if (lastSymbol === weird[i][j]) {
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
  } else if (code === 38) {
    if (inp.value().length > 0) {
      let lastSymbol = inp.value().charAt(inp.value().length - 1);
      for (let i = 0; i < weird.length; i++) {
        for (let j = 0; j < weird[i].length; j++) {
          if (lastSymbol === weird[i][j]) {
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
  // if (synth.speaking) {
  //   //console.error("speechSynthesis.speaking");
  //   //synth.cancel()
  //   return;
  // }
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
  if (
      document.getElementById("tutorial-menu") &&
      lookUpValue("tutorial-menu", "visibility") == "visible"
    ) {
      tutorialMenu.style("visibility", "hidden");;
      
    }
  if (this.elt.checked) {
    secondAnimation(groupName, "flyUp forwards ease-in", 1.95, 0);
    setAnimation(translation, "newVerb reverse forwards", 0.3, 0.05);
    setAnimation(verbFrench, "newVerb reverse forwards", 0.3, 0.1);
    setAnimation(result, "newVerb reverse forwards", 0.15, 0);
    setAnimation(menubutton, "zoomin ease-out forwards", 0.4, 0.4);
    menubutton.html(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 12 12" style="enable-background:new 0 0 12 12; " xml:space="preserve"><g><polygon points="12,1.7 10.3,0 6,4.3 1.7,0 0,1.7 4.3,6 0,10.3 1.7,12 6,7.7 10.3,12 12,10.3 7.7,6 	"/></g></svg>'
    );
    inp.elt.blur();
  } else {
    setAnimation(menubutton, "zoomin ease-out forwards", 0.4, 0.4);
    createNext();
    menubutton.html(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 12 12" style="enable-background:new 0 0 12 12; " xml:space="preserve"><g><rect x="0" width="12" height="2.4"/></g><g><rect x="0" y="9.6" width="12" height="2.4"/></g><g><rect y="4.8" width="12" height="2.4"/></g></svg>'
    );
    inp.elt.focus();
  }
}

function changeList() {
  shortTable = loadTable(this.value(), "csv", "header");
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
      "0s ease 0s 1 normal none running none "
  );
  lookUpValue(elem.elt.id, "animation");
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
