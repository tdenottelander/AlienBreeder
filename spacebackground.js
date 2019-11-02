class Space {
    points = []
    numPoints = 50
    origin = [this.width/2, 0]
    lineLength = 50
    maxSpeed = 3
    pg;

    constructor(pg){
        this.pg = pg
        pg.parent(document.getElementById("bg"))
        pg.style('display', 'initial')
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.points = []
        for (let i = 0; i < this.numPoints; i++){
            this.points.push([Math.random() * this.width, Math.random() * (this.height + this.lineLength), Math.random() * this.maxSpeed + 1])
        }
    }

    draw(){
        this.pg.background(20)
        this.pg.stroke(200)
        this.pg.strokeWeight(0.1)
        for(let i = 0; i < this.numPoints; i++){
            let point = this.points[i]
            point[1] -= point[2]
            if(this.outOfBounds(point)){
                this.points[i] = [Math.random() * this.width, this.height, point[2]]
            }
            this.pg.line(point[0], point[1], point[0], point[1] + this.lineLength)
        }
    }

    outOfBounds(point){
        return point[1] + this.lineLength < 0
    }
}