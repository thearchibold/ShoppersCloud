/**
 * Created by archibold on 11/08/2018.
 */
import React, {Component} from 'react'
import {View, Text, TouchableOpacity, FlatList, StyleSheet, BackHandler, CheckBox } from 'react-native'
import {connect} from 'react-redux'
import firebaseApp from '../_sharedComponent/firebase_connector'
import NavBar from '../_sharedComponent/navBar'
import {getRandomColor} from '../_sharedComponent/generatePDF'
import {Actions} from 'react-native-router-flux'

class ExpiredList extends Component {
    constructor(props){
        super(props);
        this.state={
            data:[]
        }
    }
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{Actions.pop(); return true });
        let {pin} = this.props.pin;
        firebaseApp.database().ref().child("list").child(pin).child("expiredlist").once('value', snap=>{
            let itemArray = [];
           snap.forEach(item=>{
               itemArray.push(item.val())
           });
            this.setState({
                data:itemArray
            })
        })
    }



    render(){
        return(
            <View style={{backgroundColor:"white", height:"100%", width:"100%"}}>
                <NavBar title="Expired List" showback backto="Home"/>
                <FlatList
                    data={this.state.data}
                    renderItem={({item, index})=>{
                        return(
                            <TouchableOpacity
                                onPress = {()=>{
                                    Actions.details({listname:item.name, listkey:item.key});
                                }}
                                style={{flexDirection:"row", padding:4, marginBottom:15, alignItems:"center"}}>
                                <View style={{...css.roundAvater, backgroundColor:getRandomColor()}}>
                                    <Text style={{color:"white", fontWeight:"bold", fontSize:24}}>{returnFirstLetter(item.name)}</Text>
                                </View>
                                <View style={{justifyContent:"center", margin:6 }}>
                                    <Text style={{ fontWeight:"bold", fontSize:16}}>{item.name}</Text>
                                    <Text style={{ color:"green", fontSize:13}}>{item.date}</Text>
                                </View>

                            </TouchableOpacity>
                        )
                    }}
                />
            </View>

        )
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress',()=>{Actions.pop(); return true });
    }
}


const css = {
    roundAvater:{
        height:50,
        width:50,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:50
    }

};


function mapStateToProps(state) {
    return{
        pin: state.pinReducer,
    }
}

function returnFirstLetter(name) {
    return name.charAt(0).toUpperCase()
}


export default connect(mapStateToProps, null)(ExpiredList)