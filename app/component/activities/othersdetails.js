/**
 * Created by archibold on 13/08/2018.
 */

import React , {Component} from 'react'
import {View, Text, FlatList} from 'react-native'
import NavBar  from '../_sharedComponent/navBar'
import firebaseApp from '../_sharedComponent/firebase_connector'

export default class Details extends Component{
    constructor(props){
        super(props);
        this.state={
            data:'',

        };

    }
    componentWillMount(){
        let itemArray = [];
        firebaseApp.database().ref().child("all-list").child(this.props.listkey).child("items").once('value', snap=>{
           snap.forEach(item=>{
               alert(JSON.stringify(item))
               //itemArray.push(item)
           });


        })
    }

    render(){
        return(
            <View style={{flex:1}}>
                <NavBar title={this.props.listname} showback backto="Expired List"/>
            </View>

        )
    }
}

