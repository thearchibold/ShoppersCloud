/**
 * Created by archibold on 28/06/2018.
 */
import React, {Component} from 'react'
import {View, Text, Image, Modal, TouchableOpacity, StyleSheet} from 'react-native'
import {Router, Scene,Stack, Actions} from 'react-native-router-flux'
import {goOnline, goOffline} from '../redux/actions'

import PinPage from './activities/pinpage'
import Welcomepage from './activities/welcomepage'
import DashBoard from './activities/dashboard'
import ListHeaders from './activities/listheaders'
import Account from './activities/account'
import Register from './activities/register'
import CreateList from './activities/createlist'
import ListStats from './activities/liststatistic'
import ListSettings from './activities/listsettings'
import ShopperCloud from './activities/shoppercloud'
import CreateListHeaders from './activities/createlistheaders'
import ExpiredList from './activities/expiredlist';
import ListDetails from './activities/listdetails'
import firebaseApp from './_sharedComponent/firebase_connector'
import Details from './activities/othersdetails';
import PastList  from './activities/pastlist'
import {connect} from "react-redux";


class RootApp extends Component{

    constructor(props){
        super(props);

        this.state = {
            modalVisible:false
        };

    }

    componentWillMount(){
        let connectedRef = firebaseApp.database().ref(".info/connected");
        connectedRef.on("value", (snap)=>{
            if (snap.val() === true) {
                this.props.goOnline()

            } else {
                //do  nothing for now
               this.props.goOffline()
            }
        });
    }


render() {

    return (
            <Router >
                <Scene key='root'>
                    <Scene initial key='welcomepage' hideNavBar component={Welcomepage}/>
                    <Scene key='pinpage' hideNavBar component={PinPage}/>
                    <Scene key='dashboard' hideNavBar component={DashBoard}/>
                    <Scene key='listheader' hideNavBar component={ListHeaders}/>
                    <Scene key='account' hideNavBar component={Account}/>
                    <Scene key='register' hideNavBar component={Register}/>
                    <Scene key='createlist' hideNavBar component={CreateList}/>
                    <Scene key='liststat' hideNavBar component={ListStats}/>
                    <Scene key='listsettings' hideNavBar component={ListSettings}/>
                    <Scene key='shopperscloud' hideNavBar component={ShopperCloud}/>
                    <Scene key='createlistheader' hideNavBar component={CreateListHeaders}/>
                    <Scene key='listdetails' hideNavBar component={ListDetails}/>
                    <Scene key='expiredlist' hideNavBar component={ExpiredList}/>
                    <Scene key='details' hideNavBar component={Details}/>
                    <Scene key='pastlist' hideNavBar component={PastList}/>
                </Scene>

            </Router>
    )
}
};

function mapDispatchToProps(dispatch) {
    return{
        goOffline: ()=>{
            dispatch(goOffline())
        },
        goOnline : () => {
            dispatch(goOnline())
        }
    }
}

const styles = StyleSheet.create({
    container: {
        padding:10,
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        width:'100%',
        marginBottom: 5,
    },
    main:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(10,10,10, 0.8)"
    }
});

export default connect(null, mapDispatchToProps)(RootApp)
