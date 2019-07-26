var background = document.createElement("canvas");
ctx = background.getContext("2d"); 
background.id = "background";
background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
background.width = parseInt(window.getComputedStyle(document.querySelector("body")).width);
document.querySelector("body").appendChild(background);


let numcircless = 100;
let interval = 1000/120;
let circles = [];


function definecircles(){


    for(let i = 0;i<numcircless;i++){

        const size = Math.floor(Math.random()*151) + 50;
        const bodyStyle = window.getComputedStyle(document.querySelector("body"));
        const x = Math.floor(Math.random()*(parseInt(bodyStyle.width) + 1 - 2*size)) + size;
        const y = Math.floor(Math.random()*(parseInt(bodyStyle.height) + 1 - 2*size)) + size;
        let color = Math.floor(Math.random()*3);

        if(color === 0){
        color = "rgba(47,37,4,0.9)";
        }
        else if(color === 1){
        color = "rgba(75,92,96,0.9)";
        }else if (color === 2){
        color = "rgba(165,174,158,0.9)";
        }
        
        let vX = Math.floor(Math.random()*81) - 40;
        while(Math.abs(vX)<5){
            vX = Math.floor(Math.random()*81) - 40; 
        }
        let vY = Math.floor(Math.random()*81) - 40;
        while(Math.abs(vY)<5){
            vY = Math.floor(Math.random()*81) - 40; 
        }
        
        circles.push({x:x,y:y,vX:vX,vY:vY,size:size,color:color});
        console.log(circles[i] + "Number:" + i);

    }
};
definecircles();

window.setInterval(function(){

background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
background.width = parseInt(window.getComputedStyle(document.querySelector("body")).width);

ctx.clearRect(0,0,background.width,background.height);

for(let i = 0;i<circles.length;i++){

    

    if(circles[i].x >= background.width - 25 || circles[i].x  <= 25){
        circles[i].vX = circles[i].vX*-1;
    }
    if(circles[i].y >= background.height - 25  || circles[i].y  <= 25){
        circles[i].vY = circles[i].vY*-1;
    }

    circles[i].x += circles[i].vX*interval/1000;
    circles[i].y += circles[i].vY*interval/1000;

    ctx.beginPath();
    ctx.arc(circles[i].x,circles[i].y,circles[i].size,0 , 2*Math.PI)
    strokeColor = circles[i].color;
    ctx.fillStyle = strokeColor;
    ctx.fill();
    
    if(mouseclickX != null){
        if(Math.abs(mouseclickX - circles[i].x) <= circles[i].size && Math.abs(mouseclickY - circles[i].y) <= circles[i].size){
            circles.splice(i,1);
            console.log(circles.length);
        }
    }


    if(circles.length === 0){
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
    background.height =  parseInt(window.getComputedStyle(document.querySelector("body")).height);
    background.width = parseInt(window.getComputedStyle(document.querySelector("body")).width);
    document.querySelector("body").appendChild(background);
    
  

        
        
   
});



let mouseclickX = null;
let mouseclickY = null; 

document.addEventListener("touchstart",{function(event){
    mouseclickX = event.touches[0].pageX;
    mouseclickY = event.touches[0].pageY;

    event.preventDefault();
   }
})



document.addEventListener("click",function(event){

    
    mouseclickX = event.pageX;
    mouseclickY = event.pageY;
    
})

document.addEventListener("mousedown",function(event){
    event.preventDefault();
})

document.addEventListener("mousemove",function(event){
    event.preventDefault();
})



