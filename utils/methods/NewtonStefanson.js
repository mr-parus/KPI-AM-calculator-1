const {Newton} = require('./Newton');


class NewtonStefanson extends Newton {
    makeIteration (iterationData) {
        iterationData.previousValue = iterationData.currentValue;

        const previousValue = iterationData.previousValue,
            f = this.func.execute,
            fOfprew = f(previousValue);

        if (!isFinite(fOfprew)){
            throw new Error(`Received value is not finite (${fOfprew}). Try to change localization.`);
        }

        iterationData.currentValue =
            previousValue - fOfprew**2 / (f(previousValue + fOfprew) - fOfprew);

        iterationData.iterationIndex++;
    }
}

module.exports = {NewtonStefanson};


