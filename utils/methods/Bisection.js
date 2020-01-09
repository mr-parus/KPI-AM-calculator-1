const {Resolver, Interval} = require('./help/Resolver');

const mathjs = require('mathjs');

/**
 *
 *  X(k+1) =  |b-a|/2^k
 *
 */
class Bisection extends Resolver {

    get localizationIsNeeded() {
        return true;
    }

    getStartIterationData () {
        this.maxIterationsCount = 200;
        return {
            iterationIndex: 0,
            iterationsCount : this.getIterationsCount(),
            localization: this.localization.copy,
            previousValue: this.localization.startPoint,
            currentValue: this.localization.endPoint,
        };
    }

    /**
     *  |b-a|/2^k
     */
    calculateStopCriterionValue (iterationData) {
        iterationData.stopCriterionValue = this.getExitCriterionValue();
    }

    getExitCriterionValue () {
        return this.localization.size / 2**this.getIterationsCount();
    }

    /**
     *  log2(|b-a|/E) = k
     */
    getIterationsCount () {
        if (!isFinite(this.exactness) || !this.localization)
            Resolver.error(2);

        return Math.ceil(Math.log2(this.loc.size / this.e));
    }

    stopCriterion (iterationData) {
        return Math.abs(iterationData.currentValue - iterationData.previousValue) > iterationData.stopCriterionValue;
    }


    makeIteration (iterationData) {
        iterationData.localization = iterationData.localization.copy;
        const currentValue = iterationData.localization.middlePoint;


        if (Resolver.checkLocalizationCondition(this.func, currentValue, iterationData.localization.startPoint)) {
            iterationData.localization.endPoint = currentValue;
        } else {
            iterationData.localization.startPoint = currentValue;
        }

        iterationData.previousValue = iterationData.currentValue;
        iterationData.currentValue = currentValue;
        iterationData.iterationIndex++;
    }
}

module.exports = {Bisection};



//TEST
//
// const {f2} = require('../services/functions');
// const {SimpleFunction} = require('./help/Function');
// const s = new Bisection();
// s.localization = new Interval(1,2);
// const f = new SimpleFunction('x^3 + 3*x^2 - 3*x - 2*sin(x) - 3');
// s.func = f;
//
// console.log(s.findRoot());
