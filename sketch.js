var ea = new EA();
console.log(ea.toString())

function setup(){
    var width = 600;
    var height = 600;
    canvas = createCanvas(width, height);
    slider = createSlider(0, 0.5, 0.2, 0.01)
}

function draw(){
    background(255)
    drawSelectionBox()

    for (let i = 0; i < ea.population.length; i++){
        let ind = ea.population[i]
        ind.draw(i)
    }
}

function drawSelectionBox(){
    if(mouseInBounds()){
        noStroke()
        fill(240)
        rectX = 100 * int(mouseX / 100)
        rectY = 100 * int(mouseY / 100)
        rect(rectX, rectY, 100, 100)
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

