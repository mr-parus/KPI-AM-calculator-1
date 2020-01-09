const {Newton} = require('./Newton');
const {Resolver} = require('./help/Resolver');


class NewtonSimple extends Newton {

    getStartIterationData () {
        this.maxIterationsCount = 2000;
        const firstDerivativeFunction = this.func.derivate;

        const derivativesModules = [Math.abs(firstDerivativeFunction.execute(this.localization.startPoint)),
            Math.abs(firstDerivativeFunction.execute(this.localization.endPoint))];

        const alpha = Math.min(...derivativesModules);

        let startValue;

        if (Resolver.checkFourierCondition(this.func, this.localization.startPoint)) {
            startValue = this.localization.startPoint;
        } else  if (Resolver.checkFourierCondition(this.func, this.localization.endPoint)) {
            startValue = this.localization.endPoint;
        }  else
            throw Resolver.error(3);


        const firstDerivativeOfX0 = this.func.derivate.execute(startValue);

        if (firstDerivativeOfX0 === 0) {
            throw new Error(`f'(x0) = f'(${startValue}) = 0`);
        }


        return{
            alpha,
            firstDerivativeOfX0,
            firstDerivative: this.func.derivate,
            iterationIndex: 0,
            currentValue: startValue,
        }
    }

    makeIteration (iterationData) {
        iterationData.previousValue = iterationData.currentValue;

        const f = this.func.execute,
            previousValue = iterationData.previousValue,
            fOfprew = f(previousValue);

        if (!isFinite(fOfprew)) {
            throw new Error(`Received value is not finite (${fOfprew}). Try to change localization.`);
        }


        iterationData.currentValue = previousValue - fOfprew / iterationData.firstDerivativeOfX0;
        iterationData.iterationIndex++;
    }

}

module.exports = {NewtonSimple};


