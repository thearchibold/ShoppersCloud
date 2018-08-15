/**
 * Created by archibold on 18/07/2018.
 */
import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList,BackHandler } from 'react-native'
import NavBar from '../_sharedComponent/navBar'
import PureChart from 'react-native-pure-chart';
import {testData, frequentData} from '../_sharedComponent/constants'
import {Actions} from 'react-native-router-flux'

let data = [];

export default  class ListStats extends  Component{

    constructor(props){
        super(props);
        this.state = {
            mockdata : frequentData
        }
    }
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', ()=> Actions.dashboard());

    }


    renderFrequentData = () => {

            return(
            <FlatList
                keyboardShouldPersistTaps
                data={this.state.mockdata}
                renderItem = {({item, index})=>{
                    return(
                        <View style = {{flexDirection:'row', justifyContent:"space-between", alignItems:"center", padding:10}}>
                            <Text>{item.item}</Text>
                            <Text style={{color:'green',fontWeight:"bold"}}>{item.count}</Text>
                        </View>
                    )
                }

                }
                ItemSeparatorComponent={()=>{
                    return(
                        <View style={{height:0.7, width:'100%', backgroundColor:"#cbcbcb"}}/>
                    )
                }}
            />

            )
    }

    renderPieItems = () =>{
        return(
            <FlatList
                data={testData}
                renderItem = {(item) => {
                    return(
                        <View>
                            <Text style={{color:item.item.color, fontWeight:"bold", margin:2}}>{item.item.label}</Text>
                        </View>
                    )
                }}
            />
        )
    }

    render(){

        return(
            <View style={css.container}>
                <NavBar title={this.props.page}
                        showback backto="Home"
                        advancedtoolbar={
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    margin: 10
                                }}>
                            </TouchableOpacity>
                        }
                />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        >
                        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>

                                <View style={{flexDirection:'row', padding:15}}>
                                    <View style={{flex:1,marginLeft:-80,flexDirection:'row'}}>
                                       <PureChart data={testData} type='pie'  />

                                        <View style={{padding:15}}>
                                        {this.renderPieItems()}
                                        </View>

                                    </View>

                                </View>
                                  <View style={{height:1, backgroundColor:"#cbcbcb", width:'100%', marginLeft:10, marginRight:10}}/>

                                <View style = {{padding:20, width:'100%'}}>
                                    <Text style={{color:'green',margin:5, fontWeight:"700"}}>Frequently Bought Items</Text>
                                    {this.renderFrequentData()}

                                </View>
                        </View>

                    </ScrollView>


            </View>
        )
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', ()=> Actions.dashboard());

    }
}


const css = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    navback:{
        height:50
    }

})
