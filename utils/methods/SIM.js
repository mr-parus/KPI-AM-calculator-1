const {Resolver, Interval} = require('./help/Resolver');
const {SimpleFunction} = require('./help/Function');
const {Map} = require('immutable');

/**
 *  X(k+1) = X(k) - λf(X(k))
 */
class SIM extends Resolver {

    get localizationIsNeeded () {
        return true;
    }

    getStartIterationData () {
        this.maxIterationsCount = 1000;
        const firstDerivateFunction = this.func.derivate;

        const derivatives = [firstDerivateFunction.execute(this.localization.startPoint),
            firstDerivateFunction.execute(this.localization.endPoint)];


        const gamma = Math.max(...derivatives),
            alpha = Math.min(...derivatives),
            lambda = 2 / (gamma + alpha),
            q =  Math.abs((gamma - alpha) / (gamma + alpha));

        if (q >= 1)
            throw new Error('q >= 1');
        // if (alpha <= 0)
        //     throw new Error('alpha <= 0');



        return {
            iterationIndex: 0,
            q,
            lambda,
            alpha,
            gamma,
            localization: this.localization.copy,
            currentValue: this.localization.endPoint,
            previousValue: this.localization.startPoint
        };
    }

    // getIterationsCount
    stopCriterion (iterationData) {
        return Math.abs(iterationData.currentValue - iterationData.previousValue) > iterationData.stopCriterionValue;
    }

    calculateStopCriterionValue (iterationData) {
        iterationData.stopCriterionValue = this.getExitCriterionValue(iterationData);
    }

    getExitCriterionValue (iterationData) {
        const q = iterationData.q;
        return Math.abs((1-q) * this.exactness / q);
    }



    makeIteration (iterationData) {
        iterationData.previousValue = iterationData.currentValue;
        iterationData.currentValue = iterationData.previousValue -  iterationData.lambda * this.func.execute(iterationData.previousValue);
        iterationData.iterationIndex++;
    }
}

module.exports = {SIM};



// TEST

// const s = new SIM();
// s.localization = new Interval(1,2);
// const func = new SimpleFunction('f(x) = 0.4 * x^3 + 3 - 7*sin(2*x)');
// s.func = func;
// console.log(s.findRoot());

