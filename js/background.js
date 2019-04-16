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

function definecircles(){
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
}

definecircles();

window.setInterval(function(){

ctx.clearRect(0,0,background.width,background.height);

for(let j = 0;j<sizeA.length;j++){
    if(xA[j] >= background.width  || xA[j]  <= 0){
        vXA[j] = vXA[j]*-1;
    }
    if(yA[j] >= background.height || yA[j]  <= 0){
        vYA[j] = vYA[j]*-1;
    }

    if(Math.abs(xA[j]-mouseclickX) <= sizeA[j] && Math.abs(yA[j]-mouseclickY) <= sizeA[j]){
        sizeA.splice(j,1);
        xA.splice(j,1);
        yA.splice(j,1);
        colorA.splice(j,1);
        vYA.splice(j,1);
        vXA.splice(j,1);
    }

    xA[j] = xA[j] + vXA[j]*interval/1000;
    yA[j] = yA[j] + vYA[j]*interval/1000;

    
    if(sizeA.length>0){
        ctx.beginPath();
        ctx.arc(xA[j],yA[j],sizeA[j],0 , 2*Math.PI)
        strokeColor = colorA[j];
        ctx.fillStyle = strokeColor;
        ctx.fill();
    }
    else{
        definecircles();
    }
}

},interval);


window.addEventListener("resize",function(){
  document.querySelector("body").removeChild(background);
  background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
  background.width = parseInt(window.getComputedStyle(document.querySelector("body")).width);
  document.querySelector("body").appendChild(background);
});

var mouseclickX = null;
var mouseclickY = null;

document.addEventListener("click",function(event){
    mouseclickX = event.pageX;
    mouseclickY = event.pageY;

    if(event.touches != null){
      mouseclickX = event.touches[0].pageX;
      mouseclickY = event.touches[0].pageY;
    }
})