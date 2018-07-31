/**
 * Created by archibold on 29/06/2018.
 */
import {combineReducers} from 'redux'
import {nameReducer} from './name_reducer'
import {pinReducer} from './pinreducer'
import {listReducer} from './listReducer'

//this is just to combine all the reducers in the app and export them as one
const rootReducer = combineReducers({
    nameReducer,
    pinReducer,
    listReducer
});

export default rootReducer