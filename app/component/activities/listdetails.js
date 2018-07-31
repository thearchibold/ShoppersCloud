/**
 * Created by archibold on 26/07/2018.
 */
import React, {Component} from 'react'
import {View, Text,TouchableOpacity, FlatList, CheckBox,Alert, BackHandler, ScrollView} from 'react-native'
import NavBar from '../_sharedComponent/navBar'
import firebaseApp from '../_sharedComponent/firebase_connector'
import {Caption, Title,Subtitle} from '@shoutem/ui'
import {Actions} from 'react-native-router-flux'


let link ;
let listkey;
let itemArray = [];
let placetoget = [
    {shopname:"GFK ventures", price:2.7},
    {shopname:"Minty's Home ", price:20},
    {shopname:"GFK ventures", price:2.7},
    {shopname:"Minty's Home ", price:20}
]
export default class ListDetails extends Component {
    constructor(props){
        super(props);
         listkey= this.props.key;
        this.state = {
            data:[],
            boughtitem:0,

        }

        this.handleBack = this.handleBack.bind(this)
    }
    componentWillMount(){

        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        itemArray = [];

        link = firebaseApp.database().ref().child("all-list").child(this.props.listKey).child("items");

        link.on('value',(snap)=>{
            let count = 0;
            snap.forEach(item=>{
                itemArray.push(item.val());
                if(!item.val().bought)
                    count +=1
            });
            this.setState({
                data:itemArray,
                boughtitem:count
            });

        });
    }

    handleBack = () => {
      Actions.pop();
      return true
    };


    renderData = () =>{
        let itemArray = [];
        link = firebaseApp.database().ref().child("all-list").child(this.props.listKey).child("items");

        link.on('value',(snap)=>{
            snap.forEach(item=>{
                let itembought = item.val().bought;
                if(!itembought){
                    itemArray.push(item.val())
                }

            });

            console.log(itemArray)
        });
    };

    renderPlaceToGet = () => {
       return(
         <FlatList
             horizontal
             data = {placetoget}
             renderItem = {({item, index})=>{
                return(
                    <View style={{margin:6,flexDirection:"row", backgroundColor:"#f8f8f8", borderRadius:10, justifyContent:"center", alignItems:"center", padding:6}}>
                        <Text>{item.shopname}</Text>
                        <Text> | GHs {item.price}</Text>
                    </View>
                )
             }}
         />
       )
    };

    render (){
        return(
            <View style={{flex:1, backgroundColor:'white'}}>
                <NavBar title={this.props.page} showback backto="List"
                        advancedtoolbar={
                            <TouchableOpacity
                                onPress={()=>{
                                    this.renderData();
                                }}
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    margin: 10
                                }}>
                                <Text style = {{color:"green", alignSelf:'center', fontSize:16}}>DONE</Text>
                            </TouchableOpacity>
                        }
                />

                <View style={{width:"100%", height:60, justifyContent:"center", padding:6, alignItems:"center"}}>
                    <Text style={{fontSize:18, color:"green", fontWeight:"bold"}}>{this.props.listname}</Text>
                    <Text> - Press item to reveal notes - </Text>
                </View>


                <View style={{flex:1, height:'100%', width:'100%'}}>
                    <FlatList
                        onRefresh={()=>{alert("refreshing")}}
                        refreshing={false}
                        showsVerticalScrollIndicator = {false}
                        vertical
                        data={this.state.data}
                        renderItem = {({item, index}) =>
                        <View style={{flexDirection:"row",flex:1, padding:8,justifyContent:"center"}}>
{/*
                               <View style={{height:6,width:6, backgroundColor:"green", borderRadius:6, alignSelf:"center"}}/>
*/}

                                <View style={{width:"100%",height:"100%", justifyContent:"space-between",  flexDirection:'row', alignItems:"center"}}>
                                    <View style={{height:"100%", justifyContent:"center", flexDirection:"column", width:"90%"}}>
                                       <TouchableOpacity
                                           onPress = {()=>{
                                               Alert.alert(
                                                   item.name,
                                                   item.note? item.note:"Not available",
                                               )
                                           }}
                                       >
                                        <Text styleName={item.bought? "line-through": ""}
                                                 style={{fontSize:20, fontWeight:'bold', color:item.bought?"green":"#232323"}}
                                        >{item.name}</Text>
                                       </TouchableOpacity>
                                       <View style = {{height:30, width:"100%"}}>
                                           {this.renderPlaceToGet()}
                                       </View>
                                    </View>

                                    <CheckBox
                                        tintColor="green"
                                        value={item.bought}
                                        onValueChange={(value)=>{
                                            let update = {
                                                name:item.name,
                                                note: item.note,
                                                bought: value
                                            };
                                            link.child(index).set(update);
                                            itemArray = [];

                                            link = firebaseApp.database().ref().child("all-list").child(this.props.listKey).child("items");

                                            link.on('value',(snap)=>{
                                                let count = 0;
                                                snap.forEach(item=>{
                                                    itemArray.push(item.val());
                                                    if(item.val().bought)
                                                        count +=1
                                                });
                                                this.setState({
                                                    data:itemArray,
                                                    boughtitem:count
                                                });

                                            });

                                        }}
                                    />
                            </View>
                        </View>

                        }
                        ItemSeparatorComponent = {()=>{
                           return(
                               <View style={{height:0.6, width:'100%',backgroundColor:'#ccc'}}/>
                           )
                        }}
                    />


                    <View style={{height:30, width:"100%",
                        flexDirection:"row", borderTopWidth:1,alignItems:"center",
                        borderTopColor:"green", justifyContent:"space-between"}}>
                        <Subtitle style={{alignSelf:'center', fontSize:14,color:"#4a4949"}}>{this.props.date}</Subtitle>
                        <Text>{this.state.boughtitem}/{this.state.data.length}</Text>
                    </View>

                </View>
                <View>

                </View>
            </View>
        )
    }
}