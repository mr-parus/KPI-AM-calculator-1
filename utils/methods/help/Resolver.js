const {defaultExactness} = require('../../services/constants');
const {Interval} = require('./Interval');
const {Map} = require('immutable');


class Resolver {

    //Statics

    /**
     * Теорема 1.1.1 (Больцано-Коші)
     */
    static checkLocalizationCondition (func, a, b) {
        const f = func.execute;
        return(Math.sign(f(a)) || 1) !== (Math.sign(f(b)) || 1);
    }

    static checkFourierCondition (func, x) {
        const secondDerivate = func.derivate.derivate.execute;
        const f = func.execute;

        return secondDerivate(x)*f(x) > 0;
    }

    /**
     * @param {number} [n] - number oh Resolver Error
     */
    static error (n) {
        let msg;
        switch (n) {
            case 0:
                msg = 'Function  or  Localisation or Exactness is not installed.';
                break;
            case 1:
                msg = 'Incorrect Localization.';
                break;
            case 2:
                msg = 'Localisation or  Exactness is not installed.';
                break;
            case 3:
                msg = 'Fourier condition false.';
                break;
            case 4:
                msg = 'Function or Exactness is not installed.';
                break;
            case 5:
                msg = 'Localization is not installed.';
                break;
            default:
                msg = 'Resolver Error.';
        }
        throw new Error(msg);
    }

    //Constructor

    constructor (e) {
        this.e = e || defaultExactness;
        this.loc = null;
        this._func = null;
        this.minE = 1e-10;
        this.minValue = 1E-17;
        this.extrenalExit = false;
        this.maxIterationsCount = 50;
    }

    //Props

    /**
     * @param {SimpleFunction} func  - function for find roots
     */
    set func (func) {
        this._func = func;
    }

    /**
     * @return {SimpleFunction} func  - function for find roots
     */
    get func () {
        return this._func;
    }



    /**
     * @param {number} exactness - exactness for root finding
     * */
    set exactness (exactness) {
        if (typeof exactness === 'number')
            this.e = (exactness <= this.minE) ? this.minE: exactness;
    }

    /**
     * @return {number} exactness - exactness for root finding
     * */
    get exactness () {
        return this.e;
    }



    /**
     * @param {Interval} interval - localization of the root
     */
    set localization (interval) {
        if (interval instanceof Interval)
            this.loc = interval;
    }

    /**
     * @return {Interval} localization of the root
     */
    get localization () {
        return this.loc;
    }

    /**
     * @return {boolean}  - is localization needed
     */
    get localizationIsNeeded() {
        return false;
    }

    checkLocalization () {
        if (!this.loc) {
            Resolver.error(5);
        }
        if (!Resolver.checkLocalizationCondition(this.func, this.loc.endPoint, this.loc.startPoint))
            Resolver.error(1);
    }


    //Iteration data


    /**
     * @return {object} iterationData - start iteration data
     */
    getStartIterationData () {
        return {};
    }


    /**
     * @return {number} iterations count
     */
    getIterationsCount () {
        return Infinity;
    }


    /**
     * @param {object} iterationData - previous iteration's data
     * @return {boolean}
     * */
    stopCriterion (iterationData) {
        return false;
    }

    /**
     * @param {object} iterationData - start iteration's data
     * @return {number}
     * */
    calculateStopCriterionValue (iterationData) {return Infinity}


    get finalData(){
        return null;
    }

    get needFinalDataAdd(){
        return false;
    }

    /**
     * @param {object} iterationData - previous iteration's data
     * */
    makeIteration (iterationData) {}

    //Logger
    logMapper(a) {
        //custom output
        return a;
    }

    generateLogger () {
        const logs = [];
        return {
            getLogs: () => logs.map(this.logMapper),
            log:(data) =>  logs.push(Map(data))
        }
    }


    findRoot () {
        if (!this.func || !isFinite(this.exactness))
            Resolver.error(4);


        if (this.localizationIsNeeded) {
            this.checkLocalization();
        }


        const logger = this.generateLogger();
        const iterationData = this.getStartIterationData();
        this.calculateStopCriterionValue(iterationData);


        let error = "";


        logger.log(iterationData);

        do {
            try {
                this.makeIteration(iterationData);
                logger.log(iterationData);
                // console.log(JSON.stringify(iterationData));
            }
            catch (er) {
                this.extrenalExit = true;
                error = er.message;
            }
        }
        while (this.stopCriterion(iterationData) && iterationData.iterationIndex  < this.maxIterationsCount && !this.extrenalExit);

        if (this.needFinalDataAdd) {
            try{
                logger.log(this.finalData(iterationData));
            }
            catch (er) {
                console.log(er);
                error = er.message;
            }
        }

        if (iterationData.iterationIndex === this.maxIterationsCount){
            error = 'Iteration Index is maximum! The answer may be not correct.'
        }
        return {logs:logger.getLogs(), msg:error};
    }

}

module.exports = {Resolver, Interval};