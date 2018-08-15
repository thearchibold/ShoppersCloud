/**
 * Created by archibold on 13/08/2018.
 */
import React, {Component} from 'react'
import {View, Text, FlatList, TouchableOpacity,CheckBox} from 'react-native'
import NavBar from '../_sharedComponent/navBar'
import firebaseApp from '../_sharedComponent/firebase_connector'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {getRandomColor,getFirstLetter} from '../_sharedComponent/generatePDF'
import Icon from 'react-native-vector-icons/Ionicons'
import {updateUserList} from '../../redux/actions'



class PastList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listdata:[],
           counter:0
        }
    }

    componentWillMount(){
        let {pin} = this.props.pin;
        let dateNow = new Date();
        dateNow.setHours(0);
        dateNow.setMinutes(0);
        dateNow.setSeconds(0);
        dateNow = dateNow.setMilliseconds(0);

        let currentList = [];
        let pastList = [];

        let listLink = firebaseApp.database().ref().child("list").child(pin).child("currentlist");
        listLink.once('value', (snap) => {
            snap.forEach((child) => {
                let listdate = child.val().date;
                listdate = new Date(listdate);
                listdate.setHours(0);
                listdate.setMinutes(0);
                listdate.setSeconds(0);
                listdate = listdate.setMilliseconds(0);
                if(dateNow <= listdate ){
                    currentList.push(
                        child.val()
                    )
                }else{
                    pastList.push(
                        {
                            picked:false,
                            data:child.val()

                        }
                    )
                }
            });

            this.setState({
                listdata:pastList
            })
        })
    }


    render(){
        let {pin} = this.props.pin;
        return(
            <View style={{flex:1, height:'100%', width:'100%', backgroundColor:'white'}}>
                <NavBar title="Past List" showback backto="Home"/>
               <View style={{flex:1}}>
                   <FlatList
                       data={this.state.listdata}
                       renderItem={({item, index})=>
                           <TouchableOpacity
                               onPress = {()=>{
                                   let currdata = this.state.listdata;
                                   currdata[index].picked = true;
                                   this.setState({
                                       counter:this.state.counter + 1,
                                       listdata:currdata
                                   })
                               }}
                               style={{flexDirection:"row", padding:4, marginBottom:15, alignItems:"center", backgroundColor:item.picked?"green":null}}>
                               <View style={{...css.roundAvater, backgroundColor:getRandomColor()}}>
                                   <Text style={{color:"white", fontWeight:"bold", fontSize:24}}>{getFirstLetter(item.data.name)}</Text>
                               </View>
                               <View style={{justifyContent:"center", margin:6 }}>
                                   <Text style={{ fontWeight:"bold", fontSize:16}}>{item.data.name}</Text>
                                   <Text style={{ color:"green", fontSize:13}}>{item.data.date}</Text>
                               </View>
                               <Text>{this.state.counter}</Text>
                           </TouchableOpacity>
                       }
                   />
               </View>
            </View>
        )
    }


}

const css = {
    roundAvater:{
        height:50,
        width:50,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:50
    }

};

function mapStateToProps(state) {
    return{
        pin:state.pinReducer
    }
}

export default connect(mapStateToProps, null)(PastList)
