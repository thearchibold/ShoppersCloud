/**
 * Created by archibold on 14/07/2018.
 */
import React, {Component} from 'react'
import {View, Text,StatusBar, ImageBackground, TouchableOpacity, AsyncStorage, StyleSheet, Image, Button} from 'react-native'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {savePin, fetchUser, fetchUserList} from '../../redux/actions'
import Icon from 'react-native-vector-icons/Ionicons'
import firebaseApp from '../_sharedComponent/firebase_connector'
import Spinner from 'react-native-spinkit'
import {getRandomColor} from '../_sharedComponent/generatePDF'


class WelcomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            value : null
        }
    }

    async componentWillMount(){

       let value  = await AsyncStorage.getItem('user');
       console.log(JSON.parse(value));
       this.setState({value:value})
    }

  /*  async componentDidMount(){
        let value  = await AsyncStorage.getItem('user');
        console.log(JSON.parse(value));
        this.setState({value: value !== null ? value:"Login"})
    }*/
     continueToPage = async () => {

                 if(this.state.value !== null) {
                     userData = JSON.parse(this.state.value);
                     if(userData.logged) {
                         let userkey = userData.key;
                         this.props.saveKey(userkey);
                         this.props.fetchUser(userkey);
                         this.props.fetchList(userkey);
                         Actions.dashboard()
                     }
                     else{
                         Actions.pinpage();
                     }
                 }
                 else{
                     Actions.pinpage()
                 }

         };


    render(){


        return(
            <View style={{flex:1, backgroundColor:"white", justifyContent:"center"}}>
                <View style={{ flex:1, justifyContent:"center",  marginTop:-100, alignItems:"center"}}>
                    <View style={{flexDirection:"row"}}>
                        <Icon name="ios-cloud" size={33} color="#8d2b0b"/>
                        <Text style = {{color:"#8d2b0b", fontSize:24,margin:1, fontWeight:"bold"}}>SHOPPERS</Text>
                        <Text style = {{color:"#ff651c", fontSize:24,margin:1}}>CLOUD</Text>

                    </View>
                    <Text style={{color:"#8d2b0b",fontSize:10}}>version 0.1.0</Text>
                </View>
                    <View style={{padding:10}}>
                        <TouchableOpacity
                            onPress={()=> this.continueToPage() } style={styles.contButton}>
                            {this.state.value === null ?
                                <Spinner  isVisible={true} size={20} type='ChasingDots' color="white"/>
                                :
                                <Text style={{color:'white', fontWeight:"900"}}>Continue</Text>
                            }

                        </TouchableOpacity>
                        <View style={{

                            width:'100%',
                            flexDirection:'row',
                            justifyContent:'center',
                            alignItems:'center',
                            paddingLeft:20,
                            paddingRight:20,
                            paddingTop:10

                        }}>
                        </View>
                    </View>
            </View>

        )
    }



}
const styles = StyleSheet.create({
    linearGradient:{
        flex:1,
        height:'100%',
        width:'100%',
        flexDirection:'column',
        backgroundColor:'rgba(10, 10, 10, 0.7)'

    },
    contButton:{
        padding:10,
        backgroundColor:getRandomColor(),
        borderRadius:20,
        alignSelf:"center",
        width:'40%',
        justifyContent:'center',
        alignItems:'center'
    }
});



function mapStateToProps(state) {
    return{
        state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveKey: (pin) => {
            dispatch(savePin(pin))
        },
        fetchUser: (pin) => {
            dispatch(fetchUser(pin))
        },
        fetchList: (pin) =>{
            dispatch(fetchUserList(pin))
        }

    }
}


export default connect(mapStateToProps, mapDispatchToProps) (WelcomePage);

