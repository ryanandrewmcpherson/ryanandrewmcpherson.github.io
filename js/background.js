var background = document.createElement("canvas");
ctx = background.getContext("2d"); 
background.id = "background";
background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
background.width = parseInt(window.getComputedStyle(document.querySelector("body")).width);
document.querySelector("body").appendChild(background);


let numCircles = 100;
let interval = 1000/120;
let xA;
let yA;
let vXA;
let vYA;
let sizeA;
let colorA;


function definecircles(){

    xA = [];
    yA = [];
    vXA = [];
    vYA = [];
    sizeA = [];
    colorA = [];

    for(let i = 0;i<numCircles;i++){

        let size = Math.floor(Math.random()*151) + 50;
        sizeA.push(size);
        
        
        let x;
        x = Math.floor(Math.random()*(parseInt(window.getComputedStyle(document.querySelector("body")).height) + 1 - 2*size)) + size;
        xA.push(x);
        console.log(xA.indexOf(x));
        let y;
        y = Math.floor(Math.random()*(parseInt(window.getComputedStyle(document.querySelector("body")).height) + 1 - 2*size)) + size;
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
};
definecircles();

window.setInterval(function(){

ctx.clearRect(0,0,background.width,background.height);

for(let i = 0;i<sizeA.length;i++){

    

    if(xA[i] >= background.width || xA[i]  <= 0){
        vXA[i] = vXA[i]*-1;
    }
    if(yA[i] >= background.height || yA[i]  <= 0){
        vYA[i] = vYA[i]*-1;
    }
    
    if(mouseclickX != null){
        if(Math.abs(mouseclickX - xA[i]) <= sizeA[i] && Math.abs(mouseclickY - yA[i]) <= sizeA[i]){
            xA.splice(i,1);
            yA.splice(i,1);
            vXA.splice(i,1);
            vYA.splice(i,1);
            sizeA.splice(i,1);
            colorA.splice(i,1);
            
        }

    }


    xA[i] = xA[i] + vXA[i]*interval/1000;
    yA[i] = yA[i] + vYA[i]*interval/1000;

    
    if(sizeA.length != 0){  
        ctx.beginPath();
        ctx.arc(xA[i],yA[i],sizeA[i],0 , 2*Math.PI)
        strokeColor = colorA[i];
        ctx.fillStyle = strokeColor;
        ctx.fill();
    }
    else{
        mouseclickX = null;
        mouseclickY = null;
        window.alert("Congratulations! You Popped All The Bubbles!");
        definecircles();
        break;
    }  
}
    mouseclickX = null;
    mouseclickY = null;
},interval);


window.addEventListener("resize",function(){
  document.querySelector("body").removeChild(background);
  background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
  background.width = parseInt(window.getComputedStyle(document.querySelector("body")).width);
  document.querySelector("body").appendChild(background);
});

function resize (){
    
}


let mouseclickX = null;
let mouseclickY = null; 

document.addEventListener("click",function(event){

    
    mouseclickX = event.pageX;
    mouseclickY = event.pageY;

    if(event.touches != null){
      mouseclickX = event.touches[0].pageX;
      mouseclickY = event.touches[0].pageY;
    }

    event.preventDefault();
})

document.addEventListener("mousedonw",function(event){
    event.preventDefault();
})

document.addEventListener("mousemove",function(event){
    event.preventDefault();
})

var start = null;

