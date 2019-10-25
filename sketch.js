var ea = new EA();
console.log(ea.toString())

var hoverID = -1

function setup(){
    var width = 600;
    var height = 600;
    canvas = createCanvas(width, height);
    slider = createSlider(0, 0.5, 0.2, 0.01)
}

function draw(){
    background(255)
    if(mouseInBounds()){
        drawSelectionBox()
        wiggleAliens()
    }

    for (let i = 0; i < ea.population.length; i++){
        let ind = ea.population[i]
        ind.draw(i)
    }
}

function drawSelectionBox(){
    noStroke()
    fill(240)
    rectX = 100 * int(mouseX / 100)
    rectY = 100 * int(mouseY / 100)
    rect(rectX, rectY, 100, 100)
}

function wiggleAliens(){
    xID = int(mouseX / 100)
    yID = int(mouseY / 100)
    ID = yID * 6 + xID
    if(hoverID != ID){
        if(hoverID != -1){
            ea.population[hoverID].wiggle = false
        }
        hoverID = ID
        ea.population[ID].wiggle = true
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
    if(mouseInBounds()){
        let i = int(mouseY / 100) * 6 + int(mouseX / 100)
        ea.createNewPopulationFromIndividual(i)
    }
}

