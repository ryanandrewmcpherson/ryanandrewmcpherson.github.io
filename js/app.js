


var myLinks = document.getElementById("myLinks");
var myLinksHeight;


function myFunction() {  
    if(window.matchMedia("(max-Width:596px)").matches){
      myLinksHeight = "40px";
    }
    if(window.matchMedia("(max-Width:496px)").matches){
      myLinksHeight = "95.2px";
     
    }
    if (myLinks.style.height === "0px" || myLinks.style.height === "") {
      myLinks.style.height = myLinksHeight;
    } else {
      myLinks.style.height = "0px";
      myLinks.style.padding = "0px";
    }
}

if(window.matchMedia("(min-Width:596px)").matches){
   myLinks.style = "null";
}

const originalResize = evt => {
  console.log(window.innerWidth);
  if(window.matchMedia("(max-Width:596px)").matches && window.matchMedia("(min-width:497px)").matches){
    myLinksHeight = "40px";
  }
  if(window.matchMedia("(max-Width:496px)").matches){
    myLinksHeight = "95.2px";
  }
  if(myLinks.style.height > 0){
  myLinks.style.height = myLinksHeight;
  }
};


window.addEventListener("resize",originalResize)

var modal = document.getElementById('myModal');

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none"; 
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "flex"; 
  slides[slideIndex-1].style.justifyContent = "center"; 
  dots[slideIndex-1].className += " active";
}

var coll = document.getElementsByClassName("collapsible");
var i;

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var techList = document.getElementsByClassName("tech-list")[i];
    if (techList.style.display === "block") {
      techList.style.display = "none";
    } else {
      techList.style.display = "block";
    }
  });
}

var linksOut = document.getElementsByTagName("a");

for(let i=4; i < linksOut.length ; i++){
  
  linksOut[i].addEventListener("click",function(event){
    event.preventDefault();
    window.open(linksOut[i].href);
  })
  
}
