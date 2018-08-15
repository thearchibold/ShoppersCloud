/**
 * Created by archibold on 16/07/2018.
 */
import React , {Component} from 'react'
import {
    View, Text, StyleSheet,
    TouchableOpacity, TextInput,
    Picker, ScrollView, Modal,
    Alert, BackHandler,AsyncStorage} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import  {Actions} from 'react-native-router-flux'
import NavBar from '../_sharedComponent/navBar'
import Spinner from 'react-native-spinkit'
import firebaseApp from '../_sharedComponent/firebase_connector'
import {firebaselinks} from '../_sharedComponent/constants'
import RNGooglePlacePicker from 'react-native-google-place-picker';
import  Geocoder  from 'react-native-geocoding';
import {saveUserData,savePin,fetchUserList} from '../../redux/actions'
import {connect} from 'react-redux'


Geocoder.init('AIzaSyAlaG5u1ScyhinG-TSErxbUl-IyVpYNg1U');


 class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            pinAccepted:false,
            email:'',
            loginpin:'',
            repeatpin:'',
            fullname:'',
            phone_number:'',
            gender:'',
            other:'',
            showmodal:false,
            pinresponse:'',
            location:'Please select your location',
            coordinate:null,
            runlocAlert:true
        }
    }

    componentWillMount(){
            BackHandler.addEventListener('hardwareBackPress', ()=>{Actions.pop()});

            }


    renderGoogleLocation =() =>{
        RNGooglePlacePicker.show((response) => {
            if (response.didCancel) {
                alert('User cancelled GooglePlacePicker', response.error);
            }
            else if (response.error) {
                alert('GooglePlacePicker Error: ', response.error);
            }
            else {

                /*google_id
                * name
                * longitude
                * latitude
                * address*/
                this.setState({
                    location: response.name,
                    coordinate:{lat:response.latitude,longitude:response.longitude},
                });
            }
        })

    };

    renderCoordLocation = () =>{
     if(this.state.runlocAlert)  {
         this.setState({runlocAlert:false});
            Alert.alert(
                'Location',
                'Location helps discover items near you. \n Allow location services ',
                [
                    {
                        text: 'Cancel', style: 'cancel'},
                       {text: 'Allow',
                        onPress: () => {
                        this.setState({
                            showmodal:true,
                        });
                        navigator.geolocation.getCurrentPosition(
                            (position)=>{Geocoder.from(position.coords.latitude, position.coords.longitude)
                                .then(json => {
                                    let addressComponent = json.results[0].address_components[0];
                                    this.setState({
                                        location:addressComponent.short_name,
                                        coordinate:{lat:position.coords.latitude,longitude:position.coords.longitude},
                                        runlocAlert:false,
                                        showmodal:false
                                    })
                                })
                                .catch(error => console.warn(error));},
                            (error) =>{console.log(error)},
                            {
                                enableHighAccuracy: true,
                                timeout:            20000,
                                maximumAge:         10000
                            }


                        )
                    }},
                ],
                { cancelable: false }
            )
        }
    };

    renderPin = ()=>{

        return(
            <View>

                <TextInput
                    style={{padding:10}}
                    value={this.state.email}
                    onChangeText={(value)=>{
                        this.setState({email:value})
                    }}
                    placeholder="Email"
                    autoFocus={false}
                    underlineColorAndroid="#b6b6b6"
                    returnKeyType="next"
                    keyboardType="email-address"

                />

                <TextInput
                    style={{padding:10}}
                    value={this.state.loginpin}
                    onChangeText={(value)=>{
                        this.setState({loginpin:value})
                    }}
                    placeholder="Login Pin"
                    autoFocus={false}
                    secureTextEntry={true}
                    underlineColorAndroid="#b6b6b6"
                    returnKeyType="next"
                    keyboardType="visible-password"

                />

                <TextInput
                    style={{padding:10}}
                    value={this.state.repeatpin}
                    onChangeText={(value)=>{
                        this.setState({repeatpin:value})
                    }}
                    placeholder="Repeat Login Pin"
                    autoFocus={false}
                    secureTextEntry={true}
                    underlineColorAndroid="#b6b6b6"
                    returnKeyType="next"
                    keyboardType="visible-password"

                />

                <TouchableOpacity
                    onPress={()=>{this.authenticatePin()}}
                    style={{height:40,padding:10, backgroundColor:'green', borderRadius:4,marginTop:15}}>
                    <Text style={{fontSize:14, fontWeight:"900", alignSelf:'center', color:'white'}} >Sign Up</Text>
                </TouchableOpacity>
                <Text>{this.state.pinresponse}</Text>
            </View>
        )
    };

    renderDetails = ()=>{
        return(
            <View>
                <TextInput
                    style={{padding:10, marginTop:20}}
                    value={this.state.fullname}
                    onChangeText={(value)=>{
                        this.setState({fullname:value})
                    }}
                    placeholder="Name (Firstname , Lastname)"
                    autoFocus={false}
                    underlineColorAndroid="#b6b6b6"
                    returnKeyType="next"
                    keyboardType="default"
                />

                <TextInput
                    style={{padding:10,marginTop:10}}
                    value={this.state.phone_number}
                    onChangeText={(value)=>{
                        this.setState({phone_number:value})
                    }}
                    placeholder="Phone Number"
                    autoFocus={false}
                    underlineColorAndroid="#b6b6b6"
                    returnKeyType="next"
                    keyboardType="phone-pad"
                />
                {this.renderCoordLocation()}
                <TouchableOpacity style={css.location}
                                  onPress = {()=>{this.renderGoogleLocation()}}
                >

                    <Text style={{alignSelf:"center",marginLeft:6}}>{this.state.location}</Text>
                    <Icon name="ios-create-outline" size={20} color="green" style={{marginRight:4, alignSelf:'center'}}/>
                </TouchableOpacity>

                <Picker

                    selectedValue={this.state.gender}
                    style={{ height: 50, width: '100%',marginTop:10, borderWidth:0.7, borderColor:'#4a4949',borderRadius:4 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}>
                    <Picker.Item label="Gender"/>
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>

                <TextInput
                    style={{padding:10,marginTop:10}}
                    value={this.state.other}
                    onChangeText={(value)=>{
                        this.setState({other:value})
                    }}
                    placeholder="Tell us what you do..."
                    autoFocus={false}
                    underlineColorAndroid="#b6b6b6"
                    returnKeyType="next"
                    keyboardType="default"

                />
            </View>
        )
    };

    authenticatePin =(pin = this.state.loginpin, repin = this.state.repeatpin) =>{
        if({pin, repin} !== null && pin === repin){
            this.setState({
                showmodal:true,
            });

            firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.loginpin).
            then((result, error)=>{
                if(result){
                    let user = firebaseApp.auth().currentUser;
                    if(user) {
                        console.log(user.uid);
                        this.setState({
                            showmodal: false,
                            pinAccepted: true,
                            loginpin: user.uid
                        });


                    }
                }
                if(error){
                    this.setState({
                        showmodal:false,
                        loginpin:'',
                        repeatpin:'',
                        pinresponse:error.message,
                        pinAccepted:false
                    })
                }
            });
        }
    };
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
    };

    sendItemsToCloud = (pin) =>{
        let userObj = {
            name: this.state.fullname,
            email:this.state.email,
            phone: this.state.phone_number,
            gender: this.state.gender,
            location:this.state.location,
            coordinate:this.state.coordinate,
            other:this.state.other,
        };
        let registerlink = firebaseApp.database().ref().child("users");


        if(this.state.fullname.trim() === "" ){
            //alert enter name
        }
        else if(this.state.phone_number.trim() === ""){
            //alert phone number
        }
        else{
            this.setState({showmodal:true});
            registerlink.child(pin).set(userObj);
            this.props.saveUserDetails(userObj);
            this._storeData(pin);


            setTimeout(()=>{
                Actions.dashboard();
                this.setState({showmodal:false});
            }, 2500)

        }

    };

     _storeData = async (key) => {
         try {
             await AsyncStorage.setItem('user', JSON.stringify({
                 logged:true,
                 key:key
             }));
         } catch (error) {
             // Error saving data
         }
     };
    render(){
        return(
            <View style={css.container}>
                <NavBar
                    style = {{justifyContent:'flex-start'}}
                    title="Register"
                    showback backto="Log In"
                    advancedtoolbar={
                        <TouchableOpacity
                            onPress={()=>{
                                this.sendItemsToCloud(this.state.loginpin);
                                this.props.fetchList(this.state.loginpin);
                                this.props.savePin(this.state.loginpin)
                            }}
                            style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                margin: 10
                            }}>
                            <Text style={{color:'green', alignSelf:'center', marginLeft:3}}>DONE</Text>
                        </TouchableOpacity>
                    }
                />
                {this.showModal()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{justifyContent:'center', padding:40, width:'100%'}}>
                    <Icon name="ios-people" size={60} style={{alignSelf:'center'}} />
                    {
                       this.state.pinAccepted ? this.renderDetails(): this.renderPin()
                    }
                </ScrollView>
            </View>
        )
    }


}

const css = StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'white'

    },
    spinner: {

    },
    location:{
        height:40,
        width: '100%',
        marginTop:10,
        borderWidth:1,
        borderColor:'#4a4949',
        borderRadius:4,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row'
    }
});
function mapDispatchToProps(dispatch) {

        return {
            saveUserDetails: (data)=>{
                dispatch(saveUserData(data))
            },
            savePin : (pin)=>{
                dispatch(savePin(pin))
            },

            fetchList: (pin) =>{
                dispatch(fetchUserList(pin))
            }
        }

}
export default connect(null, mapDispatchToProps)(Register)