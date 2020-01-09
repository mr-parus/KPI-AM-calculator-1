const {Resolver, Interval} = require('./help/Resolver');
const {List} = require('immutable');
const mathjs = require('mathjs'),
    Big = mathjs.bignumber;

class Lobachevsky extends Resolver {
    get needFinalDataAdd(){
        return true;
    }

    finalData (iterationData){
        return this.getAnswer(iterationData);
    }

    logMapper (iterationData) {
        let t = iterationData;
        try {
            t = t.set('current_bk', iterationData.get('current_bk').map(a => a.toString()))
                .set('prev_bk', iterationData.get('prev_bk').map(a => a.toString()))
                .set('normal', iterationData.get('normal') ? iterationData.get('normal').toString() : '-');
            return t;
        }
        catch (e){
        }
        return t;
    }

    getStartIterationData () {
        const coeffs =  this.func.coefs;

        if (coeffs.includes(NaN) || coeffs.includes(undefined)){
            throw new Error('Seen\'s like it\'s impossible to get coefficients');
        }


        return {
            iterationIndex: 0,
            prev_bk:[],
            current_bk: this.func.coefs.map(x => Big(x))
        };
    }

    getAnswer (iterationData) {
        const n = iterationData.current_bk.length,
            bks = iterationData.current_bk,
            pov = 2**iterationData.iterationIndex,
            roots = [];

        for (let i = 0; i < n - 1; i++) {
            const t = mathjs.pow(
                Big(mathjs.abs(
                    Big(
                        mathjs.divide(Big(bks[i]), Big(bks[i+1]))
                    )
                )),
                Big(1/pov)
            );

            roots.push(t.toString());
        }

        return Object.assign(iterationData, {roots});
    }


    // makeIteration(iterationData) {
    //     if (this.isBigNum)
    //         return this.makeBigIteration(iterationData);
    //
    //     iterationData.prev_bk =   iterationData.current_bk;
    //
    //     const n = iterationData.prev_bk.length,
    //         prev_bk = Array.from(List(iterationData.prev_bk)),
    //         next_bk = new Array(n).fill(0),
    //         prev_bk_sqr = prev_bk.map(x=>x**2);
    //
    //
    //     for (let k = 0; k < n; k++) {
    //         next_bk[k] = prev_bk_sqr[k];
    //
    //         // console.log('b = ', prev_bk[k],'***k==',k, 'n:', n - k);
    //
    //         let tempSum = 0;
    //
    //         for (let j = 1; j < n - k; j++) {
    //             if (prev_bk[k-j] === undefined || prev_bk[k+j] === undefined)
    //                 continue;
    //             tempSum += (-1)**j * prev_bk[k-j] * prev_bk[k+j];
    //             // console.log("l",prev_bk[k-j]);
    //             // console.log("r",prev_bk[k+j]);
    //         }
    //
    //         next_bk[k] += 2*tempSum;
    //
    //         // console.log('next_b:' + next_bk[k] +'***');
    //     }
    //
    //     const normal = Math.sqrt(
    //         new Array(n)
    //             .fill(1)
    //             .map((a,k) => a - next_bk[k]/prev_bk_sqr[k])
    //             .filter(a => a!== Infinity)
    //             .map(x=>x**2)
    //             .reduce((a,b) => a+b)
    //     );
    //
    //     iterationData.current_bk = next_bk;
    //     iterationData.normal = normal;
    //     ++iterationData.iterationIndex;
    // }


    makeIteration (iterationData) {
        iterationData.prev_bk = iterationData.current_bk;

        const n = iterationData.prev_bk.length,
            prev_bk = Array.from(List(iterationData.prev_bk)),
            next_bk = new Array(n).fill(Big(0)),
            prev_bk_sqr = prev_bk.map(x => mathjs.pow(x,2));



        for (let k = 0; k < n; k++) {
            next_bk[k] = prev_bk_sqr[k];
            let tempSum = Big(0);
            for (let j = 1; j < n - k; j++) {
                if (prev_bk[k-j] === undefined || prev_bk[k+j] === undefined)
                    continue;
                tempSum = mathjs.add(
                    tempSum,
                    mathjs.multiply(mathjs.pow(-1,j),  prev_bk[k-j], prev_bk[k+j])
                );
            }

            next_bk[k] = mathjs.add(next_bk[k], mathjs.multiply(2,tempSum));
        }


        const normal = mathjs.sqrt(
            new Array(n)
                .fill(Big(1))
                .map((a, k) => mathjs.subtract(a, mathjs.divide(next_bk[k], prev_bk_sqr[k])))
                .filter(a => !/(Infinity|NaN)/.test(a.toString()))
                .map(x => mathjs.pow(x,2))
                .reduce((a,b) => mathjs.add(a,b), 0)
        );



        iterationData.current_bk = next_bk;
        iterationData.normal = normal;
        ++iterationData.iterationIndex;
    }

    stopCriterion (iterationData) {
        return mathjs.larger(iterationData.normal, iterationData.stopCriterionValue);
    }

    calculateStopCriterionValue (iterationData) {
        iterationData.stopCriterionValue =  this.exactness;
    }
}

module.exports = {Lobachevsky};

const i = mathjs.bignumber(Infinity);

