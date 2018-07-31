/**
 * Created by archibold on 13/07/2018.
 */
import {ENTER_PIN, DELETE_PIN, SAVE_PIN, FETCH_USER} from '../constant'
import store from '../store'


export const pinReducer  = (state=store, action ) => {
    switch(action.type){
        case ENTER_PIN:

            return{
                ...state,
                pin: action.pin
            };

        case SAVE_PIN:
            console.log("save pin "+action.pin);
            return{
                ...state,
                pin:action.pin
            };
        case FETCH_USER:
            return{
                ...state,
                userdetails:action.userData
            };
        default:
           return  state
    }
};