'use strict';

import React from 'react';
import { AppContainer } from 'react-hot-loader';
import {render, unmountComponentAtNode} from 'react-dom';
import configureStore, { history } from './app/store/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


const initialState = {},
    mountNode = document.getElementById('app'),
    store = configureStore(initialState);


const renderApp = () => {
    const Root = require('./app/Root').default;
    render(
        <AppContainer>
            <Root store={store} history={history} />
        </AppContainer>, mountNode);
};


if (module.hot) {
    const reRenderApp = () => {
        // try {
            renderApp();
        // } catch (error) {
        //     const RedBox = require('redbox-react').default;
        //     render(<RedBox error={error} />, mountNode);
        // }
    };

    module.hot.accept('./app/Root', () => {
        setImmediate(() => {
            unmountComponentAtNode(mountNode);
            reRenderApp();
        });
    });
}

renderApp();