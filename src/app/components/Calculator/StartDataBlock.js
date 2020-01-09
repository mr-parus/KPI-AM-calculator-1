import React, {Component} from 'react';
import {Card,CardActions,CardHeader, CardMedia, CardText,CardTitle} from 'material-ui/Card';
import {SimpleFunction} from '../../../../utils/methods/help/Function'
import ReactChart from '../ReactChart'



function bisectionStarter (iterationData, func) {
    return {
        keys:['#i','x(i-1)', 'x(i)','|x(i) - x(i-1)|'],
        iterationData: iterationData.map(id => {
            return {
                '#i': id.iterationIndex,
                'x(i-1)': id.previousValue,
                'x(i)': id.currentValue,
                '|x(i) - x(i-1)|': Math.abs(id.previousValue - id.currentValue)
            }
        }),
        startDataBlock: (config) =>  (
            <Card>
                <CardTitle  title="Start Step"/>
                <CardText>
                    <ReactChart config={config}/>
                    <p>Function: {new SimpleFunction(func).full_pattern}</p><br/><br/>
                    <p>Iterations Count: {iterationData[0].iterationsCount}</p><br/><br/>
                    <p>Exit Criterion Value: {iterationData[0].stopCriterionValue}</p><br/><br/>
                </CardText>
            </Card>)
    };
}

function combineStarter (iterationData, func) {
     return {
         keys:[
             '#i',
             'x(i-1) Chord',
             'x(i) Chord',
             'x(i-1) Tangent',
             'x(i) Tangent',
             '|x(i) Tangent - x(i-1) Chord|'
         ],
         iterationData: iterationData.slice(1).map(id => {
             return {
                 '#i': id.iterationIndex,
                 'x(i-1) Chord': id.previousChord,
                 'x(i) Chord': id.currentChord,
                 'x(i-1) Tangent': id.previousTangent,
                 'x(i) Tangent': id.currentTangent,
                 '|x(i) Tangent - x(i-1) Chord|': Math.abs(id.currentTangent - id.currentChord)
             }
         }),
         startDataBlock: (config) =>  (
             <Card>
                 <CardTitle  title="Start Step"/>
                 <CardText>
                     <ReactChart config={config}/>
                     <p>Function: {new SimpleFunction(func).full_pattern}</p><br/><br/>
                     <p>First Derivative: {iterationData[0].firstDerivative}</p><br/><br/>
                     <p>Start Chord: {iterationData[0].currentChord}</p><br/><br/>
                     <p>Start Tangent: {iterationData[0].currentTangent}</p><br/><br/>
                     <p>Exit Criterion Value: {iterationData[0].stopCriterionValue}</p><br/><br/>
                 </CardText>
             </Card>)
        };
    }

function simpleStarter (iterationData, func) {
        return {
            keys:[
                '#i',
                'x(i-1)',
                'x(i)',
                '|x(i)-x(i-1)|'
            ],
            iterationData: iterationData.map(id => {
                return {
                    '#i': id.iterationIndex,
                    'x(i-1)': id.previousValue,
                    'x(i)': id.currentValue,
                    '|x(i)-x(i-1)|': Math.abs(id.currentValue - id.previousValue)
                }
            }),
            startDataBlock: (config) =>  (
                <Card>
                    <CardTitle  title="Start Step"/>
                    <CardText>
                        <ReactChart config={config}/>
                        <p>Function: {new SimpleFunction(func).full_pattern}</p><br/><br/>
                        <p>First Derivative: {new SimpleFunction(func).derivate.full_pattern}</p><br/><br/>
                        <p>Second Derivative: {new SimpleFunction(func).derivate.derivate.full_pattern}</p><br/><br/>
                        <p>Alpha: {iterationData[0].alpha}</p><br/><br/>
                        <p>Gamma: {iterationData[0].gamma}</p><br/><br/>
                        <p>Lambda: {iterationData[0].lambda}</p><br/><br/>
                        <p>q: {iterationData[0].q}</p><br/><br/>
                        <p>Exit Criterion Value: {iterationData[0].stopCriterionValue}</p><br/><br/>
                    </CardText>
                </Card>)
        };
    }

function chordStarter (iterationData, func) {
    return {
        keys:[
            '#i',
            'x(i-1)',
            'x(i)',
            '|x(i)-x(i-1)|'
        ],
        iterationData: iterationData.slice(1).map(id => {
            return {
                '#i': id.iterationIndex,
                'x(i-1)': id.previousValue,
                'x(i)': id.currentValue,
                '|x(i)-x(i-1)|': Math.abs(id.currentValue - id.previousValue)
            }
        }),
        startDataBlock: (config) =>  (
            <Card>
                <CardTitle  title="Start Step"/>
                <CardText>
                    <ReactChart config={config}/>
                    <p>Function: {new SimpleFunction(func).full_pattern}</p><br/><br/>
                    <p>First Derivative: {iterationData[0].firstDerivative}</p><br/><br/>
                    <p>Second Derivative: {iterationData[0].secondDerivative}</p><br/><br/>
                    <p>Start value: {iterationData[0].startValue}</p><br/><br/>
                    <p>x0: {iterationData[0].currentValue}</p><br/><br/>
                    <p>Exit Criterion Value: {iterationData[0].stopCriterionValue}</p><br/><br/>
                </CardText>
            </Card>)
    };
}

function newtonStarter (iterationData, func) {
    return {
        keys:[
            '#i',
            'x(i-1)',
            'x(i)',
            '|x(i)-x(i-1)|'
        ],
        iterationData: iterationData.slice(1).map(id => {
            return {
                '#i': id.iterationIndex,
                'x(i-1)': id.previousValue,
                'x(i)': id.currentValue,
                '|x(i)-x(i-1)|': Math.abs(id.currentValue - id.previousValue)
            }
        }),
        startDataBlock: (config) =>  (
            <Card>
                <CardTitle  title="Start Step"/>
                <CardText>
                    <ReactChart config={config}/>
                    <p>Function: {new SimpleFunction(func).full_pattern}</p><br/><br/>
                    <p>First Derivative: {iterationData[0].firstDerivative}</p><br/><br/>
                    <p>Alpha: {iterationData[0].alpha}</p><br/><br/>
                    <p>Start Value: {iterationData[0].currentValue}</p><br/><br/>
                    <p>Exit Criterion Value: {iterationData[0].stopCriterionValue}</p><br/><br/>
                </CardText>
            </Card>)
    };
}

function newtonSimpleStarter (iterationData, func) {
    return {
        keys:[
            '#i',
            'x(i-1)',
            'x(i)',
            '|x(i)-x(i-1)|'
        ],
        iterationData: iterationData.slice(1).map(id => {
            return {
                '#i': id.iterationIndex,
                'x(i-1)': id.previousValue,
                'x(i)': id.currentValue,
                '|x(i)-x(i-1)|': Math.abs(id.currentValue - id.previousValue)
            }
        }),
        startDataBlock: (config) =>  (
            <Card>
                <CardTitle  title="Start Step"/>
                <CardText>
                    <ReactChart config={config}/>
                    <p>Function: {new SimpleFunction(func).full_pattern}</p><br/><br/>
                    <p>First Derivative: {iterationData[0].firstDerivative}</p><br/><br/>
                    <p>Alpha: {iterationData[0].alpha}</p><br/><br/>
                    <p>Start Value: {iterationData[0].currentValue}</p><br/><br/>
                    <p>First Derivative of Start Value: {new SimpleFunction(func).execute(iterationData[0].currentValue)}</p><br/><br/>
                    <p>Exit Criterion Value: {iterationData[0].stopCriterionValue}</p><br/><br/>
                </CardText>
            </Card>)
    };
}

function newtonDiscreetStarter (iterationData, func) {
    return {
        keys:[
            '#i',
            'x(i-1)',
            'x(i)',
            'h(i)',
            '|x(i)-x(i-1)|'
        ],
        iterationData: iterationData.slice(1).map(id => {
            return {
                '#i': id.iterationIndex,
                'x(i-1)': id.previousValue,
                'x(i)': id.currentValue,
                'h(i)': id.hkValue,
                '|x(i)-x(i-1)|': Math.abs(id.currentValue - id.previousValue)
            }
        }),
        startDataBlock: (config) =>  (
            <Card>
                <CardTitle  title="Start Step"/>
                <CardText>
                    <ReactChart config={config}/>
                    <p>Function: {new SimpleFunction(func).full_pattern}</p><br/><br/>
                    <p>First Derivative: {new SimpleFunction(func).derivate.full_pattern}</p><br/><br/>
                    <p>Alpha: {iterationData[0].alpha}</p><br/><br/>
                    <p>Start Value: {iterationData[0].currentValue}</p><br/><br/>
                    <p>H(i): h(x) = 1/8 * (1/2) * i</p><br/><br/>
                    <p>Exit Criterion Value: {iterationData[0].stopCriterionValue}</p><br/><br/>
                </CardText>
            </Card>)
    };
}

function stefansonStarter (iterationData, func) {
    return {
        keys:[
            '#i',
            'x(i-1)',
            'x(i)',
            '|x(i)-x(i-1)|'
        ],
        iterationData: iterationData.slice(1).map(id => {
            return {
                '#i': id.iterationIndex,
                'x(i-1)': id.previousValue,
                'x(i)': id.currentValue,
                '|x(i)-x(i-1)|': Math.abs(id.currentValue - id.previousValue)
            }
        }),
        startDataBlock: (config) =>  (
            <Card>
                <CardTitle  title="Start Step"/>
                <CardText>
                    <ReactChart config={config}/>
                    <p>Function: {new SimpleFunction(func).full_pattern}</p><br/><br/>
                    <p>First Derivative: {iterationData[0].firstDerivative}</p><br/><br/>
                    <p>Alpha: {iterationData[0].alpha}</p><br/><br/>
                    <p>Start Value: {iterationData[0].currentValue}</p><br/><br/>
                    <p>Exit Criterion Value: {iterationData[0].stopCriterionValue}</p><br/><br/>
                </CardText>
            </Card>)
    };
}

function lobachevskyStarter (iterationData, func) {
    // console.log(iterationData);
    const bkKeys = Object.keys(iterationData[0].current_bk).map(bk => 'Cx^' + bk).reverse();

    return {
        keys:["#i",...bkKeys ,'normal'],
        iterationData: iterationData.slice(0,-1).map(id => {

            let bks = Object.assign({},...Object.entries(id.current_bk).reverse().map(a=>{
               return {['Cx^'+ a[0]]:a[1]};
            }));

            return Object.assign({},bks,{
                '#i': id.iterationIndex,
                'normal': id.normal,
            });
        }),
        roots: iterationData[iterationData.length - 1].roots,
        startDataBlock: () =>  (
            <Card>
                <CardTitle  title="Start Step"/>
                <CardText>
                    <p>Function: {new SimpleFunction(func).full_pattern}</p><br/><br/>
                    <p>Exit Criterion Value: {iterationData[0].stopCriterionValue}</p><br/><br/>
                </CardText>
            </Card>)
    };
}




const getStartDataFromIterationData =  (iterationData, methodName, func) => {
   let starter;
    switch (methodName) {
        case 'bisection':
            starter = bisectionStarter(iterationData, func);
            break;
        case 'combine':
            starter = combineStarter(iterationData, func);
            break;
        case 'sim':
            starter = simpleStarter(iterationData, func);
            break;
        case 'chord':
            starter = chordStarter(iterationData, func);
            break;
        case 'newtontangent':
        case 'newton':
            starter = newtonStarter(iterationData, func);
            break;
        case 'newtonsimple':
            starter = newtonSimpleStarter(iterationData, func);
            break;
        case 'newtondiscreet':
            starter = newtonDiscreetStarter(iterationData, func);
            break;
        case 'newtonstefanson':
            starter = stefansonStarter(iterationData, func);
            break;
        case 'lobachevsky':
            starter = lobachevskyStarter(iterationData, func);
            break;
    }

    return Object.assign(starter, {
        simplefunc:new SimpleFunction(func),
        'chart':(config)=>(<ReactChart config={config}/>)});
};


export default getStartDataFromIterationData;
