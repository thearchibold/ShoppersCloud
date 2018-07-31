/**
 * Created by archibold on 21/07/2018.
 */
import React,{Component} from 'react'
import  {View,TouchableOpacity, AsyncStorage, Text, StyleSheet,ScrollView, BackHandler, } from 'react-native'
import {Actions} from 'react-native-router-flux'
import NavBar from '../_sharedComponent/navBar'
import Icon from 'react-native-vector-icons/Ionicons'
import  MapView from 'react-native-maps'
import {Marker} from 'react-native-maps'
import {connect} from 'react-redux'
import {nearYou} from '../_sharedComponent/constants'
import { Rating, AirbnbRating } from 'react-native-ratings';


class ShopperCloud extends Component{
    constructor(props){
        super(props);
        this.state = {
            lat:'',
            longitude:''
        }
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', ()=>{Actions.dashboard()});
        navigator.geolocation.getCurrentPosition((position)=>{
            this.setState({
                lat:position.coords.latitude,
                longitude: position.coords.longitude
            })
        })

    }

    render(){
        return(
            <View style={css.container}>
                <NavBar
                    showback
                    backto = "Home"
                    title="Shoppers cloud"
                    advancedtoolbar={
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                margin: 10
                            }}>
                            <Icon name="ios-cloud-upload" size={24}/>
                        </TouchableOpacity>
                    }
                />
                <ScrollView
                    contentContainerStyle={{flex:1}}
                >
                <View style={{flex:1}}>
                    <View style={{flex:2,justifyContent:'center', alignItems:'center',backgroundColor:'#cbcbcb'}}>

                    <MapView
                        style={{height:'100%', width:'100%'}}
                        mapType="terrain"
                        showsUserLocation = {true}
                        region={{
                            latitude: this.state.lat,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01}}>

                        <Marker
                            coordinate={{
                                latitude: this.state.lat - 0.001,
                                longitude: this.state.longitude - 0.001,
                            }}
                            title={"Cloud shopper 1"}
                            image={require('../images/cart.png')}
                        />
                        <Marker
                            coordinate={{
                                latitude: this.state.lat - 0.0004 ,
                                longitude: this.state.longitude - 0.002,
                            }}
                            title={"Cloud shopper 2"}
                            image={require('../images/cart.png')}
                        />
                        <Marker
                            coordinate={{
                                latitude: this.state.lat - 0.005,
                                longitude: this.state.longitude - 0.0005,
                            }}
                            title={"Cloud shopper 3"}
                            image={require('../images/cart.png')}
                        />
                        <Marker
                            coordinate={{
                                latitude: this.state.lat - 0.022,
                                longitude: this.state.longitude,
                            }}
                            title={"Shopper cloud 2"}
                            image={require('../images/cart.png')}
                        />
                    </MapView>

                </View>

                    <View style={{flex:1, backgroundColor:'white'}}>
                        <Text style = {{margin:8,fontWeight:"bold", color:"green", fontSize:16}}>Near you</Text>
                        {
                            nearYou.map( item =>{
                                return(
                                    <View style={{height:60, flexDirection:"row"}}>
                                        <View style={{flex:1, marginLeft:6}}>
                                            <Text style={{fontSize:16, color:"#726f6f"}}>{item.name}</Text>
                                            <Rating
                                                type='custom'
                                                ratingImage={require('../images/cart.png')}
                                                ratingBackgroundColor='#fff'
                                                ratingColor="#fff"
                                                ratingCount={item.rating}
                                                imageSize={20}
                                            />
                                        </View>
                                        <View style={{width:60, height:'100%' }}>
                                            <Text style={{fontSize:16, fontWeight:"400", color:"green"}}>2km</Text>
                                            <Text>Away</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }

                    </View>
                </View>
                </ScrollView>
            </View>
        )
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
        gAppUser:state.pinReducer
    }
}
export  default  connect(mapStateToProps, null)(ShopperCloud)