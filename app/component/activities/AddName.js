/**
 * Created by archibold on 28/06/2018.
 */
import React, {Component} from 'react'
import {View, Text, TextInput, Button, ToastAndroid} from 'react-native'
import NavBar from '../_sharedComponent/navBar'
import {addNameToList} from '../../redux/actions'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'


const AddName = (props) =>{

   let  {username,password} = props.name;
        username = null;

        return (
            <View style = {{flex:1}}>
                <View style = {{ width:'100%'}}>
                    <NavBar title="Add Name" showback/>
                </View>

                <View style={{height: '100%',width:'100%', flex: 1,  alignItems: 'center', padding:20}}>
                    <TextInput
                        value={username}
                        style={{width:'100%'}}
                        placeholder="Enter Item name"
                        onChangeText={(value) => {
                            username = value
                        }}
                    />
                </View>
                <Button title="Add Item" onPress={()=>{
                    if(username !== null) {
                        props.addname(username);
                        username = '';

                    }else{
                        ToastAndroid.showWithGravity("Username is empty",ToastAndroid.LONG, ToastAndroid.CENTER);
                    }
                }}/>

            </View>
        )


};
function mapStateToProps(state) {
    return{
        name: state
    }
}
function mapDispatchToProps(dispatch) {
        return{
            addname:(item)=>{
                dispatch(addNameToList(item))
            }
        }
}


export default connect (mapStateToProps, mapDispatchToProps)(AddName);