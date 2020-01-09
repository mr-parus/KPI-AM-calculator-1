const {Matrix, System} = require('../utils/Matrix');
const {GausResolver} = require('./Gaus');


class CholetskyResolver {

    resolve (systemObj) {
        //TODO CHECK DETERMINANT
        systemObj = systemObj.copy;

        const system = systemObj.system,
            b = system.getSubMatrix(0, system.m, 1, system.m).copy,
            A = systemObj.matrix,
            n = systemObj.matrix.n,
            U = new Matrix(n);

        let data = '<div>';

        const getU = function (i, j) {
            let result;

            if ( i === j) {
                let sum = 0,
                    tempstr = "";

                for (let k = 0; k < i; k++ ) {
                    sum += U.get(k,i).value**2;
                    tempstr += ` - U[${k},${i}]^2`
                }
                const  value = A.get(i,i).value - sum;
                let sign = Math.sign(value);
                result =   sign * Math.sqrt(Math.abs(value));
                data +=`<p> U[${i}${j}] = (A[${i}${i}] ${tempstr})^(1/2) = ${result}</p>`;
            } else {
                let sum = 0,
                    tempstr ="";

                for (let k = 0; k < i; k++ ) {
                    sum += U.get(k,i).value * U.get(k,j).value;
                    tempstr += `- U[${k}${i}] * U[${k}${j}]`;
                }
                result =  (A.get(i,j).value - sum) / U.get(i,i).value;
                data +=`<p> U[${i}${j}] = (A[${i}${j}] ${tempstr}) / U[${i}${i}] = ${result}</p>`;

            }
            data+='<br/>';
            return result;
        };

        data += `<h3>System:</h3>`;
        data += `<div>${system.getString()}</div>`;

        data+= '<h4>Run by rows:</h4>';
        const t0 = performance.now();
        for (let i = 0; i < n; i++ ) {
            data += `<h4>Iteration k=${i}:</h4>`;

            for( let j = i; j< n; j++){
                const val = getU(i, j);
                U.get(i, j).value = isFinite(val)?val:0;
            }

            data += `<h5>U After iteration:</h5>`;
            data += `<div>${U.getString()}</div>`;
        }

        const UT = U.copy.toReverse();
        data += `<h3>U:</h3>`;
        data += `<div>${U.getString()}</div><br>`;


        data += `<h3>U^T * U = A</h3>`;
        data += `<h3>U^T * U:</h3>`;
        data += `<div>${UT.multiply(U).getString()}</div>`;
        data += `<h3>A:</h3>`;
        data += `<div>${A.getString()}</div>`;



        data += `<br/><h3>A * x = b</h3>`;
        data += `<h3>U^T * y = b</h3>`;
        data += `<h3>U * x = y</h3>`;

        data+= '<h3>After Reverse run: U^T * y = b</h3>';
        const y = GausResolver.traverseBackBellow(UT, b);
        data+= `<h4>Y:</h4>`;
        data+= `<div>${y.getString()}</div>`;

        const x  = GausResolver.traverseBackUpper(U, y);
        const t1 = performance.now();

        data+= '<h3>After Reverse run: U * x = y</h3>';
        data+= `<h4>X:</h4>`;
        data+= `<div>${x.getString()}</div>`;


        data += `<h3>System:</h3>`;
        data += `<div>${system.getString()}</div>`;
        data += `<h3>A*X:</h3>`;
        data += `<div>${A.multiply(x).getString()}</div>`;
        data += `<h4>TIME: ${t1 - t0}</h4>`;

        data += '</div>';
        return {answer:x , data}
    }

    det (A) {
        A = A.copy;
        let det = [],
            data = "<div>";

        const n = A.n,
            U = new Matrix(n);

        const getU = function (i, j) {
            let result;

            if ( i === j) {
                let sum = 0,
                    tempstr = "";

                for (let k = 0; k < i; k++ ) {
                    sum += U.get(k,i).value**2;
                    tempstr += ` - U[${k},${i}]^2`
                }
                const  value = A.get(i,i).value - sum;
                let sign = Math.sign(value);
                result =   sign * Math.sqrt(Math.abs(value));
                data +=`<p> U[${i}${j}] = (A[${i}${i}] ${tempstr})^(1/2) = ${result}</p>`;
            } else {
                let sum = 0,
                    tempstr ="";

                for (let k = 0; k < i; k++ ) {
                    sum += U.get(k,i).value * U.get(k,j).value;
                    tempstr += `- U[${k}${i}] * U[${k}${j}]`;
                }
                result =  (A.get(i,j).value - sum) / U.get(i,i).value;
                data +=`<p> U[${i}${j}] = (A[${i}${j}] ${tempstr}) / U[${i}${i}] = ${result}</p>`;
            }
            if (i === j) {
                det.push(result**2);
            }
            data+='<br/>';
            return result;
        };

        for (let i = 0; i < n; i++ ) {
            data += `<h4>Iteration k=${i}:</h4>`;

            for( let j = i; j< n; j++){
                const val = getU(i, j);
                U.get(i, j).value = isFinite(val)?val:0;
            }

            data += `<h5>U After iteration:</h5>`;
            data += `<div>${U.getString()}</div>`;
        }


        data += `<h3>U:</h3>`;
        data += `<div>${U.getString()}</div><br>`;

        const answer = det.reduce ((a,b) => a*b);
        data += `<h4>Determinant: ${answer}</h4>`;
        data += `</div>`;

        return {answer, data};
    }

}


module.exports = {
    CholetskyResolver
};

//
// const m = new Matrix(3,3);
// m.values = [[6,2,1],[2,5,3],[1,3,2]];
//
// const b = [[8],[-5],[7]],
//     s = new System(m, b);
//
//
//
// const h = new CholetskyResolver();
//
// const answer = s.resolve(h);
//
// console.log('\nAnswer: ');
// answer.print();
//
//
// s.print();
// m.multiply(answer).print();


