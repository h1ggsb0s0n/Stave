var canvas = document.querySelector("canvas");

canvas.width = 1000;
canvas.height = 1000;
var c =  canvas.getContext("2d");

var mouse = {
  x: undefined,
  y: undefined
}

var trebleClefImage = new Image();
trebleClefImage.src = 'media/clef.png';
var bassClefImage = new Image();
bassClefImage.src = 'media/bassclef.png';

canvas.addEventListener("mousemove", function(event){
  mouse.x = event.x;
  mouse.y = event.y;
});



function drawLine(x,y,x2){
  c.beginPath();
  c.moveTo(x,y)
  c.lineTo(x2,y);
  c.stroke();
}

function Note(radius){

  this.radius = radius;

  this.draw = function(x,y,color){
    c.beginPath();
    c.arc(x, y, this.radius, 0, Math.PI * 2, false); // x, y, radius  ,startAngle, endAngle, drawcounterclockwise
    c.strokeStyle = color;
    c.fillStyle = color; //selects any color in the array
    c.stroke();
    c.fill();
    //console.log("note drawn at: " + y);
  }
}


function HelpingLine(x,y,length){
  this.length = length();
  c.beginPath(x,y);
  c.beginPath()
  c.stroke();
}

//add color of lines maybe?
//add y position where to draw notes
//adding of new parameter, number of HelpLines
function Stave(x,y,length,gap){
  this.x = x;
  this.y = y;
  this.yTrebleFirstHelpLine = this.y - (gap/2)*5;
  this.yTrebleLastHelpLine = this.y + gap* 13;
  this.yBassFirstHelpLine = this.y + gap*15;
  this.yBassLastHelpLine = this.y + (gap/2)*38;
  this.trebleNotes = ["D","C","H","A","G","F","E","D","C","H","A","G","F","E","D","C","H","A","G"];
  this.bassNotes =  ["F","E","D","C","H","A","G","F","E","D","C","H","A","G","F","E","D","C","H"];
  this.gap = gap;
  this.note = new Note(gap/2);
  this.currentLineNumber;
  this.length = length;
  this.addedNotes = [];

  this.draw = function(){
    //draw treble Lines
    drawLine(this.x,this.y,this.x+this.length);
    drawLine(this.x,this.y+this.gap,this.x+this.length);
    drawLine(this.x,this.y+(this.gap*2),this.x+this.length);
    drawLine(this.x,this.y+(this.gap*3),this.x+this.length);
    drawLine(this.x,this.y+(this.gap*4),this.x+this.length);

    //draw Bass Lines
    drawLine(this.x,this.y+(this.gap*10),this.x+this.length);
    drawLine(this.x,this.y+(this.gap*11),this.x+this.length);
    drawLine(this.x,this.y+(this.gap*12),this.x+this.length);
    drawLine(this.x,this.y+(this.gap*13),this.x+this.length);
    drawLine(this.x,this.y+(this.gap*14),this.x+this.length);

  }

//problem we do have more than 10
  this.addNoteToStave = function(){
    this.addedNotes.push(this.currentLineNumber);
    return this.currentLineNumber;
  }

  this.returnSelectedNote = function(){
    if(this.currentLineNumber < 15 ){
      return this.trebleNotes[this.currentLineNumber + 5];
    } else{
      return this.bassNotes[this.currentLineNumber - 15];
    }
  }
  //checks if notes have been added to the stav
  this.containsNotes = function(){
    if(addedNotes.length > 0){
      return true;
    } else{
      return false;
    }
  }



  this.drawNote = function(x,y,color){
    this.note.draw(x+(this.length/2),y,color);
  }
  //checks on which line (+- gap between the lines/4) the MousePointer is located.
  this.isOnLine = function(lineNumber){
    var linePosition = this.y + (lineNumber * (this.gap/2));
    if(mouse.y >= (linePosition) - (this.gap/4) && mouse.y <= (linePosition) + (this.gap/4)){
      return true;
    } return false;
  }



  //returns the closestLine relative to the current mouse position in the canvas
  this.closestLine = function(){
    var yLine = this.yTrebleFirstHelpLine;
    console.log("yLineStart: "+ yLine)
    for (var i = 0; i < 33; i++) {
      if(mouse.y + gap/4 < yLine){

        return i;

      }
      yLine = yLine + (this.gap/2);
      console.log("yLine after Increment: "+ yLine);
    }
  }

  this.closestLine2 = function(){
    var distanceToFirstLine = mouse.y - this.yTrebleFirstHelpLine;
    var numberOfFirstLine = Math.floor(distanceToFirstLine/(this.gap/2));
    var numberOfSecondLine = numberOfFirstLine + 1;
    if(distanceToFirstLine < 0){
      return -5;
    }
    else if(mouse.y > this.yBassLastHelpLine){
      return 38-5;
    }
    else if(mouse.y - numberOfFirstLine*(this.gap/2) > (numberOfSecondLine*(this.gap/2) - mouse.y)){
      return numberOfFirstLine -5;
    } else
    return numberOfSecondLine -5 ;

  }

  //returns the y position of a selected line
  //not working
  this.returnLinePosition = function(lineNumber){
    return this.y + (lineNumber * (this.gap/2));
  }

  this.drawOnLine = function(lineNumber){
    var yLinePosition = this.y + (lineNumber * (this.gap/2));
    this.note.draw(this.x +(this.length/2), yLinePosition);
    if(linenumber = -1 || lineNumber)
    this.currentLineNumber = lineNumber;
  }

  this.drawHelpLine = function(lineNumber){
    var yLinePosition = this.y + (lineNumber * (this.gap/2));
    //drawLine(x,y,x2)
    drawLine(this.x +(this.length/2)-30, yLinePosition, this.x +(this.length/2)+30);
  }

  this.drawAddedNotes = function(){
    this.addedNotes.forEach(function(lineNumber){
      this.drawOnLine(lineNumber);
      /*if(lineNumber < 0 || (lineNumber > 9 && lineNumber < 19) || lineNumber > 29){
        this.drawHelpLine(lineNumber);
      }*/

    }, this);
  }

  this.update = function(){
    this.drawOnLine(this.closestLine2());
  }


  //this.note.draw(this.x + (this.length/2),this.y);
  //umstellung -> return line Positionthis.y
  this.update2 = function(){

    //Help Lines Trebble
    if(this.isOnLine(-5)){
      this.drawOnLine(-5);
      this.drawHelpLine(-4);
      this.drawHelpLine(-2);
    }
    if(this.isOnLine(-4)){
      this.drawOnLine(-4);
      this.drawHelpLine(-4);
      this.drawHelpLine(-2);
    }
    if(this.isOnLine(-3)){
      this.drawOnLine(-3);
      this.drawHelpLine(-2);
    }
    if(this.isOnLine(-2)){
      this.drawOnLine(-2);
      this.drawHelpLine(-2);
    }
    if(this.isOnLine(-1)){
      this.drawOnLine(-1);
    }

    //Treble Lines

    if(this.isOnLine(0)){
      this.drawOnLine(0);
    } else if(this.isOnLine(1)){
      this.drawOnLine(1);
    } else if(this.isOnLine(2)){
      this.drawOnLine(2);
    } else if(this.isOnLine(3)){
      this.drawOnLine(3);
    } else if(this.isOnLine(4)){
      this.drawOnLine(4);
    } else if(this.isOnLine(5)){
      this.drawOnLine(5);
    } else if(this.isOnLine(6)){
      this.drawOnLine(6);
    }else if(this.isOnLine(7)){
      this.drawOnLine(7);
    } else if(this.isOnLine(8)){
      this.drawOnLine(8);
    }else if(this.isOnLine(9)){
      this.drawOnLine(9);
    }else if(this.isOnLine(10)){
      this.drawOnLine(10);
      this.drawHelpLine(10);
    }else if(this.isOnLine(11)){
      this.drawOnLine(11);
      this.drawHelpLine(10);
    }else if(this.isOnLine(12)){
      this.drawOnLine(12);
      this.drawHelpLine(10);
      this.drawHelpLine(12);
    }else if(this.isOnLine(13)){
      this.drawOnLine(13);
      this.drawHelpLine(10);
      this.drawHelpLine(12);
    }

    //bass
    else if(this.isOnLine(15)){
      this.drawOnLine(15);
      this.drawHelpLine(16);
      this.drawHelpLine(18);
    }
    else if(this.isOnLine(16)){
      this.drawOnLine(16);
      this.drawHelpLine(16);
      this.drawHelpLine(18);
    }
    else if(this.isOnLine(17)){
      this.drawOnLine(17);
      this.drawHelpLine(18);
    }
    else if(this.isOnLine(18)){
      this.drawOnLine(18);
      this.drawHelpLine(18);
    }
    else if(this.isOnLine(19)){
      this.drawOnLine(19);
    }else if(this.isOnLine(20)){
      this.drawOnLine(20);
    } else if(this.isOnLine(21)){
      this.drawOnLine(21);
    } else if(this.isOnLine(22)){
      this.drawOnLine(22);
    } else if(this.isOnLine(23)){
      this.drawOnLine(23);
    } else if(this.isOnLine(24)){
      this.drawOnLine(24);
    } else if(this.isOnLine(25)){
      this.drawOnLine(25);
    }else if(this.isOnLine(26)){
      this.drawOnLine(26);
    } else if(this.isOnLine(27)){
      this.drawOnLine(27);
    } else if(this.isOnLine(28)){
      this.drawOnLine(28);
    }else if(this.isOnLine(29)){
      this.drawOnLine(29);
    }else if(this.isOnLine(30)){
      this.drawOnLine(30);
      this.drawHelpLine(30);
    }else if(this.isOnLine(31)){
      this.drawOnLine(31);
      this.drawHelpLine(30);
    }else if(this.isOnLine(32)){
      this.drawOnLine(32);
      this.drawHelpLine(30);
      this.drawHelpLine(32);
    }else if(this.isOnLine(33)){
      this.drawOnLine(33);
      this.drawHelpLine(30);
      this.drawHelpLine(32);
    }

    else {
      this.draw();
    }
  }
}

var stave = new Stave(50,71,700,20);
function animate() {

  requestAnimationFrame(animate); //creates a loop for us -> Function Animate
  c.clearRect(0, 0, innerWidth, innerHeight);
  stave.draw();
  stave.drawAddedNotes();
  stave.update();
  //achtung hier möchte er auch hier immer die linien grau machen.
  c.drawImage(trebleClefImage, 20,20);
  c.drawImage(bassClefImage, 40, 243, 130, 130);
}

canvas.addEventListener("click", function(event){
  stave.addNoteToStave();
  console.log()
  console.log(stave.closestLine2());
  //console.log(stave.closestLine());
  //console.log(stave.returnSelectedNote());
});

animate();
