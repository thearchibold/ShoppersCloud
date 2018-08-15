/**
 * Created by archibold on 29/06/2018.
 */
import {ADD_NAME,UPDATE_LIST, FETCH_USER, ENTER_PIN, OFFLINE,ONLINE, SAVE_PIN,SAVE_LIST} from './constant'
import firebaseApp from '../component/_sharedComponent/firebase_connector'



export function addNameToList(data) {
    return (dispatch)=>{
        dispatch({
            type: ADD_NAME,
            data
        })
    }
}

export function enterPin(pin) {
    return (dispatch)=>{
        dispatch({
            type:ENTER_PIN,
            pin
        })
    }
}


export function goOffline() {
    return(dispatch)=>{
        dispatch({
            type: OFFLINE
        })
    }
}

export function goOnline() {
    return(dispatch)=>{
        dispatch({
            type: ONLINE
        })
    }
}
export function savePin(pin) {
    return(dispatch)=>{
        dispatch({
            type:SAVE_PIN,
            pin
        })
    }
}

export function saveUserData(userData) {
    return(dispatch)=>{
        dispatch({
            type:'SAVE_DATA',
            userData
        })
    }
}


//making an async call just put the fetch call insife the fetch method
export function fetchUser(pin) {
    let userPin = pin;
    let userData='';
    return(dispatch)=> {
        firebaseApp.database().ref('/users/' + userPin).once('value').then(function(snapshot) {
            userData = (snapshot.val()) ;
            dispatch({
                type: FETCH_USER,
                userData
            })
      })
    }
}

export function fetchUserList(pin) {

    let dateNow = new Date();
    dateNow.setHours(0);
    dateNow.setMinutes(0);
    dateNow.setSeconds(0);
    dateNow = dateNow.setMilliseconds(0);

    let currentList = [];
    let pastList = [];

    return (dispatch)=> {
        let listLink = firebaseApp.database().ref().child("list").child(pin).child("currentlist");
        listLink.once('value', (snap) => {
            snap.forEach((child) => {
                let listdate = child.val().date;
                listdate = new Date(listdate);
                listdate.setHours(0);
                listdate.setMinutes(0);
                listdate.setSeconds(0);
                listdate = listdate.setMilliseconds(0);
                if(dateNow <= listdate ){
                    currentList.push(
                        child.val()
                    )
                }else{
                    pastList.push(
                        child.val()
                    )
                }
            })
        });
        dispatch({
            type:SAVE_LIST,
            currentList,
            pastList
        })
    }
}

export function updateUserList(list, toUpdate='pastlist') {
    return (dispatch)=>{
       dispatch({
           type:UPDATE_LIST,
           list,
           toUpdate
       })
    }

}

