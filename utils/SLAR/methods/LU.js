const {Matrix, System} = require('../utils/Matrix');
const {GausResolver} = require('./Gaus');


class LUfixedUResolver {

    resolve (systemObj) {
        systemObj = systemObj.copy;

        const system = systemObj.system,
            b = system.getSubMatrix(0,system.m,1, system.m).copy,
            A = systemObj.matrix,
            n = systemObj.matrix.n,
            L = new Matrix(n),
            U = L.copy.toIdentity();

        let data = "<div>";


        data += `<h3>System:</h3>`;
        data += `<div>${system.getString()}</div>`;

        data += `<h3>A:</h3>`;
        data += `<div>${A.getString()}</div>`;



        const getL =  function (i,j)  {
            let sum = 0,
                tempstr = "";
            for (let k = 0; k < j; k++ ) {
                sum += L.get(i,k).value * U.get(k,j).value;
                tempstr += ` - L[${i},${k}] * U[${k},${j}]`;
            }
            const result = A.get(i,j).value - sum;

            data +=`<p>L[${i}, ${j}] =  A[${i},${j}] ${tempstr} = ${result}</p><br>`;
            return result;
        };

        const getU = function (i, j) {
            let sum = 0,
                tempstr = "";
            for (let k = 0; k < i; k++ ) {
                tempstr += `- L[${i},${k}] * U[${k},${j}] `;
                sum += L.get(i,k).value * U.get(k,j).value;
            }
            const result = (A.get(i,j).value - sum) / L.get(i,i).value;

            data += `<p>U[${i},${j}] = (A[${i},${j}]) ${tempstr} / L[${i},${i}] = ${result}</p><br>`;
            return result;
        };

        data+= '<h4>Classic run:</h4>';

        const t0 = performance.now();

        for (let j = 0; j < n; j++) {
            data += `<h4>Iteration k=${j}:</h4>`;

            for (let i = j; i < n; i++) {
                L.get(i,j).value = getL(i,j);
            }

            for ( let i = j + 1; i < n; i++) {
                U.get(j,i).value = getU(j,i);
            }

            data += `<h5>U After iteration:</h5>`;
            data += `<div>${U.getString()}</div>`;

            data += `<h5>L After iteration:</h5>`;
            data += `<div>${L.getString()}</div>`;
        }

        data += `<h3>L:</h3>`;
        data += `<div>${L.getString()}</div><br>`;
        data += `<h3>U:</h3>`;
        data += `<div>${U.getString()}</div><br>`;

        data += `<h3>L * U = A</h3>`;
        data += `<h3>L * U:</h3>`;
        data += `<div>${L.multiply(U).getString()}</div>`;
        data += `<h3>A:</h3>`;
        data += `<div>${A.getString()}</div>`;

        data += `<br/><h3>A * x = b</h3>`;
        data += `<h3>L * y = b</h3>`;
        data += `<h3>U * x = y</h3>`;

        data+= '<h3>After Reverse run: L * y = b</h3>';
        const y = GausResolver.traverseBackBellow(L,b);

        data+= `<h4>Y:</h4>`;
        data+= `<div>${y.getString()}</div>`;

        const x =  GausResolver.traverseBackUpper(U,y);
        const t1 = performance.now();

        data+= '<h3>After Reverse run: U * x = y</h3>';
        data+= `<h4>X:</h4>`;
        data+= `<div>${x.getString()}</div>`;


        data += `<h3>System:</h3>`;
        data += `<div>${system.getString()}</div>`;
        data += `<h3>A*X:</h3>`;
        data += `<div>${A.multiply(x).getString()}</div>`;
        data += `<h4>TIME: ${t1 - t0}</h4>`;

        data += "</div>";
        return {answer:x, data};
    }

    det (A) {
        A = A.copy;
        let det = [],
            data = "<div>";

        const n = A.n,
            L = new Matrix(n),
            U = L.copy.toIdentity();

        data += `<h3>A:</h3>`;
        data += `<div>${A.getString()}</div>`;

        const getL =  function (i,j)  {
            let sum = 0,
                tempstr = "";
            for (let k = 0; k < j; k++ ) {
                sum += L.get(i,k).value * U.get(k,j).value;
                tempstr += ` - L[${i},${k}] * U[${k},${j}]`;
            }
            const result = A.get(i,j).value - sum;

            data +=`<p>L[${i}, ${j}] =  A[${i},${j}] ${tempstr} = ${result}</p><br>`;
            if (i === j){
                det.push(result);
            }
            return result;
        };

        const getU = function (i, j) {
            let sum = 0,
                tempstr = "";
            for (let k = 0; k < i; k++ ) {
                tempstr += `- L[${i},${k}] * U[${k},${j}] `;
                sum += L.get(i,k).value * U.get(k,j).value;
            }
            const result = (A.get(i,j).value - sum) / L.get(i,i).value;

            data += `<p>U[${i},${j}] = (A[${i},${j}]) ${tempstr} / L[${i},${i}] = ${result}</p><br>`;
            return result;
        };

        data+= '<h4>Classic run:</h4>';

        for (let j = 0; j < n; j++) {
            data += `<h4>Iteration k=${j}:</h4>`;

            for (let i = j; i < n; i++) {
                L.get(i,j).value = getL(i,j);
            }

            for ( let i = j + 1; i < n; i++) {
                U.get(j,i).value = getU(j,i);
            }

            data += `<h5>U After iteration:</h5>`;
            data += `<div>${U.getString()}</div>`;

            data += `<h5>L After iteration:</h5>`;
            data += `<div>${L.getString()}</div>`;

        }


        data += `<h3>L:</h3>`;
        data += `<div>${L.getString()}</div><br>`;
        data += `<h3>U:</h3>`;
        data += `<div>${U.getString()}</div><br>`;


        const answer = det.reduce ((a,b) => a*b);
        data += `<h4>Determinant: ${answer}</h4>`;
        data += `</div>`;

        return {answer, data};
    }
}

module.exports = {
    LUfixedUResolver
};



// const m = new Matrix(3,3);
// m.values = [[3,-1,0],[-2,1,1],[2,-1,4]];
//
// const b = [[5],[0],[15]],
//     s = new System(m, b);
//
//
//
// const luResolver = new LUfixedUResolver();
//
// const answer = s.resolve(luResolver);
// console.log('\nAnswer: ');
// answer.print();
//
//
// s.print();
// m.multiply(answer).print();


