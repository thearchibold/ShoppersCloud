/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';


//react-redux
import { Provider, connect } from 'react-redux'
import RootApp from './app/component'
import configureStore from './app/redux/configureStore'

require('core-js/es6/array');
let store = configureStore();

let con = false;
export  default class App extends Component{

    constructor(props){
        super(props);
           this.state = {
            modalVisible:false
        }

    }

    componentWillMount(){
        console.disableYellowBox = true
    }
    render(){
        return(
            <Provider store={store}>
                <RootApp/>
            </Provider>
        )
    }

}



