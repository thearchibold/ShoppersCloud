/**
 * Created by archibold on 28/06/2018.
 */
import React , {Component} from 'react';
import { View, Text, StyleSheet,TouchableOpacity,StatusBar} from 'react-native';
import {Actions} from'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
const NavBar = (props)=>{

    return(
        props.showback ?
            <View
                elevation={1}
                style = {css.showbacknavbar}>
                    <TouchableOpacity  style={{flex:1, flexDirection:'row', alignItems:'center', height:'100%',padding:4}}
                                       onPress={()=>
                                       props.backto === "Home" ? Actions.dashboard():
                                           Actions.pop()
                                       }>
                        <Icon name="ios-arrow-back-outline" size={20}/>
                        <Text style = {{fontWeight:'normal', color:'#727272', marginLeft:4, fontSize:16}}>{props.backto}</Text>
                    </TouchableOpacity>
                <View style = {{
                    height:'100%',
                    width:'100%',
                    flex: 1,
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <Text
                        numberOfLines={1}
                        style = {{

                            fontFamily:"'News Cycle', sans-serif",
                            fontWeight:'bold',
                            color:'#343434',fontSize:18,
                            lineHeight:18}}>{props.title}</Text>
                </View>

                <View style={{flex:1}}>
                    {props.advancedtoolbar}
                </View>
            </View>
                :
            <View
                elevation={1}
                style = {css.navbar}>

                <TouchableOpacity  style={{flex:1}} >
                </TouchableOpacity>

                <View style = {{
                    height:'100%',
                    width:'100%',
                    flex: 1,
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                <Text
                    numberOfLines={1}
                    style = {{
                        justifyContent:'center',
                        alignItems:'center',
                        fontFamily:"'News Cycle', sans-serif",
                        fontWeight:'bold',
                        color:'#343434',fontSize:18,
                        lineHeight:18}}>{props.title}</Text>
                </View>

                <View style={{flex:1, alignSelf:'center'}}>
                {props.advancedtoolbar}
                </View>
           </View>
    )
};

const css = StyleSheet.create({
   navbar:{
       backgroundColor:'white',
       flexDirection:'row',
       height:50,
       width:'100%',
       borderBottomColor:'#ccc',
       borderBottomWidth:1,
       alignItems:'center'
   },
    showbacknavbar:{
       justifyContent:'space-between',
        backgroundColor:'white',
        flexDirection:'row',
        height:50,
        width:'100%',
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
        alignItems:'center'
    }
});
export default NavBar;

