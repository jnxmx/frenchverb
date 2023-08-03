@media (width <= 700px) {
  #contentBox {
    height: 117vw;
  }
}
:root {
  --background: #000000;
  --fontColor: #ffffff;
  --darkFontColor: color-mix(in srgb, var(--fontColor) 74%, #000000);
  --shade: color-mix(in srgb, var(--fontColor) 88%, var(--background));
  --halfColor: color-mix(in srgb, var(--fontColor) 48%, var(--background));
  --menuBackground: color-mix(in srgb, var(--fontColor) 48%, #FFFFFF);
  --bigKegel:10vh;
  --smallKegel: calc(0.5*var(--bigKegel));
  --menuKegel: min(calc(0.45*var(--bigKegel)), 3.3vh, 4vw);
  --blurLevel: 0px;
  --opacityLevel: 1;
  --tipPosition: 50%;
  --tipOpacity: 0;
  --scrollLength: 0;
}

phtml,
body {
  color: var(--fontColor);
  accent-color: var(--background);
  background: var(--fontColor);
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  text-align: center;
  -webkit-touch-callout: none; 
  -webkit-user-select: none; 
  -khtml-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
  user-select: none; 
}

canvas {
  display: block;
}

.radio-wrapper>div{
  display:inline-flex;
  flex-wrap: wrap;
}
input[type=checkbox]{
   font-size: var(--menuKegel);  
  appearance: none;
      height: 0.4em;
    width: 0.4em;
    margin-right: 0.5em;
  border-radius: 0%;
  background: var(--shade);
  border: 0.15em solid var(--fontColor);
  box-shadow: 0 0 0 0.01em var(--darkFontColor);   
}
input[type=checkbox] + span {
  font-size: var(--menuKegel); 
  margin-right: 1em;
}
[type=checkbox]:hover{
  border-width: 0;
}
[type=checkbox]:checked{
      box-shadow: 0 0 0 0.1em var(--background);
    background-color: var(--background);
    border-width: 0.11em;
}   
input[type=radio]{
   font-size: var(--menuKegel);  
  appearance: none;
      height: 0.5em;
    width: 0.5em;
    margin-right: 0.5em;
  border-radius: 50%;
  background: var(--shade);
  border: 0.15em solid var(--fontColor);
  box-shadow: 0 0 0 0.1em var(--darkFontColor);   
}
input[type=radio] + span {
  font-size: var(--menuKegel); 
  margin-right: 1em;
}
[type=radio]:hover{
  border-width: 0;
}
[type=radio]:checked{
      box-shadow: 0 0 0 0.1em var(--background);
    background-color: var(--background);
    border-width: 0.11em;
}   
#menubutton { 
  display:none;
}
label[for="menubutton"] {
  left:50%;
  transform: translateX(-50%);
  margin-bottom: -1em;
    -webkit-touch-callout: none; 
  -webkit-user-select: none; 
  -khtml-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
  user-select: none; 
    overflow: hidden;
  overflow-y: hidden;
  display: block;
  position: fixed;   
  appearance: none;
  color: var(--fontColor);  
  width: 1em;  
  z-index: 999;
  text-align: center;
  font-size: calc(0.85*var(--bigKegel));  
  cursor: pointer;
]
  transition: transform 0.2s ease-in 0.2s forwards, 
    top 0.15s ease,
    color 0.4s linear;
}
label[for="menubutton"]:hover {
  transform: scale(1.05) translateX(-50%);
}
#menubutton:checked ~ label {
  transition: transform 0.2s ease-out, 
    top 0.8s ease 0.4s, 
    color 0.4s linear;
  color: color-mix(in srgb, var(--fontColor) 48%, var(--background));
}
#menubutton:checked ~ label:hover {
  transform: scale(1.05) rotate(0deg) translateX(-50%);
}
.menu {
  position: absolute;   
  margin:0.5em;
  font-size: var(--bigKegel);  
padding-bottom: 0.6em;
  width: 0.0em;
  height: 0.8em;
  overflow: hidden;
  overflow-y: hidden;
  z-index: 998;
  background-color:   var(--menuBackground); 
  display:grid;
  grid-template-columns: 0.5fr 1.5fr;
  gap: 0em 0.9em;
  align-content: start;
  border-radius: 0.1em; 
  transition: height 0.2s ease, 
    width 0.2s ease 0.2s, 
    top 0.15s ease, 
    left 0.2s ease 0.2s,
    padding 0.2s ease 0.2s;  
  color: var(--darkFontColor);
}
#menubutton:checked ~ div.menu {
  transition: width 0.4s ease, 
    height 0.8s ease 0.4s, 
    left 0.15s ease, 
    top 0.4s ease 0.4s,
    padding 0.6s ease 0.2s;


  border-radius: 0.15em;
  padding: 0.75em;
  padding-top:0em;
  margin:0.5em;
  width: calc(100% - 2.5em);
  height: calc(100% - 1.75em); 
}
.menu > p {
  text-align: left;
  line-height: 1.2em;
  font-size: var(--menuKegel);
  margin:0em;
  margin-bottom: 1.5em;
  padding: 0em;
  
}
#verba {
  text-align: center;
  margin: 0.2em;
  block-size: 1.43em;
  color: var(--background);
  margin-bottom: 3em;
  grid-column: span 2;   
}
.double{
  grid-column: span 2; 
}
.empty {
  min-height: 0em;
}

@keyframes opacity-fade {
  0% {
    text-shadow: 0 0 0 var(--fontColor);
    color: var(--fontColor);
  }
  1% {
    color: transparent;
  }
  100% {
    text-shadow: 0 0 calc(0.25*var(--bigKegel)) var(--fontColor);
    color: transparent;
  }
}

@keyframes opacity-unfade {
  0% {
    color: transparent;
    text-shadow: 0 0 var(--blurLevel) var(--fontColor);
  }
  99% {
    color: transparent;
  }
  100% {
    text-shadow: 0 0 0 var(--fontColor);
    color: var(--fontColor);
  }
}

#contentBox {
  position: absolute;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  left: 0px;
  top: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

#result {
  width: 100%;
  font-size: var(--bigKegel);
  color: var(--fontColor);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: absolute;
  display: inline-block;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#verbFrench { 
  position: absolute;
  font-size: var(--bigKegel);
  color: var(--fontColor);  
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  top: calc(var(--bigKegel)*1.6);
  left: 50%;
  transform: translate(-50%, -50%);
}

#translation {
  position: absolute;
  font-size: var(--smallKegel);
  color: var(--fontColor);
  top: calc(1.6*var(--bigKegel) + 1.55*var(--smallKegel));
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: absolute;
  display: inline-block;
  left: 50%;
  transform: translate(-50%, -50%);
}

#tip {
  position: absolute;
  font-size: var(--smallKegel);
  color: var(--background);
  top: 50%;
  transform: translate(-50%, -50%);
  line-height: 1.0;
  opacity: 0;
  width: 100%;
}

#tip > p {
  line-height: 1.1;
  margin: 0;
  
  padding: 0;
}

#hiddenInput {
  width: 1px;
  height: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  position: absolute;
  left: -1px;
  top: -1px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  font-size: 1px;
  color: rgba(0, 0, 0, 0);
  background-color: rgba(0, 0, 0, 0);
  outline: rgba(0, 0, 0, 0);
  border: rgba(0, 0, 0, 0);
  padding: 0;
  margin: 0;
  caret-color: transparent;
}

#group {
  position: absolute;  
  font-size: var(--smallKegel);
  color: var(--halfColor);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  left: 50%;
  transform: translate(-50%, -50%);
  top: var(--smallKegel);
  display: inline-block;
  padding:0em;

}

#gradBox {  
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
  
  background-image: linear-gradient(var(--background) 0%, color-mix(in srgb, var(--background) 40%, var(--fontColor)) 45% 52%, var(--halfColor) 75% 85%, var(--fontColor) 115%);
}

@keyframes fly-in {
  0% {left: 0;
    opacity: 0;}
  100% {left: 50%;
    opacity: 1;}
}
@keyframes fly-out {
  0% {left: 50%;
    opacity: 1;}
  100% {left: 100%;
    opacity: 0;}
}
@keyframes fly-back {
  0% {left: var(--tipPosition);
    opacity: var(--tipOpacity);}
  100% {left: 0;
    opacity: 0;}
}
@keyframes fade-in {
  0% {
    opacity: var(--opacityLevel);
  } 100% {
    opacity: 0.4;
  }
}
@keyframes fade-out {
  0% {
    opacity: var(--opacityLevel);
  } 100% {
    opacity: 1;
  }
}
@keyframes blur-in {
  0% {
    color: transparent;
  text-shadow: 0 0 0 var(--fontColor);
    padding:0em;
  } 100% {
    color: transparent;
  text-shadow: 0 0 calc(0.25*var(--bigKegel)) var(--fontColor);
    padding:0em;
  }
}
@keyframes blur-out {
  0% {
    color: transparent;
  text-shadow: 0 0 var(--blurLevel) var(--fontColor);
    padding:0em;
  } 100% {
    color: transparent;
  text-shadow: 0 0 0 var(--fontColor);
    padding:0em;
  }
}
@keyframes group-blur-in {
  0% {
    color: transparent;
  text-shadow: 0 0 0 var(--halfColor);
    padding:0em;
  } 100% {
    color: transparent;
  text-shadow: 0 0 calc(0.25*var(--bigKegel)) var(--fontColor);
    padding:0em;
  }
}
@keyframes group-blur-out {
  0% {
    color: transparent;
  text-shadow: 0 0 var(--blurLevel) var(--fontColor);
    padding:0em;
  } 100% {
    color: transparent;
  text-shadow: 0 0 0 var(--halfColor);
    padding:0em;
  }
}


@keyframes shake {
  0% {  margin-left: 0rem; }
  25% { margin-left: 0.75rem; }
  75% { margin-left: -0.75rem; }
  100% { margin-left: 0rem; }
}

@keyframes leftScroll {
  from {   
     margin-left: calc(0.25*var(--scrollLength)); 
  }
  to {
     margin-left: calc(-0.25*var(--scrollLength)); 
  }
}

@keyframes flyUp {
  0% {
    opacity: 1;
    margin-top:0px
  } 
  
  20% {
    opacity: 0;
  }
  
  100% {
    opacity: 0;
    margin-top:calc(-8*var(--bigKegel));
  } 
}

@keyframes newVerb {
  0% {
    opacity: 0;
  }   
  100% {
    opacity: 1;
  } 
}
@keyframes newGroup {
  0%, 70% {
    opacity: 0;
  }   
  100% {
    opacity: 1;
  } 
}

@keyframes resultOut {
  0% {
    left: 50%;
    transform: translate(-50%, -50%), scale(1.0);
  }   
  75% {
    left: 50%;
    transform: translate(-50%, -50%), scale(1.2);
  } 
  100% {
    left: 150%;
  }   
}

@keyframes resultIn {
  0%, 40% {
    opacity: 0;
    left: 0%
  }     
  53% {
    left: 15%
  }   
  62% {
    left: 40%
  } 
  70% {
    opacity: 0.3;
    left: 52%;
  }
  100% {
    opacity: 1;
    left: 50%
  }   
}

#result > s {
  text-decoration-color: var(--background);
  animation: sOpacity forwards ease-out 0.15s 0.8s;
}
@keyframes sOpacity {
  0% {
   
    text-decoration-color: var(--background);
  }
  99% {
    text-decoration-color: rgba(red(--fontColor), green(--fontColor),blue(--fontColor),0.01) ;
  }
  100% {
    text-decoration-color: transparent;
  }
}
