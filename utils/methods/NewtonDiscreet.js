const {Newton} = require('./Newton');
const {Resolver} = require('./help/Resolver');
const {SimpleFunction} = require('./help/Function');


class NewtonDiscreet extends Newton {

    getStartIterationData () {
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
            hk: (() => {
                let x0 = 1/8;
                return () => {
                    x0 *=  1/2;
                    return x0;
                }
            })()
            ,
            hkValue:0.0625,
            iterationIndex: 0,
            currentValue: startValue,
            firstDerivative: this.func.derivate
        }
    }



    makeIteration (iterationData) {
        iterationData.previousValue = iterationData.currentValue;
        const hk = iterationData.hk(),
            previousValue = iterationData.previousValue,
            f = this.func.execute,
            fOfprew = f(previousValue);

        if (!isFinite(fOfprew)) {
            throw new Error(`Received value is not finite (${fOfprew}). Try to change localization.`);
        }


        iterationData.hkValue = hk;
        iterationData.currentValue =
            previousValue - fOfprew*hk / (f(previousValue + hk) - f(previousValue));

        iterationData.iterationIndex++;
    }
}

module.exports = {NewtonDiscreet};



