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
  c.moveTo(x,y);
  c.lineTo(x2,y);
  c.stroke();
}

function Note(radius, xPosition){

  this.radius = radius;
  this.correct = "notAssigned";
  this.noteValue;
  this.linePosition;
  this.lineNumber;
  this.xPosition = xPosition;

  this.drawNote = function(color){
    c.beginPath();
    c.arc(this.xPosition, this.linePosition, this.radius, 0, Math.PI * 2, false); // x, y, radius  ,startAngle, endAngle, drawcounterclockwise
    c.strokeStyle = color;
    c.fillStyle = color; //selects any color in the array
    c.stroke();
    c.fill();
    //console.log("note drawn at: " + y);
  }

  this.setXPosition = function(x){
    this.xPosition = x;
  }
//setCorrect
  this.isCorrect = function(){
    this.correct = true;
  }

  this.isFalse = function(){
    this.correct = false;
  }

  this.isInChord = function(){
    return this.correct;
  }

  this.setLinePosition = function(y){
    this.linePosition = y;
  }

  this.getLinePosition = function(){
    return this.linePosition;
  }

  this.getNoteValue = function(){
    return this.noteValue;
  }

  this.setNoteValue = function(noteValue){
    this.noteValue = noteValue;
  };

  this.setLineNumber = function(lineNumber){
    this.lineNumber = lineNumber;
  }

  this.getLineNumber = function(){
    return this.lineNumber;
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
  this.note = new Note((gap/2), (this.x +(length/2)));
  this.length = length;
  this.addedNotes = [];


  //rename to drawStaveLines
  this.drawStave = function(){
    //draw treble Lines
    c.strokeStyle = "black";
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

    noteToAdd = new Note((gap/2), (this.x +(length/2)));
    noteToAdd.setLinePosition(this.note.getLinePosition());
    noteToAdd.setLineNumber(this.note.getLineNumber());
    noteToAdd.setNoteValue(this.returnSelectedNote());
    this.addedNotes.push(noteToAdd);
    console.log(noteToAdd.getNoteValue());

  }

  //rename to calculateSelectedNote()
  this.returnSelectedNote = function(){
    var currentLine = this.note.getLineNumber();
    if(this.note.getLineNumber() < 15 ){
      return this.trebleNotes[currentLine + 5];
    } else{
      return this.bassNotes[currentLine - 15];
    }
  }
  //checks if notes have been added to the stav
  //can be deleted
  this.containsNotes = function(){
    if(addedNotes.length > 0){
      return true;
    } else{
      return false;
    }
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

  //draws a Note on the line and
  this.drawOnLine = function(lineNumber){
    var yLinePosition = this.y + (lineNumber * (this.gap/2));
    //why do i check for -1
    if(linenumber = -1 || lineNumber){
      this.note.setLinePosition(yLinePosition);
      this.note.setLineNumber(lineNumber);
      this.note.drawNote();
    }
  }

  this.drawHelpLine = function(lineNumber){
    var yLinePosition = this.y + (lineNumber * (this.gap/2));
    //drawLine(x,y,x2)
    drawLine(this.x +(this.length/2)-30, yLinePosition, this.x +(this.length/2)+30);
  }

  this.drawAddedNotes = function(){
    for (const n of this.addedNotes){
      if(n.isInChord() === "notAssigned"){
        n.drawNote("grey");
      }
      else if(n.isInChord()){
        n.drawNote("green");
      } else{
        n.drawNote("red");
      }

    }
  }

  this.checkAnswers = function(chord){

    for(const n of this.addedNotes){
      noteValue = n.getNoteValue();
      if(chord.includes(noteValue)){
        n.isCorrect();
        console.log(noteValue +" is  part of the Chord");
      }else{
        n.isFalse();
        console.log(noteValue+" is not part of the Chord");
      }
    }
  }

  this.update = function(){
    this.drawOnLine((this.closestLine()));
  }
}

var stave = new Stave(50,71,700,20);
function animate() {

  requestAnimationFrame(animate); //creates a loop for us -> Function Animate
  c.clearRect(0, 0, innerWidth, innerHeight);
  stave.drawStave();
  stave.drawAddedNotes();
  stave.update();

  //achtung hier möchte er auch hier immer die linien grau machen.
  c.drawImage(trebleClefImage, 20,20);
  c.drawImage(bassClefImage, 40, 243, 130, 130);
}


canvas.addEventListener("click", function(event){
  stave.addNoteToStave();
  console.log()
  console.log(stave.closestLine());
  //console.log(stave.closestLine());
  //console.log(stave.returnSelectedNote());
});

document.getElementById("checkAnswer").onclick = function(){
  stave.checkAnswers(["C","E","G"]);
};



animate();
