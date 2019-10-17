class Individual{

    constructor(id){
        this.id = id
        this.genotype = new Genotype()
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

    draw(){
        let x = (this.id % 6) * 100 + 50
        let y = int(this.id / 6) * 100 + 50

        this.rgb = [this.get("colorRed") * 255, this.get("colorBlue") * 255, this.get("colorGreen") * 255]

        // Draw body
        fill(this.rgb)
        noStroke()
        let headSize = this.get("headSize") * 50 + 20
        circle(x, y, headSize)

        // Draw arms
        this.drawArms(x, y, headSize)

        // Draw mouth
        this.drawMouth(x, y, this.get("mouth"))

        // Draw eyes
        this.drawEyes(x, y, headSize)

        
    }

    drawEyes(x, y, headSize){
        noStroke()
        let eyePositioning = 0.025 * headSize * this.get("eyePositioning") * 10 + 5
        let eyeLX = x - eyePositioning
        let eyeRX = x + eyePositioning
        let eyeY = y + this.get("eyeYPos") * 10 - 5
        let eyeSize = 0.001 * headSize + this.get("eyeSize") * 10 + 5
        let pupilSize = this.get("eyeSize") * 5 + 2.5

        let eyeType = this.get("eyeType")
        if(eyeType == 0){
            fill(this.rgb)
            circle(eyeLX, eyeY, eyeSize * 1.2)
            circle(eyeRX, eyeY, eyeSize * 1.2)
            fill(255)
            circle(eyeLX, eyeY, eyeSize)
            circle(eyeRX, eyeY, eyeSize)
            fill(0)
            circle(eyeLX, eyeY, pupilSize)
            circle(eyeRX, eyeY, pupilSize)
        } else if (eyeType == 1) {
            fill(this.rgb)
            rect(eyeLX - 0.6 * eyeSize, eyeY - 0.6 * eyeSize, 1.2 * eyeSize, 1.2 * eyeSize)
            rect(eyeRX - 0.6 * eyeSize, eyeY - 0.6 * eyeSize, 1.2 * eyeSize, 1.2 * eyeSize)
            fill(255)
            rect(eyeLX - 0.5 * eyeSize, eyeY - 0.5 * eyeSize, eyeSize, eyeSize)
            rect(eyeRX - 0.5 * eyeSize, eyeY - 0.5 * eyeSize, eyeSize, eyeSize)
            fill(0)
            rect(eyeLX - 0.5 * pupilSize, eyeY - 0.5 * pupilSize, pupilSize, pupilSize)
            rect(eyeRX - 0.5 * pupilSize, eyeY - 0.5 * pupilSize, pupilSize, pupilSize)
        } else if (eyeType == 2) {
            fill(0)
            circle(eyeLX, eyeY, eyeSize * 1.2)
            circle(eyeRX, eyeY, eyeSize * 1.2)
        }
        
    }

    drawArms(x, y, bodySize){
        let armCount = this.get("armCount")
        let armSpacing = this.get("armSpacing")
        for (let i = 0; i < armCount + 1; i++){
            // fill(i == 0 ? "red" : "green")
            let newX = x - bodySize / 3
            let newY = y + bodySize / 5
            this.drawTransformedEllipse(x - bodySize/3, y + bodySize/10 - i * 5, PI/3 + i * armSpacing * PI/6, 7, bodySize / 1.5)
            this.drawTransformedEllipse(x + bodySize/3, y + bodySize/10 - i * 5, PI/6 - i * armSpacing * PI/6, bodySize / 1.5, 7)
        }
    }

    drawTransformedEllipse(x, y, r, rx, ry){
        translate(x, y);
        rotate(r);
        ellipse(0, 0, rx, ry)
        rotate(-r)
        translate(-x, -y)
    }

    drawMouth(x, y, mouthType){
        if(mouthType == 0){
            fill(0)
            noStroke()
            let mouthY = y + 5
            arc(x, mouthY, 10, 10, 0, PI)
        } else if (mouthType == 1){
            fill(0)
            noStroke()
            let mouthY = y + 5
            circle(x, mouthY, 5, 5)
        } else if (mouthType == 2){
            noFill();
            stroke(0);
            beginShape();
            vertex(x - 4.5, y + 4.5)
            vertex(x - 3, y + 3)
            vertex(x - 1.5, y + 4.5)
            vertex(x, y + 3)
            vertex(x + 1.5, y + 4.5)
            vertex(x + 3, y + 3)
            vertex(x + 4.5, y + 4.5)
            endShape();
        } else if (mouthType == 3){
            let headSize = this.get("headSize")
            let multiplier = 1 + headSize * 1.1;
            let offset = 5 + 10 * headSize
            fill(this.get("colorRed") * 255, this.get("colorBlue") * 255, this.get("colorGreen") * 255)
            stroke(0)
            beginShape()
            vertex(x - 2 * multiplier, y + offset + 0 * multiplier)
            vertex(x - 2 * multiplier, y + offset + 7 * multiplier)
            vertex(x - 4 * multiplier, y + offset + 9 * multiplier)
            vertex(x - 4 * multiplier, y + offset + 11 * multiplier)
            vertex(x + 4 * multiplier, y + offset + 11 * multiplier)
            vertex(x + 4 * multiplier, y + offset + 9 * multiplier)
            vertex(x + 2 * multiplier, y + offset + 7 * multiplier)
            vertex(x + 2 * multiplier, y + offset + 0 * multiplier)
            endShape()
        }
    }
}