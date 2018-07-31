/**
 * Created by archibold on 28/06/2018.
 */
import React, {Component} from 'react';
import {View, Text,StyleSheet,FlatList,TouchableOpacity, ToastAndroid} from 'react-native'

import NavBar  from '../_sharedComponent/navBar'
import { FloatingAction } from 'react-native-floating-action';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'


const HomePage = (props) =>{


    const {names, isAdding} = props.names;
    return(
        <View style = {{flex:1}}>
            <View>
                <NavBar title="REDUX BASICS" />
            </View>

            <View style = {{flex:1}}>
                <FlatList
                    data = {names}
                    renderItem= {({item,index})=>{
                        return(
                            <TouchableOpacity
                                onPress = {()=>{ToastAndroid.showWithGravity(String.parse(index),ToastAndroid.SHORT,ToastAndroid.TOP)}}
                                style={{width:'100%', margin:10, height:20}}
                                key = {index}>
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />

                <FloatingAction
                    style = {{marginBottom:'10%'}}
                    actions={actions}
                    onPressItem={
                        (name) => {
                            switch (name){
                                case 'bt_additem':
                                    Actions.addname();
                            }
                        }
                    }
                />
            </View>


        </View>
    )
};

const css = StyleSheet.create({
    navbar:{
        flexDirection:'row',
        height:50,
        width:'100%',
        borderBottomColor:'#ccc',
        borderBottomWidth:0.7,
        justifyContent:'space-around',
        alignItems:'center'
    }
});
const actions = [ {
    text: 'Add Name',
    name: 'bt_additem',
    position: 0
}];

function mapStateToProps(state) {
   return{
       names:state.nameReducer
   }
}



export default connect(mapStateToProps)(HomePage);