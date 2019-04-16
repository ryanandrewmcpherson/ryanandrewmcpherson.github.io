var background = document.createElement("canvas");
ctx = background.getContext("2d"); 
background.id = "background";
background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
background.width = parseInt(window.getComputedStyle(document.querySelector("body")).width);
document.querySelector("body").appendChild(background);

var numCircles = 100;
var interval = 1000/75;
var xA = [];
var yA = [];
var vXA = [];
var vYA = [];
var sizeA = [];
var colorA = [];

for(let i = 0;i<numCircles;i++){

    let size = Math.floor(Math.random()*151) + 50;
    sizeA.push(size);

    let x = Math.floor(Math.random()*(background.width + 1 - 2*size)) + size;
    xA.push(x);
    let y = Math.floor(Math.random()*(background.height + 1 - 2*size)) + size;
    yA.push(y);
    
    let color = Math.floor(Math.random()*3);
    if(color === 0){
      color = "rgba(47,37,4,0.9)";
    }
    else if(color === 1){
      color = "rgba(75,92,96,0.9)";
    }else if (color === 2){
      color = "rgba(165,174,158,0.9)";
    }
    colorA.push(color);
    let vX = Math.floor(Math.random()*81) - 40;
    if(Math.abs(vX)<5){
        vX = Math.floor(Math.random()*81) - 40; 
    }
    vXA.push(vX);
    let vY = Math.floor(Math.random()*81) - 40;
    if(Math.abs(vY)<5){
        vY = Math.floor(Math.random()*81) - 40; 
    }
    vYA.push(vX);
}


window.setInterval(function(){

ctx.clearRect(0,0,background.width,background.height);

for(let i = 0;i<numCircles;i++){
    if(xA[i] >= background.width  || xA[i]  <= 0){
        vXA[i] = vXA[i]*-1;
    }
    if(yA[i] >= background.height || yA[i]  <= 0){
        vYA[i] = vYA[i]*-1;
    }

    xA[i] = xA[i] + vXA[i]*interval/1000;
    yA[i] = yA[i] + vYA[i]*interval/1000;
    
    ctx.beginPath();
    ctx.arc(xA[i],yA[i],sizeA[i],0 , 2*Math.PI)
    strokeColor = colorA[i];
    let circleGradient = ctx.createRadialGradient(xA[i],yA[i],0,xA[i],yA[i],360);
    circleGradient.addColorStop(0,"#D0DDD7");
    circleGradient.addColorStop(0.9,"" + strokeColor);
    ctx.fillStyle = strokeColor;
    ctx.fill();
}

},interval);


window.addEventListener("resize",function(){
  document.querySelector("body").removeChild(background);
  background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
  background.width = parseInt(window.getComputedStyle(document.querySelector("body")).width);
  document.querySelector("body").appendChild(background);
});