const {Matrix, System} = require('../utils/Matrix');


class GausResolver {

    getMax (array) {
        let max = array[0];
        array.forEach(el => {
            if (Math.abs(el.value) > Math.abs(max.value)){
                max = el;
            }
        });
        return max;
    }

    static traverseBackUpper (A, b) {
        const x = new Matrix(1, A.m);

        for (let i = A.m - 1; i >= 0; i-- ) {
            let sum = 0;
            for (let j = i + 1; j < A.m; j++) {
                sum += A.get(i,j).value * x.get (j,0).value;
            }
            x.get(i, 0).value = (b.get(i, 0).value - sum ) / A.get(i,i).value;
            // console.log(`x[${i}] = (${b.get(i, 0).value} - ${sum} )/ ${A.get(i,i).value}`)
        }
        return x;
    }

    static traverseBackBellow (A, b) {
        const x = new Matrix(1, A.m);

        for (let i =  0 ; i < A.m; i++ ) {
            let sum = 0;

            for (let j = 0 ; j < i + 1; j++) {
                sum += A.get(i,j).value * x.get (j,0).value;
            }
            // console.log(`x[${i}] = (${b.get(i, 0).value} - ${sum}) / ${A.get(i,i).value}`);
            x.get(i, 0).value = (b.get(i, 0).value - sum) / A.get(i,i).value;
        }
        return x;
    }


    transformBeforeIteration () {
        return "";
    }

    resolve (systemObj) {
        systemObj = systemObj.copy;

        let system = systemObj.system,
            m = systemObj.matrix.m,
            n = systemObj.matrix.n,
            A = system.getSubMatrix(0, 0, system.m),
            data = '<div>';

        const A_orig = systemObj.matrix,
            system_orig = systemObj.system.copy;


        data += `<h3>System:</h3>`;
        data += `<div>${system_orig.getString()}</div>`;

        data += `<h3>A:</h3>`;
        data += `<div>${A.getString()}</div>`;

        data+= '<h3>Straight run:</h3>';
        const t0 = performance.now();

        for (let k = 0; k < m; k++) {
            data+= `<h4>Iteration index K = ${k}\n</h4>`;
            const subMatrix = system.getSubMatrix(k, k, n - k + 1 , m - k);

            data += this.transformBeforeIteration(system.getSubMatrix(k, k, n - k, m - k), system);

            // Transform matrix elements
            (function () {
                const
                    firstRow = subMatrix.copy.getRow(0),
                    firstElement = firstRow[0],
                    firstElementValue = firstElement.value;

                if (firstElementValue === 0)
                    throw new Error('Main element is equals to 0.');


                let digitToMinus;
                for (let i = 0; i < subMatrix.m; i++) {
                    for (let j = 0; j < subMatrix.n; j ++) {
                        const element = subMatrix.get(i,j);
                        if (i === 0) {
                            data += `<p>A[${element.i},${element.j}] = A[${element.i},${element.j}] / A[${firstElement.i},${firstElement.j}]`;
                            const value = element.value / firstElementValue;
                            data += ` = ${element.value} / ${firstElementValue} = ${value}</p><br>`;
                            firstRow[j].value = value;
                        }
                        else {
                            if (j === 0) digitToMinus = element.value;

                            data += `<p>A[${element.i},${element.j}] = A[${element.i},${element.j}] - A[${firstElement.i},${element.j}] * A[${element.i}, 0]`;
                            const value = element.value  -  firstRow[j].value * digitToMinus;
                            data += ` = ${element.value} - ${firstRow[j].value} * ${digitToMinus} = ${value}</p><br>`;
                            element.value = value
                        }
                    }
                }
            })();

            data += `<h5>System After iteration:</h5>`;
            data += `<div>${system.getString()}</div>`;
        }

        let b = system.getSubMatrix(0,system.m,1, system.m).copy;

        data+= '<h3>After Reverse run:</h3>';
        const x = GausResolver.traverseBackUpper(A, b);
        const t1 = performance.now();
        data+= `<h4>X:</h4>`;
        data+= `<div>${x.getString()}</div>`;


        data += `<h3>System:</h3>`;
        data += `<div>${system_orig.getString()}</div>`;
        data += `<h3>A*X:</h3>`;
        data += `<div>${A_orig.multiply(x).getString()}</div>`;
        data += `<h4>TIME: ${t1 - t0}</h4>`;

        data+="</div>";

        return {answer:x, data}
    }


    det (A) {
        A = A.copy;
        let det = [],
            data = "<div>";
        const n = A.n;

        data += `<h3>A:</h3>`;
        data += `<div>${A.getString()}</div>`;

        for (let k = 0; k < n; k++) {
            data+= `<h4>Iteration index K = ${k}\n</h4>`;
            const subMatrix = A.getSubMatrix(k, k, n - k);

            // Transform matrix elements
            const firstRow = subMatrix.copy.getRow(0),
                firstElement = firstRow[0],
                firstElementValue = firstElement.value;

            if (firstElementValue === 0)
                throw new Error('Main element is equals to 0.');
            det.push(firstElementValue);
            let digitToMinus;
            for (let i = 0; i < subMatrix.n; i++) {
                for (let j = 0; j < subMatrix.n; j ++) {
                    const element = subMatrix.get(i,j);
                    if (i === 0) {
                        firstRow[j].value = element.value / firstElementValue;
                    }
                    else {
                        if (j === 0) digitToMinus = element.value;
                        element.value = element.value - firstRow[j].value * digitToMinus
                    }
                }
            }
            data += `<h5>A after iteration:</h5>`;
            data += `<div>${A.getString()}</div>`;
        }

        const answer = det.reduce ((a,b) => a*b);
        data += `<h4>Determinant: ${answer}</h4>`;
        data += `</div>`;

        return {answer, data};
    }
}


class GausResloverByColumns extends GausResolver {
    transformBeforeIteration (A, system) {
        let data ='';

        const firstColumn = A.getColumn(0),
            firstColumnMainElement = firstColumn[0],
            current_element_i = firstColumnMainElement.i,
            max_element_i = this.getMax(firstColumn).i;

        if (current_element_i !== max_element_i) {
            system.changeRows(current_element_i, max_element_i);
            data +=`<h5>Rows changing: i=${current_element_i} with i=${max_element_i}</h5>`;
            data += `<h5>System After rows changing:</h5>`;
            data += `<div>${system.getString()}</div>`;
        }

        return data + '<br/>';
    }
}


module.exports = {
    GausResolver,
    GausResloverByColumns
};




// const m = new Matrix(3,3);
// m.values = [[1,5,-1],[2,-1,-1],[3,-2,4]];
// m.values = [[3,-1,0],[-2,1,1],[2,-1,4]];


//
// const b = [[5],[0],[15]],
//     s = new System(m, b);
// const gausResolver = new GausResolver();
// const gausResolverByColumns = new GausResloverByColumns();

// const answer = s.resolve(gausResolverByColumns);
// console.log('\nAnswer: ');
// answer.print();
// m.multiply(answer).print();





