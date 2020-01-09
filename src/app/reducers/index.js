import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import ajax from './ajaxStatusReducer';

const rootReducer = combineReducers({
    routing: routerReducer,
    ajaxCount: ajax
});

export default rootReducer;