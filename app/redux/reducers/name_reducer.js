/**
 * Created by archibold on 29/06/2018.
 */

//
import {ADD_NAME_DONE,ADD_NAME,GET_NAME,GET_NAME_DONE} from '../constant'
import store from '../store'


//reducer is a function

export const nameReducer = (state= store, action) =>{
    switch (action.type){
        case ADD_NAME:
            let oldArr = state.names;
            oldArr.push(action.data);
            return {
                ...state,
                isAdding:true,
                names: oldArr
            };
        case ADD_NAME_DONE:

        default:
            return state

    }
};