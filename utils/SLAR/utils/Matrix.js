class Element {
    constructor(val, i, j) {
        this.val = val;
        this.i = i;
        this.j = j;
    }

    error (key) {
        switch (key) {
            case 0 : throw new Error(`Value is not a number!`);
        }
    }

    get copy (){
        return new Element(this.val,this.i,this.j);
    }

    get value () {
        return this.val;
    }

    get abs () {
        return Math.abs(this.value)
    }

    set value (v) {
        if (!isFinite(v)){
            this.error(0)
        }
        this.val = v;
    }
}

function makeEmptyRow(n, i = 0) {
    return new Array(n)
        .fill(0)
        .map((el, j) => new Element(el, i, j));
}

function makeEmptyColumn(n, j = 0) {
    return new Array(n)
        .fill(0)
        .map((el, i) => new Element(el, i, j));
}


class Matrix {
    constructor (n, m = n) {
        this.n = n;
        this.m = m;
        this.matrix = new Array(m)
            .fill(0)
            .map((_,i) => makeEmptyRow(n,i));

    }

    error(key, data){
        switch (key) {
            case 0 : throw new Error(`j index ${data} out of range!`);
            case 1 : throw new Error(`i index ${data} out of range!`);
            case 2 : throw new Error(`'Wrong m = ${data[0]} or n = ${data[1]} parameters'`);
            case 3 : throw new Error(`' m !== n .`);
        }
    }

    set values (values) {
        const m = values.length,
            n = values[0].length;

        if (m === this.m && n === this.n)
            values.forEach((row, i) =>{
                row.forEach((val, j)  => {
                    this.matrix[i][j].value = val;
                })
            });
        else
            this.error(2,[m,n]);
    }

    get copy () {
        const result = new Matrix(this.n, this.m);
        result.values = this.values;
        return result;
    }

    get values () {
        const values = new Array(this.m).fill(0).map(()=>new Array(this.n).fill(0));
        this.traverseByRow(function (i,j,el) {
            values[i][j] = el.value;
        });
        return values;
    }

    checkIndex (i, range) {
        return ((i >= range[1]) || (i < range[0]))?!!0:!!1;
    }

    get (i, j) {
        if (!this.checkIndex(i,[0,this.m]))
            this.error(1,i);

        if (!this.checkIndex(j, [0, this.n]))
            this.error(0,j);

        return this.matrix[i][j];
    }

    set(i,j,el){
        this.matrix[i][j] = el;
    }

    getRow (i) {
        if (!this.checkIndex(i, [0, this.m]))
            this.error(0,i);

        const row = [];

        this.traverseByRow(function (i,j,el) {
            row.push(el);
        },i,i+1);

        return row;
    }

    getColumn (j) {
        if (!this.checkIndex(j, [0, this.n]))
            this.error(0,j);

        const column = [];

        this.traverseByColumn(function (i,j,el) {
            column.push(el);
        },0,this.n,j,j+1);

        return column;
    }


    getSubMatrix(i, j, n, m = n) {
        const max_i = i + m,
            max_j = j + n,
            matrix = new Matrix(n, m);

        this.traverseByRow((ii, jj , el) =>  {
            // const element = matrix.get(ii - i, jj - j);
            matrix.set(ii - i,jj - j,el);
            // element.value = el.value;
            // element.j = jj;
            // element.i = ii;
            } , i, max_i, j, max_j);

        return matrix;
    }


    set (i, j, element) {
        this.matrix[i][j] = element;
    }


    // # TRAVERSES


    traverseByRow (cb = () => {},
                   start_i = 0,
                   end_i = this.m,
                   start_j = 0,
                   end_j = this.n) {
        for (let i = start_i; i < end_i; i++) {
            for (let j = start_j; j < end_j; j++) {
                if (!this.checkIndex(i,[0,this.m]))
                    this.error(1,i);

                if (!this.checkIndex(j,[0,this.n]))
                    this.error(0,j);

                cb(i, j, this.get(i,j));
            }
        }
    }


    traverseByColumn (cb = () => {},
                      start_i = 0,
                      end_i = this.m,
                      start_j = 0,
                      end_j = this.n) {
        for (let j = start_j; j < end_j; j++) {
            for (let i = start_i; i < end_i; i++) {
                if (!this.checkIndex(i,[0,this.m]))
                    this.error(1, i);

                if (!this.checkIndex(j,[0,this.n]))
                    this.error(0,j);

                cb(i, j, this.get(i, j));
            }
        }
    }


    traverseByUpperTriangle (cb = () => {}) {
        if (this.m === this.n){
            for (let i = 0; i < this.m; i++) {
                for (let j = i + 1; j < this.n; j++) {
                    cb(i, j, this.get(i, j));
                }
            }
        } else
            this.error(3)
    }

    // # OPERATIONS

    multiply (b) {
        if (b instanceof Matrix) {
            b = b.values;
        }

        const b_m = b.length,
            b_n = b[0].length,
            result = new Matrix(b_n ,this.m);
        if (this.n !== b_m) this.error(3);


        for (let k = 0; k < b_n; k++ ) {
            for (let i = 0; i < this.m; i++) {
                let value = 0;
                for ( let j = 0; j < this.n; j++) {
                    value += this.get(i,j).value * b[j][k];
                }
                result.get(i,k).value = value;
            }

        }

        return result;
    }


    // # MODIFIERS


    resize (n, m = n) {

        if (n !== this.n) {
            if (n < this.n) {
                this.matrix.forEach(row => {
                    row.length = n;
                });
                this.n = n;
            } else {
                const div = n - this.n;
                this.matrix.forEach((row, i) => {
                    this.matrix[i] = row.concat(makeEmptyRow(div));
                });
                const old_n = this.n;
                this.n = n;
                this.traverseByRow(function (i,j, el) {
                    el.i = i;
                    el.j = j;
                },0, this.m, old_n, this.n );
            }
        }

        if (m !== this.m) {
            if (m < this.m) {
                this.matrix.length = m;
            }
            else {
                const div = m - this.m;

                for ( let i = div; i > 0; i--) {
                    this.matrix.push(makeEmptyRow(n, this.m + (div - i )));
                }
            }
            this.m = m;
        }

        return this;
    }


    toIdentity () {
        this.traverseByRow(function (i,j, el) {
            if (i === j) {
                el.value = 1;
            } else
                el.value = 0;
        });

        return this;
    }

    toReverse () {
        this.traverseByUpperTriangle( (i, j, el) => {
            const t = this.get(j,i).value;
            this.get(j,i).value = el.value;
            this.get(i,j).value = t;
        });
        return this;
    }

    changeColumns (j1,j2) {
        if (!this.checkIndex(j1, [0, this.n]))
            this.error(0,j1);

        if (!this.checkIndex(j2, [0, this.n]))
            this.error(0,j2);

        for (let i = 0; i < this.m; i ++) {
            let val1 = this.get(i,j1).value;
            this.get(i,j1).value = this.get(i,j2).value;
            this.get(i,j2).value = val1;
        }
        return this;
    }

    changeRows (i1,i2) {

        if (!this.checkIndex(i1, [0, this.m]))
            this.error(0,i1);

        if (!this.checkIndex(i2, [0, this.m]))
            this.error(0,i2);

        for (let j = 0; j < this.n; j ++) {
            let val1 = this.get(i1,j).value;
            this.get(i1, j).value = this.get(i2,j).value;
            this.get(i2, j).value = val1;
        }
        return this;
    }


    print() {
        console.log('---------------');
        let str = "";
        this.traverseByRow((i, j , el)  => {
            str += /*` i:${el.i} j: ${el.j}*/` |${el.value}| `;
            if (j === this.n - 1){
                str += "\n";
                console.log(str);
                str = "";
            }
        });
        console.log('---------------');
        return this;
    }

    getString () {
        const isSystem = ((this.m + 1) === this.n) && this.n !== 1;

        let str = "";
        this.traverseByRow((i, j , el)  => {
            if (j === 0) {
                str += "<div class='matrix_row'>";
            }
            const className = (j === this.n - 1) && isSystem?"matrix_cell b":"matrix_cell";

            str += `<span class="${className}">${Number(el.value).toFixed(4)}</span>`;


            if (j === this.n - 1){
                str += "</div>";
            }
        });
        return str;
    }
}

class System {
    constructor (matrix, b_values) {
        this.matrix = matrix;
        const n = this.matrix.n;

        this.b = new Matrix(1, n);
        this.b.values = b_values;

        this.system = this.matrix.copy.resize(n + 1, this.matrix.m);
        this.system.traverseByColumn((i, j, el) => {
            el.value = this.b.get(i,0).value;
        },0,this.system.m,this.system.n - 1, this.system.n)
    }

    get (i, j) {
        return this.system.get(i,j);
    }

    get copy () {
        return new System(this.matrix, this.b.values);
    }

    print() {
        this.system.print();
    }

    resolve (resolver) {
        return resolver.resolve(this);
    }
}


//
// const c = new Matrix(3,3);
//
// c.get(0,0).value = 1;
// c.get(0,1).value = 2;
// c.get(0,2).value = 3;
// c.get(1,0).value = 4;
// c.get(1,1).value = 5;
// c.get(1,2).value = 6;
// c.get(2,0).value = 7;
// c.get(2,1).value = 8;
// c.get(2,2).value = 9;


// const s = new System(c, [1,2,4]);
//




module.exports = {
    Matrix,
    System,
    makeEmptyRow
};
