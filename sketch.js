var ea ;
var space;
// console.log(ea.toString())
var saving = false;
var slider;
var hoverID = -1
var width, height

// Prevent selection of text on double click
document.addEventListener('mousedown', function (event) {
    if (event.detail > 1) {
      event.preventDefault();
    }
  }, false);

function setup(){
    width = 1000;
    height = 500;
    canvas = createCanvas(width, height);
    canvas.parent('CanvasHolder')
    slider = createSlider(0, 0.5, 0.25, 0.125)
    slider.input(slidertext)
    slider.parent(document.getElementById("slider"))
    let pg = createGraphics(windowWidth, windowHeight)
    space = new Space(pg);
    ea = new EA();
}

function slidertext (){
    let slidertext = document.getElementById("slidertext")
    let slidervalue = slider.value()
    if(slidervalue == 0){
        slidertext.textContent = "Delicate"
    } else if (slidervalue == 0.125) {
        slidertext.textContent = "Somewhat"
    } else if (slidervalue == 0.25) {
        slidertext.textContent = "Average"
    } else if (slidervalue == 0.375) {
        slidertext.textContent = "crazy"
    } else if (slidervalue == 0.5) {
        slidertext.textContent = "CRAZY"
    }
}

function draw(){
    clear()
    if(mouseInBounds()){
        highlightAliens()
    }

    for (let i = 0; i < ea.population.length; i++){
        let ind = ea.population[i]
        ind.draw()
    }

    space.draw()
}

function highlightAliens(){
    ID = -1
    for (let id = 0; id < ea.population.length; id++){
        if(Math.abs(mouseX - ea.population[id].body.pos.x) < 30 && Math.abs(mouseY - ea.population[id].body.pos.y) < 30){
            ID = id
        }
    }

    if(hoverID != ID){
        if(hoverID != -1){
            ea.population[hoverID].wiggle = false
        }
        hoverID = ID
        if(ID != -1){
            ea.population[ID].wiggle = true
        }
    }
    // ea.population[ID].wiggle = true
}

function drawSelectionBox(){
    noStroke()
    fill(60,60,60,100)
    rectX = 100 * int(mouseX / 100)
    rectY = 100 * int(mouseY / 100)
    rect(rectX, rectY, 100, 100)
    if(saving){
        fill(255)
        text('Save as PNG', rectX + 15, rectY + 90);
    }
}

function wiggleAliens(){
    xID = int(mouseX / 100)
    yID = int(mouseY / 100)
    newID = yID * 6 + xID
    if(newID < ea.population.length){
        ID = yID * 6 + xID
        if(hoverID != ID){
            if(hoverID != -1){
                ea.population[hoverID].wiggle = false
            }
            hoverID = ID
            ea.population[ID].counter = 0.5 * Math.PI
            ea.population[ID].wiggle = true
        }
    }
}

function mouseInBounds(){
    return (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)
}

function createNewPopulation(){
    ea.initPopulation()
}

function mutate(){
    ea.mutate()
}

function crossover(){
    ea.crossover()
}

function genotype(){
    console.log(ea.toString())
}

function mousePressed(){
    if(mouseInBounds() && hoverID != -1){
        if(!saving){
            ea.createNewPopulationFromIndividual(hoverID)
            hoverID = -1
        } else {
            console.log("save " + hoverID)
            clear()
            this.ea.population[hoverID].draw(true)
            let cropped = this.ea.population[hoverID].getCropped()
            save(cropped, "alien.png")
            saveAlien()
        }
    }
    // if(mouseInBounds() && hoverID != -1){
    //     let i = int(mouseY / 100) * 6 + int(mouseX / 100)
    //     if(!saving){
    //         ea.createNewPopulationFromIndividual(i)
    //         hoverID = -1
    //     } else {
    //         clear()
    //         this.ea.population[i].draw(true)
    //         rectX = 100 * int(mouseX / 100)
    //         rectY = 100 * int(mouseY / 100)
    //         let cropped = get(rectX, rectY, 100, 100)
    //         save(cropped, "alien.png")
    //         saveAlien()
    //     }
    // }
} 

function saveAlien(){
    let savebutton = document.getElementById("savebutton")
    savebutton.textContent = saving ? "Save as image" : "cancel"
    savebutton.style.backgroundColor = saving ? "#0071BC" : "red"
    saving = !saving
}

function randomInit(){
    crazyMode = !crazyMode
    document.getElementById("crazymode").textContent = crazyMode ? "Crazy mode: on" : "Crazy mode: off"
    this.ea.initPopulation()
}

