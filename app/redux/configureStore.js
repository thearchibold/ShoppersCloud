/**
 * Created by archibold on 29/06/2018.
 */
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'


export default function configureStore() {
    let store = createStore(rootReducer, applyMiddleware(thunk));
    return store;
}