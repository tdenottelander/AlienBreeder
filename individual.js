class Individual{

    wiggle = false
    wiggleFactor = 0.2
    counter = 0
    counterIncrease;
    wiggleOffset = 0
    colorOffset = 50

    constructor(id){
        this.id = id
        this.genotype = new Genotype()
        this.refresh()
    }

    crossover(other){
        this.genotype.crossover(other.genotype)
    }

    mutate(){
        this.genotype.mutate()
        this.refresh()
        return this
    }

    refresh(){
        this.body = new Body(this.genotype)
        this.counterIncrease = Math.PI / 10 * this.genotype.get("tailWiggleSpeed")
        this.counter = Math.random() * Math.PI * 2
    }

    clone(id){
        let newIndividual = new Individual(id)
        newIndividual.genotype = this.genotype.clone()
        newIndividual.refresh()
        return newIndividual
    }

    get(property){
        return this.genotype.get(property)
    }

    draw(save = false){
        this.body.update()

        let offset = this.getWiggleOffset()
        
        if(!save){
            translate(this.body.pos.x + offset.x, this.body.pos.y + offset.y)
            rotate(this.body.direction.heading() + Math.PI * 0.5)
            if(this.wiggle){
                this.drawHighlight()
            }
        } else {
            background(0)
            translate(200, 200)
        }



        this.rgb = [this.getColor("Red"), this.getColor("Blue"), this.getColor("Green")]

        // Draw horns
        this.drawHorns()

        // Draw body
        fill(this.rgb)
        noStroke()
        this.bodySize = (this.get("headSize") * 50 + 20)
        this.drawBody()
        this.drawTail(save)

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

    drawTail(save){
        this.body.drawTails(save, this.bodySize, this.get("tailLength"))
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
        } else if (eyeType == 3) {
            fill(255)
            circle(0, eyeY * 3, eyeSize * 1.5)
            fill(0)
            circle(0, eyeY * 3, pupilSize * 1.5)
        } else if (eyeType == 4){
            let newEyeY = eyeY - 30
            fill(this.rgb)
            circle(eyeLX, newEyeY, eyeSize * 1.4)
            circle(eyeRX, newEyeY, eyeSize * 1.4)
            stroke(this.rgb)
            strokeWeight(5)
            line(0,0,eyeLX, newEyeY)
            line(0,0,eyeRX, newEyeY)
            noStroke()
            fill(255)
            circle(eyeLX, newEyeY, eyeSize)
            circle(eyeRX, newEyeY, eyeSize)
            fill(0)
            circle(eyeLX, newEyeY, pupilSize)
            circle(eyeRX, newEyeY, pupilSize)
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

    drawHorns(){
        let hornType = this.get("hornType")
        let size = this.get("headSize")
        if(hornType == 0){
            function drawHorn(direction){
                beginShape()
                //Clockwise shape (as seen from perspective of left horn)
                vertex(direction * (5 + size * 10), -(10 + size * 20)) //First vertex head
                vertex(direction * (5 + size * 20), -(10 + size * 5)) //Second vertex head
                vertex(direction * (5 + size * 35), -(10 + size * 35)) //First vertex top
                vertex(direction * (5 + size * 30), -(10 + size * 40)) //Second vertex top
                endShape()
            }
            fill(this.rgb)
            drawHorn(1)
            drawHorn(-1)
        } else if (hornType == 1){
            //No horns
        } else if (hornType == 2){
            //Bubble
            fill(this.rgb)
            circle(0, -size * 30, 20 + size * 20)
        } else if (hornType == 3){
            //Arrowhead
            let length = 10 + size * 30
            // let length = 30
            fill(this.rgb)
            beginShape()
            vertex(-10, 0)
            vertex(-10, -length)
            vertex(-16, -length)
            vertex(-18, -(length + 4))
            vertex(0, -(length + 10))
            vertex(18, -(length + 4))
            vertex(16, -length)
            vertex(10, -length)
            vertex(10, 0)
            endShape()
        }
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

        } else if(mouthType == 1){
            fill(0)
            noStroke()
            let mouthY = 5
            arc(0, mouthY, 10, 10, 0, PI)
        } else if (mouthType == 2){
            fill(0)
            noStroke()
            let mouthY = 5
            circle(0, mouthY, 5, 5)
        } else if (mouthType == 3){
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
        } else if (mouthType == 4){
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

    getCropped(){
        let width = 10 + this.bodySize * 1.8
        let tailLength = this.get("tailLength") * this.get("tailSegments") * 10
        let height = (this.bodySize * 0.4 + tailLength * 4) * 5
        let heightOffset = 0.5 - (tailLength * 5 / height)
        return get(200 - 0.5 * width, 200 - heightOffset * height, width, height)
    }
}

var maxTailDepth = 10
var maxSpeed = 2
var minSpeed = 0.5
var accelerationForce = 0.07
var minTailsSpreadAngle = 0.01 * Math.PI
var maxTailsSpreadAngle = 0.6 * Math.PI
var maxTails = 5
class Body {
    constructor(genotype){
        this.pos = this.randomVector()
        this.target = this.randomVector()
        this.speed = interpolate(minSpeed, maxSpeed, genotype.get("speed"))
        this.direction = p5.Vector.sub(this.target, this.pos).normalize()
        this.velocity = p5.Vector.mult(this.direction, this.speed)
        this.acceleration = createVector(0,0)
        this.tails = []
        let spreadAngle = interpolate(minTailsSpreadAngle, maxTailsSpreadAngle, genotype.get("tailAngle"))
        let tailsAmount = Math.floor(genotype.get("numberOfTails") * maxTails)
        for(let i = 0; i < tailsAmount; i++){
            let tail = new Tail(
                Math.floor(maxTailDepth * genotype.get("tailSegments")), 
                genotype
            )
            tail.rotation = interpolate(-spreadAngle, spreadAngle, i / (tailsAmount-1))
            this.tails.push(tail)
        }
    }

    update(){
        if(p5.Vector.sub(this.pos, this.target).magSq() < 500){
            this.target = this.randomVector()
        } 
        this.acceleration = p5.Vector.sub(this.target, this.pos).normalize().mult(accelerationForce)
        this.direction.add(this.acceleration).normalize()
        line(this.pos.x, this.pos.y, this.pos.x + this.acceleration.x * 30, this.pos.y + this.acceleration.y * 30)
        this.velocity = p5.Vector.mult(this.direction, this.speed)
        this.pos = this.pos.add(this.velocity)
        for(let tail of this.tails){
            tail.update()
        }
    }

    randomVector(){
        let x = 20 + Math.random() * (width - 40)
        let y = 20 + Math.random() * (height - 40)
        return createVector(x, y)
    }

    drawTails(save, bodysize, tailLength){
        for(let i = 0; i < this.tails.length; i++){
            push()
            if(this.tails.length > 1){
                rotate(this.tails[i].rotation)
            }
            if(save){
                this.tails[i].drawStraight(bodysize, tailLength)
            } else {
                this.tails[i].draw(bodysize, tailLength)
            }
            pop()
        }
    }
}

var maxWiggleSpeed = 0.08
var minWiggleSpeed = 0.02
var maxTailAngle = 0.05 * Math.PI
class Tail {
    constructor(maxLevel, genotype, level, counter){
        if(level == null){
            this.level = 0
        } else {
            this.level = level
        }
        this.rotation;
        this.counterIncrease = Math.PI * interpolate(minWiggleSpeed, maxWiggleSpeed, genotype.get("tailWiggleSpeed"))
        if(counter == null){
            let tailWiggleStyle = genotype.get("tailWiggleStyle1")
            if(tailWiggleStyle == 0){
                this.counter = 0
            } else if(tailWiggleStyle == 1) {
                this.counter = Math.random() * 2 * Math.PI 
            } 
        } else {
            let tailWiggleStyle2 = genotype.get("tailWiggleStyle2")
            if(tailWiggleStyle2 == 0){
                this.counter = counter
            } else if (tailWiggleStyle2 == 1){
                this.counter = counter + this.level * 10 * this.counterIncrease
            }
        }
        this.maxLevel = maxLevel
        this.angle = 0
        this.maxAngle = maxTailAngle
        // console.log("Created tail with level " + this.level)
        if(this.level != maxLevel){
            this.tail = new Tail(maxLevel, genotype, this.level+1, this.counter)
        }
    }

    update(){
        this.counter = (this.counter + this.counterIncrease) % (2 * Math.PI)
        this.angle = this.maxAngle * Math.sin(this.counter) + 0.5 * Math.PI
        if(this.tail != null) this.tail.update()
    }

    draw(bodySize, tailLength){
        let pos = p5.Vector.fromAngle(this.angle, bodySize * tailLength * 0.4)
        let size = (3 - ((this.level + 1) / (this.maxLevel+1) * 2)) * 0.2 * bodySize
        circle(pos.x, pos.y, size)
        if(this.tail != null){
            push()
            translate(pos.x, pos.y)
            rotate(this.angle - 0.5 * Math.PI)
            this.tail.draw(bodySize, tailLength)
            pop()
        }
    }

    drawStraight(bodySize, tailLength){
        let pos = createVector(0, bodySize * tailLength * 0.4)
        let size = (3 - ((this.level + 1) / (this.maxLevel+1) * 2)) * 0.2 * bodySize
        circle(pos.x, pos.y, size)
        console.log("drawing straigth")
        if(this.tail != null){
            push()
            translate(pos.x, pos.y)
            this.tail.drawStraight(bodySize, tailLength)
            pop()
        }
    }
}

function interpolate(min, max, value){
    return min + value * (max - min)
}

