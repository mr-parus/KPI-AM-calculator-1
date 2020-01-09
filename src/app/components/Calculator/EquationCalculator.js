import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card,CardActions,CardHeader, CardMedia, CardText,CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableFooter,
    TableRowColumn,
} from 'material-ui/Table';
import axios from 'axios';
import {Map} from 'immutable';
import LinearProgress from 'material-ui/LinearProgress';
import {orange500, blue500, red500} from 'material-ui/styles/colors';
import getStartDataFromIterationData from './StartDataBlock';
import Toggle from 'material-ui/Toggle';


const styles = {
    errorStyle: {
        color: orange500,
    },
    underlineStyle: {
        borderColor: orange500,
    },
    floatingLabelStyle: {
        color: orange500,
    },
    floatingLabelStyle1: {
        color: blue500,
    }
};


const methods = [
    ['bisection','Bisection Method'],
    ['chord', 'Chords Method'],
    ['newton', 'Newton\'s Method'],
    ['newtonsimple', 'Newton\'s simplified Method'],
    ['newtondiscreet', 'Newton\'s discreet Method'],
    ['newtonstefanson', 'Newton-Stefanson\'s  Method'],
    ['newtontangent', 'Tangents  Method'],
    ['combine','Combine Method'],
    ['sim', 'Simple Iterations'],
    ['lobachevsky', 'Lobachevsky Method']
];



class EquationCalculator extends Component {
    static contextTypes = {
        store: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
    };

    constructor(p,c) {
        super(p,c);
        this.state = {
            form:Map({
                method: 'bisection',
                accuracy: '',
                func: 'f(x) =  log(1+x^2)-(sin(x))^3 + x - (1+(cos(x))^3)^(1/2)',
                startPoint: '0.1',
                endPoint: '2'
            }),
            loading: false,
            answer: (<div/>),
            expanded: true
        };
    };


    //logic
    calculateHandler () {
        if (this.state.loading)
            return;

        this.setState({answer:''});
        this.setState({loading: true});


        const postData = this.state.form.toObject();

        if (this.testPi(postData.startPoint)) {
            postData.startPoint = this.getPiSign(postData.startPoint) * Math.PI;
        }

        if (this.testPi(postData.endPoint)) {
            postData.endPoint = this.getPiSign(postData.endPoint) * Math.PI;
        }

        axios.post('/calc', postData)
            .then(res => {
                if (res.status === 200){
                    return res.data;
                }
                throw Error('Server Error.');
            })
            .then(data => {
                if (data.success) {
                    this.drawAnswer(data,postData.method, postData.func, [postData.startPoint, postData.endPoint]);
                } else {
                    this.drawError(data.msg);
                }
                this.setState({loading: false});
            })
            .catch(e => {
                this.setState({loading: false});
            })
    }


    testPi (x) {
        return /^-?pi$/.test(x.toLowerCase());
    }

    getPiSign (x) {
        return Math.sign(/^-/.test(x))?-1:1;
    }


    drawAnswer (data, method, func, localization) {
        try {
            const {keys,roots, chart, iterationData, startDataBlock, simplefunc} = getStartDataFromIterationData(data.data, method, func);


            const IterationPoints = new Set(iterationData.map(id => {
                return id['x(i)'] || id['x(i)Chord'];
            }));


            const chartData = {
                IterationPoints,
                loc: localization,
                func: simplefunc,
                iterations: false
            };


            let answer = (
                <div>
                    {data.msg.length?this.errorBlock(data.msg):""}
                    <br/>
                    {startDataBlock(chartData)}
                    <br/>
                    <Card>
                        <CardTitle title="Iterations"/>
                        {(method === 'lobachevsky' || method === 'combine')?"":chart(Object.assign({},chartData,{iterations:true}))}
                        <CardText>
                            <Table
                                   style={{overflowX:'scroll'}}
                                   height="350px"
                                   selectable={false}
                                   fixedFooter={true}
                                   fixedHeader={true}
                                   multiSelectable={false}>
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                    <TableRow hoverable>
                                        {keys.map((k, i) => {
                                            return (
                                                <TableHeaderColumn  key={i}>{k}</TableHeaderColumn>);
                                        })}
                                    </TableRow>
                                </TableHeader>

                                <TableBody
                                    preScanRows={false}
                                    displayRowCheckbox={false}>
                                    {iterationData.map((d, i) => {
                                        return (
                                        <TableRow key={i}>
                                          {keys.map((key, i) =>
                                              <TableRowColumn key={i}>
                                                  <div className="wrapper">
                                                      {JSON.stringify(d[key]).replace(/\"/g, '')}
                                                      <div className="tooltip"> {JSON.stringify(d[key]).replace(/\"/g, '')}</div>
                                                  </div>
                                              </TableRowColumn>)}
                                        </TableRow>);
                                    })}
                                </TableBody>
                                <TableFooter  adjustForCheckbox={false}>
                                    <TableRow>
                                        {keys.map((k, i) => {
                                            return (
                                                <TableHeaderColumn key={i}>{k}</TableHeaderColumn>);
                                        })}
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardText>
                    </Card>
                    <br/>
                    {(method ==="lobachevsky")?
                        (<Card>
                            <CardTitle title="Roots"/>
                            <CardText>
                                <ul>
                                    {roots.map((r,i) =>(<li key={i}>+/- {r.split('').reverse().map((l,i) => {
                                        return !((i)%3)?l + ' ':l;
                                    }).reverse()}<br/><br/></li>))}
                                </ul>
                            </CardText>
                        </Card>)
                        :""}
                </div>
            );

            this.setState({answer});

        }
        catch (er){
           this.drawError(er);
        }

    }

    errorBlock = (err) => (<Paper children={<CardText style={{color:red500}} children={['Error: ' +  err.toString()]}/>}/>);

    drawError(err) {
        this.setState({answer: this.errorBlock(err)});
    }


    //events
    handleChange (fieldName) {
        return function (t,v,y) {
            const [val = v] = [y];
            this.setState({form:this.state.form.set(fieldName,val)})
        }.bind(this);
    }

    handleToggle = (event, toggle) => {
        this.setState({expanded: !toggle});
    };

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

    render() {
        return (
            <div>
                <Card>
                    {this.state.loading ? <LinearProgress mode="indeterminate" color={orange500}/>:<div style={{height:4}}/>}
                    <CardTitle title="Equations solving"/>
                    <CardText>
                        <Toggle
                            toggled={!this.state.expanded}
                            onToggle={this.handleToggle}
                            labelPosition="right"
                            label="This will show input info."
                        />
                    </CardText>
                    <CardMedia expandable={this.state.expanded}>
                       <CardText className="rules">
                           <ol>
                               <li>
                                   <h4>Function must start with 'f(x) = '</h4>
                               </li>
                               <li>
                                   <h4>Supported Functions:</h4>
                                   <ul>
                                       <li>Math.pow(x,2) => x^2</li>
                                       ...
                                       <li>Math.sin(x) => sin(x)</li>
                                       <li>Math.cos(x) => cos(x)</li>
                                       <li>tg(x) => tan(x,2)</li>
                                       <li>ch(x) => cosh(x,2)</li>
                                       <li>sh(x) => sinh(x,2)</li>
                                       ...
                                       <li>ln(x) => log(x)</li>
                                       <li>Math.log2(x) => log(x,2)</li>
                                       ...
                                       <li>|x| => abs(x)</li>
                                   </ul>
                               </li>
                               <li>
                                   <h4>Supported Constants:</h4>
                                   <ul>
                                       <li>Math.E => e</li>
                                       <li>Math.Pi => pi</li>
                                   </ul>
                               </li>
                               <li>
                                   <h4>Supported localization values: </h4>
                                   <ul>
                                       <li>numbers</li>
                                       <li>+/- Pi</li>
                                   </ul>
                               </li>
                               <li>
                                   <h4>Minimal accurasy value is 1E-10 </h4>
                               </li>
                           </ol>





                       </CardText>
                    </CardMedia>
                    <CardText expandable={false}>
                        <div style={{display: this.props.mobile?'flex':'block'}}>
                            <TextField   style={{flex:6}}
                                         fullWidth={!this.props.mobile}
                                         value={this.state.form.get('func')}
                                         onChange={this.handleChange('func')}
                                         hintText="f(x) = "
                                         floatingLabelStyle={styles.floatingLabelStyle1}
                                         floatingLabelText="Function"
                                         floatingLabelFixed={true}/>
                            <div style={{flex:1}}/>
                            <SelectField style={{flex:3}}
                                         autoWidth
                                         fullWidth={!this.props.mobile}
                                         value={this.state.form.get('method')}
                                         onChange={this.handleChange('method')}
                                         floatingLabelText="Method"
                            >
                                {this.menuItems(methods)}
                            </SelectField>
                        </div>
                        <div style={{display:'flex'}}>
                            <TextField   style={{flex:2.5}}
                                         value={this.state.form.get('startPoint')}
                                         onChange={this.handleChange('startPoint')}
                                         floatingLabelStyle={styles.floatingLabelStyle}
                                         floatingLabelText="Start Point"
                                         disabled={this.state.form.get('method') === 'lobachevsky'}
                                         floatingLabelFixed={true}/>
                            <div style={{flex:1}}/>
                            <TextField   style={{flex:2.5}}
                                         value={this.state.form.get('endPoint')}
                                         onChange={this.handleChange('endPoint')}
                                         disabled={this.state.form.get('method') === 'lobachevsky'}
                                         floatingLabelStyle={styles.floatingLabelStyle}
                                         floatingLabelText="End Point"
                                         floatingLabelFixed={true}/>
                            <div style={{flex:1}}/>
                            <TextField   style={{flex:3}}
                                         value={this.state.form.get('accuracy')}
                                         onChange={this.handleChange('accuracy')}
                                         floatingLabelText="Accuracy"
                                         hintText="0.01"
                                         floatingLabelFixed={true}/>
                        </div>
                    </CardText>
                    <CardActions>
                        <RaisedButton onTouchTap={this.calculateHandler.bind(this)}
                                      primary
                                      disabled={this.state.loading}
                                      label="Calculate" />
                    </CardActions>
                </Card>

                <br/>
                {this.state.answer}
            </div>
        );
    }
}

export default EquationCalculator;
