/**
 * Created by archibold on 20/07/2018.
 */
import React, {Component} from 'react'
import {View, TouchableOpacity, Alert, Platform,Text, FlatList,StyleSheet, Switch, Slider,BackHandler} from 'react-native'
import NavBar from '../_sharedComponent/navBar'
import ReactNativeAN from 'react-native-alarm-notification';
import {Actions} from 'react-native-router-flux'
import firebaseApp from '../_sharedComponent/firebase_connector'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import DateTimePicker from 'react-native-modal-datetime-picker';


class ListSettings extends Component {

    constructor(props){
        super(props);

        this.state = {
            data:[],
            isDateTimePickerVisible: false,
            item:'',

        }
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPressed', ()=>{Actions.pop() ; return true});
        let listHeaders = [];
        let pin = this.props.pin;
        let list = this.props.list;


        this.setState({
            data:list.currentlist
        })

    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPressed', ()=>{Actions.pop() ; return true});

    }

    _showDateTimePicker = (index) => this.setState({ isDateTimePickerVisible: true, item:index });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false, item:null });

    _handleDatePicked = (date) => {

        let currArray = this.state.data;

        currArray[this.state.item].remindertime = date.toLocaleTimeString();
        this.setState({
            data:currArray
        })
        this._hideDateTimePicker();
    };

    renderData = (data) =>{
        return(
            <FlatList
                data={data}
                keyExtractor={item => item.key}
                renderItem={({item, index}) =>
                            <View style={css.item} >

                                <View style = {css.headerCon}>
                                   <Text style = {{fontWeight:'bold', color:'white'}}>{item.name}</Text>
                                </View>

                                <Text style={{margin:6, fontWeight:'bold'}}>{item.date}</Text>


                                <View style={{padding:15}}>
                                    <TouchableOpacity
                                        onPress={()=>{
                                            this._showDateTimePicker(index)
                                        }}
                                        style={{justifyContent:'space-between',padding:4, flexDirection:'row', borderColor:'#cbcbcb', borderWidth:1}}>
                                        <Text style={{alignSelf:'center'}}>Set reminder time</Text>
                                        <Icon name="ios-timer-outline" size={25}/>
                                    </TouchableOpacity>

                                    <Text style={{marginTop:10, marginBottom:10, marginLeft:5}}>{item.remindertime}</Text>

                                    <View style={{height:50, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text>Vibrate</Text>
                                        <Switch
                                            value={item.vibrate || false}
                                            onValueChange={(value) => {
                                                let currArray = this.state.data;
                                                currArray[index].vibrate = value;
                                                this.setState({data:currArray})
                                            }}
                                            onTintColor="green"
                                        />
                                    </View>

                                    <View style={{height:50, width:"100%"}}>
                                        <View style={{flexDirection:'row', justifyContent:'space-between',}}>
                                           <Text>Vibration frequency</Text>
                                            <Text style={{fontWeight:'bold', color:'green', marginRight:4}}>{item.frequency}</Text>
                                        </View>
                                        <Slider
                                            style={{width:"100%", marginTop:15}}
                                            minimumValue={0}
                                            maximumValue={1000}
                                            step={100}
                                            disabled={!item.vibrate}
                                            value={0 + item.frequency}
                                            onValueChange={(value) => {
                                                let currArray = this.state.data;
                                                currArray[index].frequency = value;
                                                this.setState({data:currArray})
                                            }}
                                            minimumTrackTintColor="green"
                                        />
                                    </View>

                                    <View style={{height:50, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text>Auto-cancel</Text>
                                        <Switch
                                            value={item.autocancel || false}
                                            onValueChange={(value) => {
                                                let currArray = this.state.data;
                                                currArray[index].autocancel = value;
                                                this.setState({data:currArray})
                                            }}
                                            onTintColor="green"
                                        />
                                    </View>

                                    <View style={{height:50, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text>Play sound</Text>
                                        <Switch
                                            value={item.playsound || false}
                                            onValueChange={(value) => {
                                                let currArray = this.state.data;
                                                currArray[index].playsound = value;
                                                this.setState({data:currArray})
                                            }}
                                            onTintColor="green"
                                        />
                                    </View>

                                    <View style={{height:0.8, width:'100%', backgroundColor:'#cbcbcb'}}/>
                                    <TouchableOpacity
                                        onPress = {()=>{this.setToReminder(item)}}
                                        style = {{backgroundColor:"green",alignSelf: 'flex-end',width:'35%',alignItems:'center',justifyContent:'center', padding:6, borderWidth:1,borderColor:'green',borderRadius:4, marginTop:15}}>
                                      <Text style={{color:'white',fontWeight:'bold'}}>Remind me</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                }

                ListHeaderComponent = {()=>{
                    return (
                        <Text style={{fontSize:16, fontWeight:"bold", marginTop:6, marginLeft:4, color:"green"}}>Current List</Text>
                    );}}


            />

        )
    };

    setToReminder = (item) =>{

        if(item.vibrate === undefined){
            item.vibrate = false
        }
        if(item.autocancel === undefined){
            item.autocancel = false
        }
        if(item.playsound === undefined){
            item.playsound = false
        }

        if(item.remindertime === undefined) {

        }
        else {

            alert(item.vibrate);
            alert( item.playsound);
            alert( item.autocancel);


            let remDate = new Date(item.date);

            let day = remDate.getDate();
            let month = remDate.getMonth() + 1;
            let year = remDate.getFullYear();

            fire_date = day + "-" + month + "-" + year + " " + item.remindertime;

            let id = Math.floor(Math.random() * 1000 + 1);
            const alarmNotifData = {
                id: id,                                  // Required
                title: item.name,               // Required
                message: "Its shopping day for " + item.name,           // Required
                ticker: "It's shopping day !!!",
                auto_cancel: item.autocancel,                            // default: true
                vibrate: item.vibrate,
                vibration: 200,                               // default: 100, no vibration if vibrate: false
                small_icon: "cart",                    // Required
                large_icon: "cart",
                play_sound: true,
                sound_name: item.playsound,                             // Plays custom notification ringtone if sound_name: null
                color: "green",
                schedule_once: true,                          // Works with ReactNativeAN.scheduleAlarm so alarm fires once
                tag: 'g_app',
                fire_date: fire_date              // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm. Format: dd-MM-yyyy HH:mm:ss
            };

            ReactNativeAN.scheduleAlarm(alarmNotifData);
        }
    };

    render (){
        return(
        <View style={{backgroundColor:'white', flex:1, flexDirection:'column'}}>
            <NavBar title={this.props.page} showback backto="Home"
                    advancedtoolbar={
                        <TouchableOpacity
                            onPress={()=>{
                                ReactNativeAN.removeAllFiredNotifications()
                            }}
                            style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                margin: 10
                            }}>
                            <Text style = {{color:"green", alignSelf:'center'}}>CLEAR</Text>
                        </TouchableOpacity>
                    }
            />
            <DateTimePicker
                mode="time"
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
            />
            {this.renderData(this.state.data)}
        </View>
        )
    }
}

const css = StyleSheet.create({
    item:{
        margin:10,
        borderRadius:10,
        borderColor:'#7b7b7b',
        borderWidth:1
    },
    headerCon:{
        backgroundColor:'#7b7b7b',
        padding:10,
        justifyContent:'center',
        borderTopLeftRadius:9,
        borderTopRightRadius:9
    }
})


function mapStateToProps(state) {
    return {
        pin: state.pinReducer,
        list: state.listReducer
    }
}

export default  connect(mapStateToProps, null)(ListSettings)