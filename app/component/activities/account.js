/**
 * Created by archibold on 15/07/2018.
 */
import React,{Component} from 'react'
import  {View, TouchableOpacity, AsyncStorage, Text, StyleSheet, ScrollView, BackHandler, Picker} from 'react-native'
import {Actions} from 'react-native-router-flux'
import NavBar from '../_sharedComponent/navBar'
import Icon from 'react-native-vector-icons/Ionicons'
import  MapView from 'react-native-maps'
import {connect} from 'react-redux'
import firebaseApp from '../_sharedComponent/firebase_connector'


class Account extends Component{
    constructor(props){
        super(props);
        this.state={
            distance:"10"
        }
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', ()=>{Actions.pop(); return true});

    }


    render(){
        let {userdetails} = this.props.gAppUser;
        console.log(JSON.stringify(userdetails));
        return(
            <View style={css.container}>
                <NavBar
                    style = {{justifyContent:'flex-start'}}
                    title="Account"
                    showback backto="Back"
                    advancedtoolbar={
                        <TouchableOpacity
                            onPress={async ()=>{
                                try {
                                    await AsyncStorage.setItem('user', JSON.stringify({
                                        logged:false,
                                        key:null
                                    }));

                                    firebaseApp.auth().signOut();
                                    Actions.pinpage();
                                } catch (error) {
                                    // Error saving data
                                }

                            }}
                            style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            margin: 10
                        }}>
                            <Icon name="ios-log-out-outline" size={26} color="red"/>

                        </TouchableOpacity>
                    }
                />
                <View style={{flex:1,justifyContent:'center', alignItems:'center',backgroundColor:'#dedede', padding:10}}>
                    <View style={{backgroundColor:"green",justifyContent:"center", alignItems:"center",  height:70, width:70, borderRadius:70}}>
                        <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>AB</Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end',padding:6}}>
                        <Text style={{color:'#0a2b55',fontSize:18, fontWeight:"900"}}>{userdetails.name}</Text>
                        <Text style={{color:'#dd5a1f', fontSize:14, fontWeight:"400"}}>{userdetails.email}</Text>
                    </View>
                </View>

                <View
                    style={{flex:1.5, backgroundColor:'white', padding:20}}>
                    <View style={css.inforowitem}>
                        <Icon name="ios-phone-portrait-outline" color="green" size={22}/>
                        <Text style={{flex:1, margin: 4, fontSize:15}}>  -  {userdetails.phone}</Text>
                    </View>

                    <View style={css.inforowitem}>
                        <Icon name="ios-pin" color="green" size={22}/>
                        <Text style={{flex:1, margin: 4, fontSize:15}}>  -  {userdetails.location}</Text>
                    </View>

                    <View style={css.inforowitem}>
                        <Icon name="ios-transgender" color="green" size={22}/>
                        <Text style={{flex:1, margin: 4, fontSize:15}}> - {userdetails.gender}</Text>
                    </View>

                    <View style={css.inforowitem}>
                        <Icon name="ios-book" color="green" size={22}/>
                        <Text
                            numberOfLines={1}
                            style={{flex:1, margin: 4, fontSize:15, ellipsizeMode:'middle'}}>  -  {userdetails.other}</Text>
                    </View>

                    <View style = {{height:0.8, width:'100%', backgroundColor:'#cbcbcb',marginTop:10, marginBottom:10}}/>
                </View>
                <View style={{height:120, padding:10,backgroundColor:"white" }}>
                <MapView

                    style={{height:'100%', width:'100%'}}
                    region={{
                        latitude: userdetails.coordinate ? userdetails.coordinate.lat: 0 ,
                        longitude: userdetails.coordinate ? userdetails.coordinate.longitude : 0,

                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01

                    }}
                >
                    <MapView.Marker
                        coordinate= {{
                            latitude: userdetails.coordinate ?userdetails.coordinate.lat: 0 ,
                            longitude: userdetails.coordinate ? userdetails.coordinate.longitude : 0,


                        }}
                        title={"Home Location"}
                    />

                </MapView>
                </View>
            </View>
        )
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', ()=>{Actions.pop(); return true});

    }
}




const css = StyleSheet.create({
    container:{
        flex:1,
        height:'100%'
    },
    inforowitem:{
        height:40,
        alignItems:'center',
        flexDirection:'row',
        width:'100%',
        marginLeft:10,
        marginRight:10
    }
});
function mapStateToProps(state) {
    return{
        gAppUser: state.pinReducer
    }
}

export  default  connect(mapStateToProps, null)(Account)