const {SimpleFunction} = require('./help/Function');
const {Interval} = require('./help/Interval');
const {Bisection} = require('./Bisection');
const {Combine} = require('./Combine');
const {SIM} = require('./SIM');
const {Chord} = require('./Chord');
const {Lobachevsky} = require('./Lobachevsky');
const {Newton} = require('./Newton');
const {NewtonSimple} = require('./NewtonSimple');
const {NewtonDiscreet} = require('./NewtonDiscreet');
const {NewtonStefanson} = require('./NewtonStefanson');
const {NewtonTangent} = require('./NewtonTangent');


class MethodHandler {
    static error (n) {
        let msg;
        switch (n) {
            case 0:
                msg = 'Method doesn\'t set.';
                break;
            case 1:
                msg = 'Method doesn\'t supported';
                break;
            default:
                msg = 'MethodHandler Error.';
        }
        throw new Error(msg);
    }

    constructor () {
        this.method = null;
        this.loc = null;
        this.func = null;
    }

    setStrategy (methodName) {
        switch (methodName) {
            case 'bisection':
                this.method = new Bisection();
                break;
            case 'combine':
                this.method = new Combine;
                break;
            case 'sim':
                this.method = new SIM();
                break;
            case 'chord':
                this.method = new Chord();
                break;
            case 'lobachevsky':
                this.method = new Lobachevsky();
                break;
            case 'newton':
                this.method = new Newton();
                break;
            case 'newtonsimple':
                this.method = new NewtonSimple();
                break;
            case 'newtondiscreet':
                this.method = new NewtonDiscreet();
                break;
            case 'newtonstefanson':
                this.method = new NewtonStefanson();
                break;
            case 'newtontangent':
                this.method = new NewtonTangent();
                break;
            default:
                MethodHandler.error(1);
        }
    }

    setFunction (funcStr) {
        this.method.func = new SimpleFunction (funcStr);
    }


    setLocalization (start, end) {
        if (!this.method.localizationIsNeeded){
            return;
        }

        if (start === "")
            throw new Error('Start Point does\'t set.');
        if (end === "")
            throw new Error('End Point does\'t set.');

            this.start = +start;
            this.end = +end;

        if (this.method) {
            if (this.method.localizationIsNeeded) {
                this.method.localization =  new Interval(this.start, this.end);
            }
        } else  {
            MethodHandler.error(0);
        }
    }

    setExactness (exactness) {
        if (exactness !== "" && isFinite(exactness))
            this.method.exactness = +exactness;
    }

    calculate () {
        return this.method.findRoot();
    }
}




module.exports = {
    MethodHandler
};