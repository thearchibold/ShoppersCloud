/**
 * Created by archibold on 13/07/2018.
 */
import React,{Component} from 'react'
import {View, Text, StyleSheet,
    Image,Alert, TouchableOpacity,
    AsyncStorage,TextInput, BackHandler,Modal} from 'react-native'
import {colors} from '../_sharedComponent/constants'
import {connect} from 'react-redux'
import {savePin,fetchUser,fetchUserList} from '../../redux/actions'
import {Actions} from 'react-native-router-flux'
import firebaseApp from '../_sharedComponent/firebase_connector'
import {firebaselinks} from '../_sharedComponent/constants';


import Spinner from 'react-native-spinkit'



let userpins = firebaseApp.database().ref();
let pinArray = [];
class PinPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pin: null,
            email:'',
            showmodal:false
        }
    }

  componentWillMount(){

     BackHandler.addEventListener('hardwareBackPress', ()=>{BackHandler.exitApp()});

    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', ()=>{BackHandler.exitApp()})

    }

    componentWillReceiveProps(props) {

    }

    showModal = () =>{
        return(
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.state.showmodal}
                onRequestClose={()=>{console.log("List name closed")}}
            >

                <View style={{justifyContent:'center', alignItems:'center', height:'100%', width:'100%'}}>
                    <Spinner style={css.spinner} isVisible={true} size={60} type='ChasingDots' color="green"/>
                    <TouchableOpacity
                        style = {{justifyContent:'center', alignItems:'center'}}
                        onPress={()=>{
                            this.setState({
                                showmodal:false
                            })
                        }}><Text>Loading please wait...</Text></TouchableOpacity>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View style={css.container}>

                {this.showModal()}
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                    <View style={{
                        height: 120, width: 120,
                        padding: 10, justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image source={require('../../assets/images/locked-padlock.png')}/>
                    </View>
                </View>

                <View style={{flex: 1.5, flexDirection: 'column', padding: 10, width: '100%'}}>


                    <View style={css.spacecontainer}>
                        <TextInput
                            placeholder="Enter email"
                            style={{fontSize: 16, width: '100%'}}
                            value={this.state.email}
                            onChangeText={(value) => {
                                this.setState({email: value})
                            }}
                            autoFocus={true}
                            underlineColorAndroid="#cbcbcb"
                            keyboardType="email-address"

                        />
                    </View>

                    <View style={css.spacecontainer}>
                        <TextInput
                            placeholder="Enter Pin"
                            style={{fontSize: 16, width: '100%'}}
                            value={this.state.pin}
                            onChangeText={(value) => {
                                this.setState({pin: value})
                            }}
                            underlineColorAndroid="#cbcbcb"
                            keyboardType="password"
                            enablesReturnKeyAutomatically={true}
                            secureTextEntry={true}
                        />
                    </View>


                    <TouchableOpacity style={css.register} activeOpacity={0.5} onPress={() => {
                        if (this.state.pin !== null) {
                            this.setState({showmodal: true});

                            firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.pin).then((result, error) => {

                                if (error) {
                                    this.setState({showmodal: false});
                                    Alert.alert(
                                        'Error!',
                                        error.message
                                            [{text: 'OK', style: 'cancel'}],
                                        {cancelable: true}
                                    )
                                    console.log(error.message)
                                }
                                else {
                                    setTimeout(() => {

                                            let user = firebaseApp.auth().currentUser;
                                            this._storePin(user.uid);
                                            this.props.saveUserDetails(user.uid);
                                            this.props.savePin(user.uid);
                                            this.props.saveUserDetails(user.uid);
                                            this.props.fetchList(user.uid);
                                            Actions.dashboard();
                                            this.setState({showmodal: false});
                                    }, 3000)
                                }

                            })


                        }
                    }}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={css.loginbtn} activeOpacity={0.5} onPress={() => {
                        Actions.register()
                    }}>
                        <Text style={{color: 'green', fontWeight: 'bold', fontSize: 14}}>Register</Text>
                    </TouchableOpacity>

                </View>

            </View>

        )
    }

    _storePin = async (userkey) => {
        try {
            await AsyncStorage.setItem("user", JSON.stringify({logged: true, key: userkey}));
            Actions.dashboard()
        } catch (error) {
            alert(error)
        }
    }
}
const css = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
        height:'100%',
        width:'100%',
        backgroundColor:'white',
        padding:20
    },
    loginbtn:{
        backgroundColor:"white",
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20,
        padding:10,
        borderWidth:1,
        margin:10,
        borderColor:'green'

    },

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

    spacecontainer:{
        alignItems:'center',
        flexDirection:'row',
        height:50,
        width:'100%',
        justifyContent:'center'
    },


    register:{
        backgroundColor:"green",
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        padding:13,
        margin:10

    }
});

function mapStateToProps(state) {
    return {
        pin: state.pinReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        savePin : (pin)=>{
            dispatch(savePin(pin))
        },
        saveUserDetails: (pin)=>{
            dispatch(fetchUser(pin))
        },
        fetchList: (pin) =>{
            dispatch(fetchUserList(pin))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PinPage);