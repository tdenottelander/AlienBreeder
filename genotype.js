var crazyMode = false
class Genotype {

    constructor (){
        this.realGenotype = new Map()
        this.properties = ["headSize", "colorRed", "colorBlue", "colorGreen", "eyeSize", "eyeYPos", "eyePositioning", "armSpacing", "speed", "tailWiggleSpeed", "tailLength", "tailSegments", "numberOfTails"];
    
        this.discreteGenotypeLibrary = new Map()
        this.discreteGenotypeLibrary.set("mouth", 5)
        this.discreteGenotypeLibrary.set("armCount", 3)
        this.discreteGenotypeLibrary.set("eyeType", 3)
        this.discreteGenotype = new Map()

        if(crazyMode){
            this.randomInitialization()
        } else {
            this.customInitialization()
        }
        this.mutate()
    }

    randomInitialization(){
        for (let s of this.properties){
            this.realGenotype.set(s, Math.random())
        }
        for (let entry of this.discreteGenotypeLibrary.keys()){
            this.discreteGenotype.set(entry, Math.floor(Math.random() * this.discreteGenotypeLibrary.get(entry)))
        }
    }

    customInitialization(){
        for (let s of this.properties){
            this.realGenotype.set(s, 0)
        }
        this.realGenotype.set("colorRed", 0.5)
        this.realGenotype.set("colorBlue", 0.5)
        this.realGenotype.set("colorGreen", 0.5)

        for (let entry of this.discreteGenotypeLibrary.keys()){
            this.discreteGenotype.set(entry, 0)
        }
    }

    clone(){
        let gen = new Genotype()
        for(let entry of this.realGenotype){
            gen.realGenotype.set(entry[0], entry[1])
        }
        for(let entry of this.discreteGenotype){
            gen.discreteGenotype.set(entry[0], entry[1])
        }
        return gen
    }

    mutate(){
        for (let entry of this.realGenotype.keys()){
            if(Math.random() > 0.5){
                let value = this.realGenotype.get(entry) + (Math.random() * slider.value() - 0.5 * slider.value())
                this.realGenotype.set(entry, Math.max(Math.min(value, 1), 0))
            }
        }

        for (let entry of this.discreteGenotype.keys()){
            if(Math.random() > 0.80){
                let value = this.discreteGenotype.get(entry)
                let newValue = value
                while(newValue == value){
                    newValue = Math.floor(Math.random() * this.discreteGenotypeLibrary.get(entry))
                }
                this.discreteGenotype.set(entry, newValue)
            }
        }
        return this
    }

    crossover(other){
        for (let entry of this.realGenotype.keys()){
            if(Math.random() > 0.5){
                let thisValue = this.realGenotype.get(entry)
                let otherValue = other.realGenotype.get(entry)
                this.realGenotype.set(entry, otherValue)
                other.realGenotype.set(entry, thisValue)
            }
        }

        for (let entry of this.discreteGenotype.keys()){
            if(Math.random() > 0.5){
                let thisValue = this.discreteGenotype.get(entry)
                let otherValue = other.discreteGenotype.get(entry)
                this.discreteGenotype.set(entry, otherValue)
                other.discreteGenotype.set(entry, thisValue)
            }
        }
    }

    get(property){
        if(this.realGenotype.has(property)){
            return this.realGenotype.get(property)
        } else if (this.discreteGenotype.has(property)){
            return this.discreteGenotype.get(property)
        } else {
            throw console.error("There is no such property as [" + property + "]");
        }
    }

    toString(){
        return this.realGenotype
    }
}