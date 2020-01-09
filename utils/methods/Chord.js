const {Resolver} = require('./help/Resolver');

class Chord extends Resolver {

    get localizationIsNeeded () {
        return true;
    }


    getDeltaByIterationType (a) {
        const that = this;
        if (a === "b") {
            return function (iterationData) {
                const f = that.func.execute,
                    preValue = iterationData.previousValue;

                const nominator = f(preValue) * (that.loc.endPoint - preValue),
                    denominator = f(that.loc.endPoint) - f(preValue),
                    delta = nominator/denominator;

                if (!isFinite(delta)){
                    throw new Error(`Received value is not finite (${delta}). Try to change localization.`);
                }

                return delta;
            }
        }
        else {
            return function (iterationData) {
              const f = that.func.execute,
                  preValue = iterationData.previousValue;


              const nominator = f(preValue) * (preValue - that.loc.startPoint),
                  denominator = f(preValue) - f(that.loc.startPoint),
                  delta = nominator/denominator;

              if (!isFinite(delta)){
                  throw new Error(`Received value is not finite (${delta}). Try to change localization.`);
              }

              return delta;
          }
        }
    }

    getStartIterationData () {
        const firstDerevative = this.func.derivate,
            secondDerevative = firstDerevative.derivate,
            a = this.localization.startPoint,
            b = this.localization.endPoint,
            f = this.func.execute;

        if (firstDerevative.execute(a) === 0 || secondDerevative.execute(b) === 0)
            throw new Error('Start point of interval is wrong. f`(a) = 0 or f``(a) = 0  Try to change localization.');

        if (firstDerevative.execute(b) === 0 || secondDerevative.execute(b) === 0)
            throw new Error('End point of interval is wrong. f`(b) = 0 or f``(b) = 0  Try to change localization.');

        let startValue, currentValue;
        startValue = a  - f(a)*(b - a)/(f(b) - f(a)); //point where y = 0;

        if (Resolver.checkLocalizationCondition(this.func,startValue,a)){
            this.getDelta = this.getDeltaByIterationType('a');
            currentValue = b;
        } else  if (Resolver.checkLocalizationCondition(this.func,startValue, b)) {
            currentValue = a;
            this.getDelta = this.getDeltaByIterationType('b');
        }



        this.maxIterationsCount = 800;
        return {
            iterationIndex: 0,
            currentValue,
            startValue,
            // notMovingPoint,
            // condition:`f''(${notMLetter}) * f(${notMLetter}) > 0`,
            firstDerivative: firstDerevative.toString(),
            secondDerivative: secondDerevative.toString()
        }
    }



    makeIteration (iterationData) {
        iterationData.previousValue = iterationData.currentValue;

        const preValue = iterationData.previousValue,
            delta = this.getDelta(iterationData);

        iterationData.currentValue = preValue - delta;

        iterationData.delta = delta;
        ++iterationData.iterationIndex;
    }

    stopCriterion (iterationData) {
        return Math.abs(iterationData.delta) > iterationData.stopCriterionValue
    }
    calculateStopCriterionValue (iterationData) {
        iterationData.stopCriterionValue =  this.exactness;
    }
}

module.exports = {Chord};





