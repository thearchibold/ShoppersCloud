/**
 * Created by archibold on 15/07/2018.
 */
import React, {Component} from 'react'
import  {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from'./constants'
import {Actions} from 'react-native-router-flux'


export default class  DashBoardButton extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <TouchableOpacity
                activeOpacity={0.5}
                style = {{flex:1, justifyContent:'center', alignItems:"center", margin:15}}
                onPress = {
                    this.props.goto
                    }
            >
                <View style = {css.icon}>
                    <Icon name ={this.props.iconname} size={35}/>
                </View>

                <Text style = {{color:colors.db_btn_text, margin:2}}>{this.props.btntext}</Text>
            </TouchableOpacity>
        )
    }

}

const css =StyleSheet.create({
    btn:{
        borderWidth: 1,
        borderColor: colors.border_color,

        justifyContent:'center',
        alignItems:'center',

    },
    icon:{

        justifyContent:'center',
        alignItems:'center',
        width: 60,
        height:60
    }
})