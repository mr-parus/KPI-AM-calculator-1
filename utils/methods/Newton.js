const {Resolver} = require('./help/Resolver');


class Newton extends Resolver {

    get localizationIsNeeded () {
        return true;
    }

    getStartIterationData () {
        this.maxIterationsCount = 200;
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


        return{
            alpha,
            iterationIndex: 0,
            currentValue: startValue,
            firstDerivative: this.func.derivate
        }
    }


    stopCriterion (iterationData) {
        return Math.abs(/*iterationData.currentValue - iterationData.previousValue*/this.func.execute(iterationData.currentValue) ) > iterationData.stopCriterionValue;
    }

    calculateStopCriterionValue (iterationData) {
        iterationData.stopCriterionValue = iterationData.alpha * this.exactness;
    }


    makeIteration (iterationData) {
        iterationData.previousValue = iterationData.currentValue;

        const firstDerivativeOfX = iterationData.firstDerivative.execute(iterationData.previousValue),
            f = this.func.execute,
            previousValue = iterationData.previousValue,
            fOfprew = f(previousValue);

        if (!isFinite(fOfprew)){
            throw new Error(`Received value is not finite (${fOfprew}). Try to change localization.`);
        }

        if (firstDerivativeOfX === 0) {
            throw new Error(`On the ${iterationData.iterationIndex + 1} step: f'(xk)=f'(${iterationData.previousValue})= 0`);
        }


        iterationData.currentValue = previousValue - fOfprew / firstDerivativeOfX;

        iterationData.iterationIndex++;
    }

    logMapper (l) {
        return l.set('firstDerivative', l.get('firstDerivative').toString());
    }
}

module.exports = {Newton};


