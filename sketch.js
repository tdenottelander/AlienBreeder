var ea = new EA();
var space;
console.log(ea.toString())
var saving = false;
var slider;

var hoverID = -1

function setup(){
    var width = 600;
    var height = 600;
    canvas = createCanvas(width, height);
    canvas.parent('CanvasHolder')
    slider = createSlider(0, 0.5, 0.25, 0.125)
    slider.input(slidertext)
    slider.parent(document.getElementById("slider"))
    let pg = createGraphics(windowWidth, windowHeight)
    space = new Space(pg);
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
    // background(20, 20, 20)
    clear()
    if(mouseInBounds()){
        drawSelectionBox()
        wiggleAliens()
    }

    for (let i = 0; i < ea.population.length; i++){
        let ind = ea.population[i]
        ind.draw()
    }

    space.draw()

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
        if(!saving){
            ea.createNewPopulationFromIndividual(i)
        } else {
            clear()
            this.ea.population[i].draw(true)
            rectX = 100 * int(mouseX / 100)
            rectY = 100 * int(mouseY / 100)
            let cropped = get(rectX, rectY, 100, 100)
            save(cropped, "alien.png")
        }
    }
} 

function saveAlien(){
    let savebutton = document.getElementById("savebutton")
    savebutton.textContent = saving ? "Save as image" : "cancel"
    savebutton.style.backgroundColor = saving ? "#0071BC" : "red"
    saving = !saving
}

