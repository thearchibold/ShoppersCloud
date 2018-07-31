/**
 * Created by archibold on 13/07/2018.
 */
import React, {Component} from 'react'
import {View, Text, StyleSheet,TouchableOpacity} from 'react-native'
import {colors} from './constants'
import {connect} from 'react-redux'
import {enterPin} from '../../redux/actions'

const KeyPadItem = (props)=>{
        return(
            <TouchableOpacity activeOpacity={0.5} style={css.item} onPress = {() =>{
                props.enterPin(props.keynumber)
            }}>
                <Text style={css.numtext}>{props.keynumber}</Text>
            </TouchableOpacity>
        )

};
const css = StyleSheet.create({
   item:{
       flex:1,
       borderColor: colors.loginblue,
       borderWidth: 1,
       borderRadius: 400,
       height:50,
       width:10,
       margin: 2,
       justifyContent:'center',
       alignItems:'center',

   },
    numtext:{
       fontWeight:'bold',
        fontSize:20,
        color:colors.loginblue
    }
});

function mapStateToProps(state) {
   return {
       pin: state
   }
}

function mapDispatchToProps(dispatch) {
 return{
     enterPin:(pin)=>{
         dispatch(enterPin(pin))
     }
 }
}
export  default  connect(mapStateToProps, mapDispatchToProps)(KeyPadItem)
