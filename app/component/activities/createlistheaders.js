/**
 * Created by archibold on 26/07/2018.
 */
import React, {Component} from 'react'
import {View, Text, TouchableOpacity, BackHandler, TextInput, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {Actions} from 'react-native-router-flux'
import DateTimePicker from 'react-native-modal-datetime-picker'

 export default class CreateListHeaders extends Component{
    constructor(props){
        super(props);
        this.state = {
            listname:'',
            listdate:''
        }
    }


     componentWillMount(){
         BackHandler.addEventListener('hardwareBackPress',()=>{ Actions.dashboard()});
         let date = new Date();
         this.setState({
             listdate:date.toDateString()
         })
     }



     _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true});

     _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

     _handleDatePicked = (date) => {

         this.setState({
             listdate:date.setHours(0,0,0).toDateString()
         })
         this._hideDateTimePicker();
     };

    render(){
        return(
            <View style={{height:'100%', width:'100%', backgroundColor:"white"}}>
            <View style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center',padding:20, flex:1}}>
                <TextInput
                    style={{width:'100%', fontSize:16}}
                    autoFocus={false}
                    onChangeText={(value)=> this.setState({listname:value})}
                    value={this.state.listname}
                    placeholder="List name"
                    underlineColorAndroid="#cbcbcb"
                />

                <TouchableOpacity
                    onPress={()=>{
                        this._showDateTimePicker();
                    }}
                    style={css.datearea}>
                    <Text style = {{color:'#4a4949', alignSelf:'center'}}>{this.state.listdate}</Text>
                    <Icon  name="ios-calendar-outline" size={28} color="green" style = {{alignSelf:'center'}}/>
                </TouchableOpacity>
                <DateTimePicker
                    mode="date"
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
            </View>
                <View style={{flexDirection:'row', width:'100%', padding:8}}>
                    <TouchableOpacity
                        style = {{flex:1,justifyContent:'center', alignItems:'center', borderWidth:1, borderColor:'green', borderRadius:6, padding:8,margin:2}}
                        onPress={()=>{Actions.dashboard()}}>
                        <Text>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {{flex:1,justifyContent:'center', alignItems:'center', padding:8, borderRadius:6, backgroundColor:'green'}}
                        onPress={()=>{
                            let list = this.state.listname;
                            if(list.length > 0){
                                Actions.createlist({listname: this.state.listname, listdate:this.state.listdate})
                            }
                        }}><Text style = {{color:'white', fontWeight:"900"}}>NEXT</Text></TouchableOpacity>
                </View>
            </View>

        )
    }
 }

 const css = StyleSheet.create({
     datearea:{
         height:35,
         flexDirection:'row',
         justifyContent:'space-between',
         paddingLeft:4,
         paddingRight:4,
         width:'100%',
         marginTop:6
     }
 });