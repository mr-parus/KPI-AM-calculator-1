const {Matrix, System} = require('../utils/Matrix');


class SimpleRun {

    resolve(systemObj) {
        systemObj = systemObj.copy;

        const system = systemObj.system,
            R = system.getSubMatrix(0, system.m, 1, system.m).copy,
            A = systemObj.matrix,
            n = systemObj.matrix.n,
            iterations = [];

        let data = '<div>';

        const getBCD = (i) => {
            const cond = (i > 0 && i < n - 1 ),
                size = cond ? 3 : 2,
                j = cond ? i - 1 : (i === n - 1) ? n - size : 0,
                values = A.getSubMatrix(i, j, size, 1).values[0];
            if (i === 0) {
                values.unshift(null);
            } else if (i === n - 1)
                values.push(null);
            return values;
        };

        const getParam = (() => {
            let lastDelta,
                lastLambda;

            return {
                teta: (ck, bk) => {
                    return ck + (bk * lastDelta || 0) ;
                },
                delta: (dk, tk) => {
                    lastDelta = - ((dk || 0) / tk);
                    if (tk === 0)
                        throw new Error('tk === 0');
                    return lastDelta;
                },
                lambda: (rk, tk, bk) => {
                    lastLambda = (rk - (  bk * lastLambda || 0) ) / tk;
                    if (tk === 0)
                        throw new Error('tk === 0');
                    return  lastLambda;
                }
            };
        })();


        data += `<h3>System:</h3>`;
        data += `<div>${system.getString()}</div>`;
        data += `<h3>A:</h3>`;
        data += `<div>${A.getString()}</div>`;

        const t0 = performance.now();
        for (let i = 0; i < n; i++) {
            data+= `<h4>Iteration index K = ${i}\n</h4>`;

            const [b, c, d] = getBCD(i),
                teta = getParam.teta(c, b),
                lambda = getParam.lambda(R.get(i,0).value,teta,b),
                delta = getParam.delta(d,teta);

            // if (c < (b || 0) + (d || 0)  ) {
            //     throw new Error('Not valid matrix');
            // }


            data+= b?`<p>b = ${b}</p>`:"";
            data+= `<p>c = ${c}</p>`;
            data+= d?`<p>d = ${d}</p>`:"";
            data+= "</br></br>";

            data+= `<p> 𝜏 = ${teta}</p>`;
            data+= `<p> λ = ${lambda}</p>`;
            data+= `<p> Δ = ${delta}</p>`;


            iterations.push({teta,lambda,delta});
        }

        data+= '<h3>X finding:</h3>';
        const x = new Matrix(1,n);

        for (let i = n - 1; i >= 0; i--) {
            const params = iterations[i];
            if (i === n - 1) {
                x.get(i,0).value = params.lambda;
                data+= `<p>X[${i}] =  λ  = ${params.lambda}</p>`;
            } else {
                const result = params.delta *  x.get(i + 1,0).value  + params.lambda;
                data+= `<p>X[${i}] =  Δ  * X[${i+1}] + λ  = ${params.delta} * ${x.get(i + 1,0).value} + ${params.lambda} = ${result}</p>`;
                x.get(i,0).value = result;
            }
            data+=`<br/>`;
        }

        const t1 = performance.now();


        data+= `<h4>X:</h4>`;
        data+= `<div>${x.getString()}</div>`;


        data += `<h3>System:</h3>`;
        data += `<div>${system.getString()}</div>`;
        data += `<h3>A*X:</h3>`;
        data += `<div>${A.multiply(x).getString()}</div>`;
        data += `<h4>TIME: ${t1 - t0}</h4>`;
        data += '</div>';

        return {answer:x, data};
    }

}

module.exports = {
    SimpleRunResolver: SimpleRun
};


//
// const m = new Matrix(4,4);
// m.values = [[2,1,0,0],[2,5,2,0],[0,2,4,1],[0,0,1,2]];
//
// const b = [[2],[4],[3],[3]],
//     s = new System(m, b);
//
// const simlerun = new SimpleRun();
//
// const {answer} = s.resolve(simlerun);

// console.log('\nAnswer: ');
// s.print();
//
// answer.print();

//
// m.multiply(answer).print();

//
