const {Resolver} = require('./help/Resolver');


class Combine extends Resolver {

    get localizationIsNeeded () {
        return true;
    }


    getStartIterationData () {
        //searching for not moving point
        let tangentMoving,
            chordMoving;

        if (Resolver.checkFourierCondition(this.func, this.localization.startPoint)) {
            tangentMoving = this.localization.startPoint;
            chordMoving = this.localization.endPoint;
        }
        else if (Resolver.checkFourierCondition(this.func, this.localization.endPoint)) {
            tangentMoving = this.localization.endPoint;
            chordMoving = this.localization.startPoint;
        } else
            throw Resolver.error(3);

        return {
            iterationIndex: 0,
            currentTangent: tangentMoving,
            currentChord: chordMoving,
            firstDerivative: this.func.derivate
        };
    }


    getNextTangent (iterationData) {
        const preValue = iterationData.previousTangent;

        return iterationData.previousTangent -
            this.func.execute(preValue) / iterationData.firstDerivative.execute(preValue);
    }

    getNextChord (iterationData) {
        const preValue = iterationData.previousChord,
            f = this.func.execute;

        return preValue - (f(preValue) * (iterationData.currentTangent - preValue)) /
            (f(iterationData.currentTangent) - f(preValue));
    }



    stopCriterion (iterationData) {
        return Math.abs(iterationData.currentTangent - iterationData.currentChord) > iterationData.stopCriterionValue;
    }

    calculateStopCriterionValue (iterationData) {
        iterationData.stopCriterionValue = this.getExitCriterionValue(iterationData);
    }

    getExitCriterionValue (iterationData) {
        return this.exactness
    }



    makeIteration (iterationData) {
        iterationData.previousTangent = iterationData.currentTangent;
        iterationData.currentTangent = this.getNextTangent(iterationData);

        iterationData.previousChord = iterationData.currentChord;
        iterationData.currentChord = this.getNextChord(iterationData);


        iterationData.iterationIndex++;
    }

    logMapper (l) {
        return l.set('firstDerivative', l.get('firstDerivative').toString());
    }
}

module.exports = {Combine};


