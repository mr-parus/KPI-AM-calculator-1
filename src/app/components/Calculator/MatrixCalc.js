import React, {Component} from 'react';
import {Card,CardActions,CardHeader, CardMedia, CardText,CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {orange500, blue500, red500} from 'material-ui/styles/colors';
import Resolver from '../../../../utils/SLAR/methods';
import renderHTML from 'react-render-html';


const {Matrix, System} = require('../../../../utils/SLAR/utils/Matrix');

const methods = [
    ['gauss','Gauss Method'],
    ['gausscolumns','Gauss by columns Method'],
    ['choletsky','Choletsky Method (UU^T)'],
    ['lu','LU with fixed U Method'],
    ['simplerun','Simple run form right Method'],
];


const styles = {
    cell:{
        borderRadius: 4,
        height:40,
        paddingRight:5,
        paddingLeft:5,
        flex:1,
        width: 60,
        margin: 5,
    },
    input:{
        fontSize: 15,
        borderRadius: 4,
        fontWight:'bold',
        height: '100%',
        width:'100%'
    }
};

function getSysten (n) {
    const m = new Matrix(n),
        b = new Array(n).fill(0).map(() => [0]);

    return new System(m,b);
}

const A1 = [
    [-75, 41, -100, 69, 36, 47, 1, -97, -50, -75],
    [-43, -72, 86, -85, 58, -73, 31, 27, 39,-17],
    [21, 67, -42, 38, -75, -63, -30, 32, 93, -62],
    [85, 34, -37, -59, 93, -87, 46, -42, -61, 35],
    [-45, -90, -15, -51, 31, 57, 78, 21, -28, 25],
    [-67, -6, -70, -30, 66, -74, -60, 78, -56, -22],
    [-25, -71, -89, 70, 19, 29, 25, -60, -54, -21],
    [-29, -41, -4, 93, -7, 54, 47, 1, -22, 79],
    [11, -71, -21, -4, 17, 57, -99, 4,76, 14]
],A2= [
    [162, 55, -23, -52, -82, 1, -6, -45, 38, 15, 198],
    [55, 153, 1, -104, -55, -111, -67, 72, 15, 58, -195],
    [-23, 1, 117, 59, -31, -89, 70, -9, -41, 1, 91],
    [-52, -104, 59, 178, 59, 54, 120, 13, 48, 24, 22],
    [-82, -55, -31, 59, 222, 98, 33, -43, 37, -34, -180],
    [ 1, -111, -89, 54, 98, 203, 36, -52, 34, -23, -1],
    [-6, -67, 70, 120, 33, 36, 222, -21, 25, 119, -1],
    [-45, 72, -9, 13, -43,  -52, -21, 220, 27, 120, -85],
    [38, 15, -41, 48, 37, 34, 25, 27, 173, 103, -198],
    [15, 58, 1, 24, -34, -23, 119, 120, 103, 235, -184],
],
    A3 =[
        [813,617, 0 , 0 , 0 ,0 ,0 ,0 ,0,0,-789],
        [-152, 636, 60, 0, 0, 0, 0, 0,  0,0, 222],
        [0, -71, -955, -179, 0, 0, 0, 0,  0,0, 558],
        [0, 0, -217, -677, -52, 0, 0, 0,  0,0, -153],
        [0, 0, 0, 80, -812, -24, 0, 0,  0,0,-819],
        [0, 0, 0, 0, 78, 392, 54, 0, 0,0,  -467],
        [0, 0, 0, 0, 0, -402, -933, -168, 0, 0 ,-693],
        [0, 0, 0, 0, 0, 0, 9, 62, -6, 0,-438],
        [0, 0, 0, 0, 0, 0, 0, 140, 640, 299, -120],
        [0, 0, 0, 0, 0, 0, 0, 0, -22, 63,54],
    ];

console.log(A3);

class MatrixCalc extends Component {
    constructor(a,b){
        super(a,b);

        const n = 3;
        const system = getSysten(n);

        this.state = {
            method: 'gauss',
            matrix : system.system,
            answer: (<div/>),
            n: n,
            nn:n,
            maxN:10
        };

        this.build = this.build.bind(this);
        this.fill = this.fill.bind(this);
    }


    //logic

    calculateHandler () {
        const method = this.state.method;
        let resolver;
        switch (method) {
            case methods[0][0]:{
                resolver = new Resolver.GausResolver();
                break;
            }
            case methods[1][0]:{
                resolver = new Resolver.GausResloverByColumns();
                break;
            }
            case methods[2][0]:{
                resolver = new Resolver.CholetskyResolver();
                break;
            }
            case methods[3][0]:{
                resolver = new Resolver.LUfixedUResolver();
                break;
            }
            case methods[4][0]:{
                resolver = new Resolver.SimpleRunResolver();
                break;
            }
        }
        try {
            const matrix = this.state.matrix,
                n =this.state.n;

            const system = new System(
                matrix.getSubMatrix(0,0,n),
                matrix.getSubMatrix(0,n,1,n).values
            );

            const {data, answer} = system.resolve(resolver);

            this.drawAnswer(data)
        }
        catch (e) {
            this.drawError(e)
        }
    }

    determinantHandler () {
        const method = this.state.method;
        let resolver;
        switch (method) {
            case methods[0][0]:{
                resolver = new Resolver.GausResolver();
                break;
            }
            case methods[1][0]:{
                resolver = new Resolver.GausResloverByColumns();
                break;
            }
            case methods[2][0]:{
                resolver = new Resolver.CholetskyResolver();
                break;
            }
            case methods[3][0]:{
                resolver = new Resolver.LUfixedUResolver();
                break;
            }
            case methods[4][0]:{
                resolver = new Resolver.SimpleRunResolver();
                break;
            }
        }
        try {
            const n = this.state.n,
                matrix = this.state.matrix.getSubMatrix(0,0,n);

            const {data, answer} = resolver.det(matrix);

            this.drawAnswer(data)
        }
        catch (e) {
            this.drawError(e)
        }
    }

    build () {
        let n = Number(this.state.nn);

        if (!isFinite(n)) {
            return this.drawError('n is not supported')
        }

        if (n === this.state.n ){
            this.setState({
                answer:""
            });
            return;
        }
        if (n > this.state.maxN || n < 2) {
            return this.drawError('n is not supported')
        }

        try {
            this.setState({
                n,
                matrix: this.state.matrix.resize(n+1, n),
                answer:""
            });
        }
        catch (e) {
            this.drawError(e.message);
        }

    }

    fill (type) {
        let filler;
        switch (type) {
            case "random":
                filler = function (i,j,el) {
                    el.value = Math.round((Math.random() * 9));
                };
                this.state.matrix.traverseByRow(filler);
                break;

            case "A1":
                filler = function (i,j,el) {
                    el.value = A1[i][j];
                };
                if (this.state.n !== 9){
                    this.setState({nn:9},() => {
                        this.build();
                        this.state.matrix.traverseByRow(filler);
                    });
                } else
                    this.state.matrix.traverseByRow(filler);

                break;

            case "A2":
                filler = function (i,j,el) {
                    el.value = A2[i][j];
                };
                if (this.state.n !== 10){
                    this.setState({nn:10},() => {
                        this.build();
                        this.state.matrix.traverseByRow(filler);
                    });
                } else
                    this.state.matrix.traverseByRow(filler);

                break;

            case "A3":
                filler = function (i,j,el) {
                    el.value = A3[i][j];
                };
                if (this.state.n !== 10){
                    this.setState({nn:10},() => {
                        this.build();
                        this.state.matrix.traverseByRow(filler);
                    });
                } else
                    this.state.matrix.traverseByRow(filler);

                break;

        }

        this.setState({
            answer:"",
        });
    }

    handleChange (fieldName) {
        return function (t,v,y) {
            const [val = v] = [y];
            this.setState({[fieldName]:val});
        }.bind(this);
    }

    changeMatrixCell (i,j) {
        return (_,val) => {

            if (!isFinite(val)){
                return;
            }

            this.state.matrix.get(i,j).value = Number(val);
            this.setState({
                n:this.state.n
            });
            // this.setState({matrix: this.state.matrix.copy});
        }
    }


    //render
    menuItems(values) {
        return values.map((v,i) => (
                <MenuItem
                    key={v[0]}
                    insetChildren={true}
                    value={v[0]}
                    primaryText={i + ') ' + v[1]}/>
            )
        );
    }

    errorBlock = (err) => (<Paper children={<CardText style={{color:red500}} children={['Error: ' +  err.toString()]}/>}/>);

    drawError (err) {
        this.setState({answer: this.errorBlock(err)});
    }

    drawAnswer (data) {

        let answer = (
            <Card>
                <CardText>
                    <div className="matrix_logs">
                        {renderHTML(data)}
                    </div>
                </CardText>
            </Card>
        );

        this.setState({answer});
    }



    render() {
        return (
              <div>
                  <Card>
                      <CardTitle title="Matrix calculator"/>
                      <CardText>
                          <div>
                              <div>
                                  {this.state.matrix.matrix.map((row,i) => {
                                      return (
                                          <div key={i} className="row">
                                              {row.map((el, j) => {
                                                  return (
                                                      <Paper  key={j} style={(j === this.state.matrix.n - 1 )?Object.assign({},styles.cell,{backgroundColor:orange500}):styles.cell}>
                                                          <TextField   style={styles.input}
                                                                       id={i+j+'id'}
                                                                       fullWidth={true}
                                                                       value={el.value}
                                                                       type="number"
                                                                       onChange={this.changeMatrixCell(i,j)}/>
                                                      </Paper>
                                                  );
                                              })}
                                          </div>)
                                  })}
                              </div>
                          </div>
                      </CardText>
                      <CardText>
                          <SelectField style={{flex:3}}
                                       autoWidth
                                       fullWidth={true}
                                       value={this.state.method}
                                       onChange={this.handleChange('method')}
                                       floatingLabelText="Method"
                          >
                              {this.menuItems(methods)}
                          </SelectField>
                          <div>
                              <TextField   value={this.state.nn}
                                           style={{width: 50}}
                                           onChange={this.handleChange('nn')}
                                           floatingLabelText="n"
                                           hintText="3"
                                           type="number"
                                           floatingLabelFixed={true}/>

                              <RaisedButton  style={{marginLeft: 10}} onTouchTap={this.build}
                                            label="Resize" />

                              <RaisedButton  style={{marginLeft: 10}} onTouchTap={() => this.fill('random')}
                                             label="Fill Random" />

                              <RaisedButton  style={{marginLeft: 10}} onTouchTap={() => this.fill('A1')}
                                             label="A1" />

                              <RaisedButton  style={{marginLeft: 10}} onTouchTap={() => this.fill('A2')}
                                             label="A2" />

                              <RaisedButton  style={{marginLeft: 10}} onTouchTap={() => this.fill('A3')}
                                             label="A3" />

                          </div>
                      </CardText>
                      <CardActions>
                          <RaisedButton onTouchTap={this.calculateHandler.bind(this)}
                                        primary
                                        label="Solve" />

                          <RaisedButton onTouchTap={this.determinantHandler.bind(this)}
                                        primary
                                        label="Determinant" />

                      </CardActions>
                  </Card>
                  <br/>
                  <br/>
                  {this.state.answer}
              </div>
        );
    }
}

export default MatrixCalc;
