/**
 * Created by archibold on 15/07/2018.
 */
import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput, Modal,TouchableOpacity,
    FlatList, Platform,BackHandler, Share} from 'react-native'
import {Actions} from 'react-native-router-flux'
import NavBar from '../_sharedComponent/navBar'
import Icon from 'react-native-vector-icons/Ionicons'
import firebaseApp from '../_sharedComponent/firebase_connector'
import {connect} from 'react-redux'
import {fetchUserList, updateUserList} from '../../redux/actions'
import {Card, DropDownMenu} from '@shoutem/ui'


let listHeaders = [];
class ListHeaders extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showmodal: false,
            refreshing: false,
            deletekey:''
        };

    }

    componentWillMount(){

        let itemstorender = this.props.loadlist;

        let list = this.props.list;
        switch (itemstorender){
            case 'currentlist':
                this.setState({
                    data:list.currentlist
                });
                break;
            default: //do nothing
        }
        BackHandler.addEventListener('hardwareBackPress' , ()=>{Actions.dashboard(); return true});

    }

    renderData = () =>{
        let pin = this.props.pin;
        return(
            <FlatList
                onRefresh={()=>{
                    this.setState({refreshing:true});
                    this.refreshData(pin.pin)
                }}
                refreshing={this.state.refreshing}
                showsVerticalScrollIndicator = {false}
                data={this.state.data}
                keyExtractor ={(item)=>{item.key}}
                renderItem={({item, index}) =>
                    <Card
                       style = {{elevation:1, width:'100%', margin:5,shadowColor:'#ccc',
                        height:70, flexDirection:'row'}}>
                        <TouchableOpacity
                            onPress={()=>{Actions.listdetails({listKey:item.key,listname:item.name, date:item.date})}}
                            style={{height:'100%', width:'100%', flexDirection:'row', justifyContent:'space-between'}}>
                            <View style={{height:'100%', flex:1,flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                                <View style={{height:'100%', width:2, backgroundColor:getRandomColor()}}/>

                                <View style={{flexDirection:'column',padding:6, justifyContent:'flex-start'}}>
                                    <Text style = {{fontWeight:'bold', fontSize:16}}>{item.name}</Text>
                                    <Text style={{color:'green', fontSize:11}}>{item.date}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress = {()=>{this.setState({showmodal:true,deletekey:item.key})}}
                                style={{height:'100%',width:50, alignItems:"center", justifyContent:'center'}}>
                                <Icon name="md-more" size={26}/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Card>
                }
              /*  ItemSeparatorComponent = {()=>{
                    return(
                    <View style={{height:0.8, width:'100%', backgroundColor:'#cbcbcb'}}/>
                    )
                }}*/
                ListEmptyComponent={this.renderNoListItem()}
            />

        )
    };

    renderNoListItem = ()=>{
        return(
            <View style = {{flex:1, justifyContent:'center', alignItems:'center', marginTop:100}}>
                <Icon name = "ios-list-outline" size={100} />
                <Text>{this.props.page} is empty</Text>
            </View>
        )
    };

    refreshData = (pin) => {
        let dateNow = new Date().getTime();
        let currentlist = [];
        let listLink = firebaseApp.database().ref().child("list").child(pin).child(this.props.loadlist);
        listLink.once('value', (snap) => {
            snap.forEach((child) => {
                let listdate = child.val().date;
                listdate = new Date(listdate).getTime();
                console.log(child.val());
                if (dateNow === listdate || listdate > dateNow) {
                    currentlist.push(
                        child.val()
                    )
                }

            });
            this.setState({
                data: currentlist,
                refreshing: false
            })
        });
    }

    render(){
        return(
            <View style = {css.container}>
                {this.showModal()}
                <NavBar
                    style = {{justifyContent:'flex-start'}}
                    title={this.props.page}
                    showback backto="Home"
                    advancedtoolbar={
                            <TouchableOpacity
                                onPress={()=>{
                                    let pin = this.props.pin;

                                    this.setState({refreshing:true});
                                    this.refreshData(pin.pin)
                                }}
                                style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                margin: 10
                            }}>
                                <Icon name="ios-refresh-circle" size={30} color="green"/>
                            </TouchableOpacity>
                    }
                />

                <View style = {css.mainarea}>
                    {this.renderData(this.state.data)}
                </View>

                <View style = {css.searchbar}>
                    <View style={{height:"100%",justifyContent:"center", alignItems:"center", padding:4}}>
                    <Icon  name="ios-search-outline" size={24}/>
                    </View>
                    <TextInput
                        autoFocus={false}
                        placeholder="Search..."
                        style={{width:'100%', flex:1}}
                        underlineColorAndroid="transparent"
                        onChangeText={(value)=>{
                            let searchArray = [];
                            let currArray = this.state.data;

                            currArray.forEach((item)=>{
                                if(item.name.toLowerCase().indexOf(value.toLowerCase())> -1){
                                    searchArray.push(item);
                                    this.setState({data:searchArray})

                                }else{
                                    this.setState({data:listHeaders})

                                }
                            })
                        }}
                    />
                </View>
            </View>
        )
    }

    showModal = () =>{
        return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.showmodal}
                onRequestClose={()=>{console.log("List name closed")}}
            >

                <View style={{backgroundColor:'rgba(10,10,10, 0.8)',justifyContent:'center', alignItems:'center', height:'100%', width:'100%'}}>
                    <View>
                    <TouchableOpacity
                        onPress = {()=> {
                            Share.share(
                                {
                                    message:"Test share"
                                }
                            )
                            this.setState({showmodal: false})

                        }}
                        style={{flexDirection:"row", justifyContent:'flex-start', padding:4, alignItems:"center"}}>
                        <Icon name={Platform.OS === "android"?'md-share':'ios-share-outline'} size={26} color="white"/>
                        <Text style={{color:"white", fontSize:16, margin:2}}>Share this list</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {()=>this.setState({showmodal:false})}
                        style={{flexDirection:"row", justifyContent:'flex-start', padding:4, alignItems:"center"}}>
                        <Icon name="ios-cloud-done-outline" size={26} color="white"/>
                        <Text style={{color:"white", fontSize:16, margin:2}}>Upload to Shoppers cloud</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {()=>
                        {
                            let pin = this.props.pin;
                            let link = firebaseApp.database().ref().child("list").child(pin.pin).child("currentlist").child(this.state.deletekey);
                            link.set(null);
                            this.setState({showmodal:false,deletekey:"nothing"});
                            this.refreshData(pin.pin)
                        }
                        }
                        style={{flexDirection:"row", justifyContent:'flex-start', padding:4, alignItems:"center"}}>
                        <Icon name="ios-trash-outline" size={26} color="white"/>
                        <Text style={{color:"white", fontSize:16, margin:2}}>Delete list</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }



    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress' , ()=>{Actions.dashboard(); return true});

    }

}

const css = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'white'
    },
    searchbar:{
        height:45,
        width: '100%',
        justifyContent:'flex-end',
        backgroundColor:'white',
        alignItems:'flex-end',
        borderTopWidth:0.7,
        borderTopColor:"#cbcbcb",
        flexDirection:"row"
    },
    mainarea:{
        flex:1,
        flexDirection:'row',
        height:"100%",
        marginRight:6
    }
});


function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function mapStateToProps(state) {
    return {
        pin: state.pinReducer,
        list: state.listReducer
    }
}

function mapDispatchToProps(dispatch){
    return{
        saveList : (list) =>{
            dispatch()
        },
        updateList :(list) => {
            dispatch(updateUserList(list))
        },
        fetchList: (pin) =>{
            dispatch(fetchUserList(pin))
        }
    }
}

export  default connect(mapStateToProps,mapDispatchToProps)(ListHeaders);