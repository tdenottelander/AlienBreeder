class EA {
    constructor (){
        this.popSize = 30
        this.initPopulation()
    }


    initPopulation(){
        this.population = [];
        for(let id = 0; id < this.popSize; id++){
            this.population.push(new Individual(id))
        }
    }

    toString(){
        return this.population
    }

    mutate(){
        for(let p of this.population){
            p.mutate()
        }
    }

    crossover(type){
        if(type == "paired"){
            for(let id = 0; id < this.population.length; id+=2){
                ea.population[id].crossover(ea.population[id+1])
            }
        } else {
            let idx = [this.popSize]
            for(let i = 0; i < this.popSize; i++){
                idx[i] = i
            }
            idx = shuffle(idx)
        
            for(let id = 0; id < this.popSize; id+=2){
                ea.population[idx[id]].crossover(ea.population[idx[id+1]])
            }
        }
    }

    createNewPopulationFromIndividual(i){
        let individual = this.population[i]
        this.population = [];
        for (let id = 0; id < this.popSize; id++){
            this.population.push(individual.clone(id).mutate())
        }
    }
}


