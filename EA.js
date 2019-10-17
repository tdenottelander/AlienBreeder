class EA {
    constructor (){
        this.popSize = 36
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

    crossover(){
        for(let id = 0; id < this.population.length; id+=2){
            ea.population[id].crossover(ea.population[id+1])
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


