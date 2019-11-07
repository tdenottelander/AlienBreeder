class Individual{

    wiggle = false
    wiggleFactor = 0.2
    counter = 0
    counterIncrease = Math.PI / 20;
    wiggleOffset = 0
    colorOffset = 50

    constructor(id){
        this.id = id
        this.genotype = new Genotype()
        this.body = new Body()
    }

    crossover(other){
        this.genotype.crossover(other.genotype)
    }

    mutate(){
        this.genotype.mutate()
        return this
    }

    clone(id){
        let newIndividual = new Individual(id)
        newIndividual.genotype = this.genotype.clone()
        return newIndividual
    }

    get(property){
        return this.genotype.get(property)
    }

    draw(save = false){
        this.body.update()

        let offset = this.getWiggleOffset()
        
        translate(this.body.pos.x + offset.x, this.body.pos.y + offset.y)
        rotate(this.body.direction.heading() + Math.PI * 0.5)

        if(this.wiggle){
            this.drawHighlight()
        }

        this.rgb = [this.getColor("Red"), this.getColor("Blue"), this.getColor("Green")]

        // Draw body
        fill(this.rgb)
        noStroke()
        this.bodySize = (this.get("headSize") * 50 + 20)
        // circle(0, 0, headSize)
        this.drawBody()
        this.drawTail()

        // Draw arms
        this.drawArms()

        // Draw mouth
        this.drawMouth()

        // Draw eyes
        this.drawEyes(save)

        resetMatrix();
    }

    getWiggleOffset(){
        this.counter += this.counterIncrease
        this.counter = this.counter % (2 * Math.PI)
        this.wiggleOffset = this.wiggleFactor * 0.1 * (4 - 3 * this.get("headSize")) * Math.sin(this.counter + Math.PI/2)
        let unitX = createVector(1,0)
        let unitY = createVector(0,1)
        let rotatedDir = createVector(this.body.direction.x, this.body.direction.y).rotate(0.5 * Math.PI)
        let x = this.wiggleOffset * p5.Vector.dot(rotatedDir, unitX) * 50
        let y = this.wiggleOffset * p5.Vector.dot(rotatedDir, unitY) * 50
        return createVector(x, y)
    }

    drawTail(){
        this.body.tail.draw(0,0,this.bodySize)
    }

    drawBody(outline){
        if(outline == null) outline = 0
        // let headSize = (this.get("headSize") * 50 + 20) + outline
        circle(0, 0, this.bodySize + outline)
    }

    drawEyes(save){
        noStroke()
        let headSize = (this.get("headSize") * 50 + 20)
        let eyePositioning = 0.025 * headSize * this.get("eyePositioning") * 10 + 5
        let eyeLX = -eyePositioning
        let eyeRX = eyePositioning
        let eyeY = this.get("eyeYPos") * 10 - 5
        let eyeSize = 0.001 * headSize + this.get("eyeSize") * 10 + 5
        let pupilSize = this.get("eyeSize") * 5 + 2.5
        let pupilLX = save ? eyeLX : eyeLX + this.getPupilOffset(eyeLX, 'x', pupilSize)
        let pupilRX = save ? eyeRX : eyeRX + this.getPupilOffset(eyeRX, 'x', pupilSize)
        let pupilY = save ? eyeY : eyeY + this.getPupilOffset(eyeY, 'y', pupilSize)

        let eyeType = this.get("eyeType")
        if(eyeType == 0){
            fill(this.rgb)
            circle(eyeLX, eyeY, eyeSize * 1.2)
            circle(eyeRX, eyeY, eyeSize * 1.2)
            fill(255)
            circle(eyeLX, eyeY, eyeSize)
            circle(eyeRX, eyeY, eyeSize)
            fill(0)
            circle(pupilLX, pupilY, pupilSize)
            circle(pupilRX, pupilY, pupilSize)
        } else if (eyeType == 1) {
            fill(this.rgb)
            rect(eyeLX - 0.6 * eyeSize, eyeY - 0.6 * eyeSize, 1.2 * eyeSize, 1.2 * eyeSize)
            rect(eyeRX - 0.6 * eyeSize, eyeY - 0.6 * eyeSize, 1.2 * eyeSize, 1.2 * eyeSize)
            fill(255)
            rect(eyeLX - 0.5 * eyeSize, eyeY - 0.5 * eyeSize, eyeSize, eyeSize)
            rect(eyeRX - 0.5 * eyeSize, eyeY - 0.5 * eyeSize, eyeSize, eyeSize)
            fill(0)
            rect(pupilLX - 0.5 * pupilSize, pupilY - 0.5 * pupilSize, pupilSize, pupilSize)
            rect(pupilRX - 0.5 * pupilSize, pupilY - 0.5 * pupilSize, pupilSize, pupilSize)
        } else if (eyeType == 2) {
            fill(0)
            circle(eyeLX, eyeY, eyeSize * 1.2)
            circle(eyeRX, eyeY, eyeSize * 1.2)
        }
        
    }

    getPupilOffset(position, type, pupilSize){
        let offset = 0
        if(type == 'x'){
            offset = mouseX - position
        } else if(type == 'y'){
            offset = mouseY - position
        }
        offset = offset * 0.0025 * pupilSize
        return Math.max(Math.min(offset, pupilSize * 0.2), -pupilSize * 0.2)
        return offset
    }

    drawArms(outline){
        noStroke()
        let bodySize = this.get("headSize") * 50 + 20
        if(outline == null){
            outline = 0
        }
        let armCount = this.get("armCount")
        let armSpacing = this.get("armSpacing")
        for (let i = 0; i < armCount + 1; i++){
            // fill(i == 0 ? "red" : "green")
            let x = bodySize / 3
            let y = bodySize / 10
            this.drawTransformedEllipse(-x, y - i * 5, PI/3 + i * armSpacing * PI/6, 7, bodySize / 1.5, outline)
            this.drawTransformedEllipse(x, y - i * 5, PI/6 - i * armSpacing * PI/6, bodySize / 1.5, 7, outline)
        }
    }

    drawTransformedEllipse(x, y, r, rx, ry, outline){
        translate(x, y);
        rotate(r);
        ellipse(0, 0, rx + outline, ry + outline)
        rotate(-r)
        translate(-x, -y)
    }

    drawMouth(){
        let mouthType = this.get("mouth")
        if(mouthType == 0){
            fill(0)
            noStroke()
            let mouthY = 5
            arc(0, mouthY, 10, 10, 0, PI)
        } else if (mouthType == 1){
            fill(0)
            noStroke()
            let mouthY = 5
            circle(0, mouthY, 5, 5)
        } else if (mouthType == 2){
            noFill();
            stroke(0);
            strokeWeight(1);
            beginShape();
            vertex(-4.5, 4.5)
            vertex(-3, 3)
            vertex(-1.5, 4.5)
            vertex(0, 3)
            vertex(1.5, 4.5)
            vertex(3, 3)
            vertex(4.5, 4.5)
            endShape();
        } else if (mouthType == 3){
            let headSize = this.get("headSize")
            let mult = 1 + headSize * 1.1;
            let offset = 5 + 10 * headSize
            fill(this.getColor("Red"), this.getColor("Blue"), this.getColor("Green"))
            stroke(0)
            strokeWeight(1);
            beginShape()
            vertex(-2 * mult, offset + 0 * mult)
            vertex(-2 * mult, offset + 7 * mult)
            vertex(-4 * mult, offset + 9 * mult)
            vertex(-4 * mult, offset + 11 * mult)
            vertex(4 * mult, offset + 11 * mult)
            vertex(4 * mult, offset + 9 * mult)
            vertex(2 * mult, offset + 7 * mult)
            vertex(2 * mult, offset + 0 * mult)
            endShape()
        }
    }

    drawHighlight(){
        fill("white")
        let outline = 5
        this.drawBody(outline)
        this.drawArms(outline)
    }

    getColor(color){
        return this.get("color"+color) * (255 - this.colorOffset) + this.colorOffset
    }
}

var tailDepth = 5
var speed = 1
class Body {
    constructor(){
        this.pos = this.randomVector()
        this.target = this.randomVector()
        this.speed = speed
        this.direction = p5.Vector.sub(this.target, this.pos).normalize()
        this.velocity = p5.Vector.mult(this.direction, this.speed)
        this.tail = new Tail(tailDepth)
    }

    update(){
        if(p5.Vector.sub(this.pos, this.target).magSq() < 5){
            this.target = this.randomVector()
            this.direction = p5.Vector.sub(this.target, this.pos).normalize()
            this.velocity = p5.Vector.mult(this.direction, this.speed)
        } 
        this.pos = this.pos.add(this.velocity)
        this.tail.update()
    }

    randomVector(){
        let x = 10 + Math.random() * (width - 20)
        let y = 10 + Math.random() * (height - 20)
        return createVector(x, y)
    }
}

var wiggleSpeed = 0.06
var maxTailAngle = 0.05 * Math.PI
class Tail {
    constructor(maxLevel, level, counter){
        if(level == null){
            this.level = 0
        } else {
            this.level = level
        }
        this.counterIncrease = Math.PI * wiggleSpeed;
        if(counter == null){
            this.counter = Math.random() * 2 * Math.PI 
        } else {
            this.counter = counter + this.level * 0 * this.counterIncrease
        }
        this.maxLevel = maxLevel
        this.angle = 0
        this.maxAngle = maxTailAngle
        // console.log("Created tail with level " + this.level)
        if(this.level != maxLevel){
            this.tail = new Tail(maxLevel, this.level+1, this.counter)
        }
    }

    update(){
        this.counter = (this.counter + this.counterIncrease) % (2 * Math.PI)
        this.angle = this.maxAngle * Math.sin(this.counter) + 0.5 * Math.PI
        if(this.tail != null) this.tail.update()
    }

    draw(x, y, bodySize){
        let pos = p5.Vector.fromAngle(this.angle, bodySize * 0.2)

        noStroke()

        line(0, 0, pos.x, pos.y)
        let size = (3 - ((this.level + 1) / (this.maxLevel+1) * 2)) * 0.2 * bodySize
        circle(pos.x, pos.y, size)
        if(this.tail != null){
            push()
            translate(pos.x, pos.y)
            rotate(this.angle - 0.5 * Math.PI)
            this.tail.draw(pos.x, pos.y, bodySize)
            pop()
        }
    }
}

