import React, {Component} from 'react';
import { Switch, NavLink, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import {List, ListItem } from 'material-ui/List';
import {Map} from 'immutable';

import EquationCalculator from './Calculator/EquationCalculator';
import MatrixCalc from './Calculator/MatrixCalc';


const activeStyle= {
    color:'red'
};

class App extends Component {

    static contextTypes = {
        store: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
    };

    constructor(a,b){
        super(a,b);
        this.state = {
            open:true,
            drawerWidth:256,
            docked: true,
            calc: EquationCalculator,
            matrix: MatrixCalc
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    redirect (path) {
      this.context.router.history.push(path);
      if (this.state.open && !this.state.docked){
          this.setState({open:false})
      }
    };

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions () {
        if(window.innerWidth <= 800) {
            if (this.state.docked)
                this.setState({docked: false, open: false});
        }else {
            if (!this.state.docked)
                this.setState({docked: true,  open: true});
        }
    }


    appState () {
        return {
            get: () => {
                return this.state;
            },
            set: (obj) => {
                this.setState(obj);
            }
        }
    }



    handleToggle = () => this.setState({open: !this.state.open});

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <AppBar
                        onLeftIconButtonTouchTap={this.handleToggle}/>


                    <Drawer disableSwipeToOpen open={this.state.open} docked={this.state.docked}>
                        <div style={{visibility:(!this.state.docked)?'visible':'hidden',display:'flex',justifyContent: 'flex-end'}}>
                            <IconButton onTouchTap={this.handleToggle}>
                                <CloseIcon/>
                            </IconButton>
                        </div>

                        <List>
                            <Subheader>MYCALC</Subheader>
                            <hr/>
                            <MenuItem onTouchTap={() => this.redirect('')} primaryText="Equations calculator" />
                            <MenuItem onTouchTap={() => this.redirect('matrix')} primaryText="Matrix calculator" />
                            <MenuItem onTouchTap={() => this.redirect('about')} primaryText="About" />
                        </List>
                    </Drawer>

                    <div style={{paddingLeft:this.state.docked?this.state.drawerWidth:0, margin:'20px', transition:'.25s'}}>
                        <Switch>
                            <Route exact path="/"  component={this.state.calc} />
                            <Route path="/matrix" component={this.state.matrix} />
                            <Route path="/about" component={() => (<div style={{color:'white'}}>Hello from hell!</div>)} />
                            <Route component={() => (<div style={{color:'White'}}>Not Found</div>)} />
                        </Switch>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {};
App.defaultProps = {};

export default App;
