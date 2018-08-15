/**
 * Created by archibold on 22/07/2018.
 */
import { SAVE_LIST, UPDATE_LIST, ONLINE,OFFLINE } from '../constant'
import store from '../store'

export const  listReducer = (state = store, action) => {
    switch (action.type){
        case SAVE_LIST:
            return{
                ...state,
                currentlist: action.currentList,
                pastlist:action.pastList
            };

        case UPDATE_LIST:
            if(action.toUpdate === 'currentlist') {
                return {
                    ...state,
                    currentlist: action.list
                };
            }
            if(action.toUpdate === 'pastlist'){
                alert(action.toUpdate);
                return {
                    ...state,
                    pastlist: action.list
                };
            }
        case OFFLINE:
            return{
                ...state,
                offline:true
            };
        case ONLINE:
            return{
                ...state,
                offline:false
            }
        default:
            return state
    }

}