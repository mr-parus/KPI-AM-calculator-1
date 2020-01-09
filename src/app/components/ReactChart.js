import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import {orange500, blue500} from 'material-ui/styles/colors';


class ReactChart extends Component {
    componentDidMount () {
        this.mount = true;
        const simplefunc = this.props.config.func,
            iterations = this.props.config.iterations,
            f = simplefunc.execute,
            loc = this.props.config.loc,
            iterPoints =  [...this.props.config.IterationPoints.values()],
            config = {
                type: 'line',
                data: {
                    labels: iterations?Object.keys(iterPoints):[],
                    datasets:[]
                }
            };


        config.data.datasets[0] = iterations?
            {
                label: 'Iteration Points',
                data: iterPoints,
                borderColor: orange500,
                fill: false
            }:{
                label: simplefunc.toString(),
                data: [],
                borderColor: blue500,
                fill: false
        };

        const chart = new Chart(this.canvas.getContext('2d'), config);
        this.setState({
            chart
        });


        if (!iterations)
            ((n, min, max) => {
            const div = Math.abs(max - min) / n;
            let sum = Number(min);
            for (let i = 0; i < n; i++) {
                ((a) =>  {
                    setImmediate(() => {
                        if (this.mount){
                            chart.data.labels.push(a.toFixed(2));
                            chart.data.datasets[0].data.push(f(a));
                            this.setState({
                                chart
                            });
                        }
                    });
                })(sum);
                sum+=div;
            }
        })(100, +loc[0], +loc[1]);

    }

    componentDidUpdate () {
        this.state.chart.update();
    }

    componentWillUnmount() {
        this.mount = false;
        this.state.chart.destroy();
    }

    render () {
        return (
            <canvas ref={(canvas) => { this.canvas = canvas }} />
        )
    }
}

ReactChart.propTypes = {
    config: PropTypes.object.isRequired
};

export default ReactChart