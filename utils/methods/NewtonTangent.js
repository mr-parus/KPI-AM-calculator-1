const {Newton} = require('./Newton');
const {Resolver} = require('./help/Resolver');

class NewtonTangent extends Newton {


    makeIteration (iterationData) {
        if (iterationData.iterationIndex === 0) {
            return super.makeIteration(iterationData);
        }
        const previousValue = iterationData.previousValue,
            currentValue = iterationData.currentValue,
            f = this.func.execute;

        iterationData.previousValue = iterationData.currentValue;
        iterationData.currentValue = previousValue - f(previousValue)*(previousValue - currentValue)/
            (f(previousValue) - f(currentValue));

        console.log(JSON.stringify(iterationData));
        iterationData.iterationIndex++;
    }
}

module.exports = {NewtonTangent};


