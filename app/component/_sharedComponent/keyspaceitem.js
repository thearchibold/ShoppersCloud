/**
 * Created by archibold on 13/07/2018.
 */
import React, {Component} from 'react'
import {View, Text ,StyleSheet} from 'react-native'


export default class KeySpace extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <View style={css.keycontainer}>
                <Text>{this.props.pinnumber}</Text>
            </View>
        )
    }
}

const css = StyleSheet.create({
   keycontainer:{
       height:60,
       width:55,
       margin: 10,
       borderBottomWidth:1,
       borderBottomColor:'white'
   }
});