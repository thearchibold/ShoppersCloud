/**
 * Created by archibold on 15/07/2018.
 */
/**
 * Created by archibold on 15/07/2018.
 */
import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity,TextInput,  FlatList,BackHandler, ScrollView,Modal} from 'react-native'
import {Actions} from 'react-native-router-flux'
import NavBar from '../_sharedComponent/navBar'
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux'
import firebaseApp from '../_sharedComponent/firebase_connector'
import Spinner from 'react-native-spinkit'
import {fetchUserList} from '../../redux/actions'


class CreateList extends Component{
    constructor(props){
        super(props);

        this.state={
            list:[],
            listitem:'',
            listdate:'',
            listnote:'',
            unaquireditems:[],
            showmodal:false,
            isDateTimePickerVisible:false
        }
    }
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{ Actions.dashboard()});
        let date = new Date();
        this.setState({
            listdate:date.toDateString()
        })
    }




    render(){
        let{pin, userdetails} = this.props.pin;
        let {offline} = this.props.netState;

        return(
            <View style={css.container}>
                {this.showModal()}

                <NavBar title={this.props.listname} showback backto="Home"
                        advancedtoolbar={
                            <TouchableOpacity
                                onPress={()=>{
                                    if(this.state.list.length !== 0){
                                        this.setState({showmodal:true});
                                        let listlink = firebaseApp.database().ref().child("list").child(pin).child("currentlist")
                                        let key = listlink.push().key;
                                        let listheader = {
                                            key,
                                            "name":this.props.listname,
                                            "date":this.props.listdate
                                        };
                                        listlink.child(key).set(listheader);

                                        let all_list = firebaseApp.database().ref().child("all-list").child(key);
                                        all_list.child("items").set(this.state.list);
                                        if(userdetails.coordinate){
                                            all_list.child("location/").set(userdetails.coordinate);

                                        }

                                        this.props.fetctlist(pin);

                                        setTimeout(()=>{
                                            this.setState({showmodal:false});
                                            Actions.dashboard();
                                        }, 3000)
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    margin: 10
                                }}>
                                <Text style = {{color:"green"}}>SUBMIT</Text>
                            </TouchableOpacity>
                        }
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    >
                <View style = {css.mainarea}>
                    {
                        this.state.unaquireditems.length > 0?
                            <View style = {{marginTop:15}}>
                                <Text style={{color:'green'}}>Unacquired items from previous list</Text>
                                {this.itemsFromPrevList()}
                            </View>: null
                    }

                    {
                        this.renderListItems()
                    }
                </View>
                </ScrollView>

                <View style = {css.footer}>
                    <TextInput
                        value={this.state.listitem}
                        style={css.addarea}
                        autoFocus={false}
                        placeholder="Add item..."
                        underlineColorAndroid="transparent"
                        onChangeText={(value)=>{this.setState({listitem:value})}}
                    />
                    <TouchableOpacity
                        onPress = {()=>{this.addItemToList(this.state.listitem)}}
                        style = {{
                            height:45,
                            width:45,
                            justifyContent:'center',
                            alignItems:'center'
                        }}
                    >
                        <Icon name="ios-add-circle" size={40} color="green"/>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    renderNoListItem = ()=>{
        return(
            <View style = {{flex:1, justifyContent:'center', alignItems:'center', height:'100%'}}>
                <Icon name = "ios-list-outline" size={100} />
                <Text>{this.props.listname} is empty. Add items to list</Text>
            </View>
        )
    };

    renderListItems = ()=>{
        return(
            <FlatList
                keyboardShouldPersistTaps="always"
                ref={elm => this.flatList = elm}
                data={this.state.list}
                renderItem={({item, index})=>{
                    return(
                        <View style={{width:'100%',alignSelf:'baseline',padding:10}}>
                            <View style ={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                <View style={{justifyContent:'space-between', flexDirection:'row', flex:1}}>
                                    <Text style={{fontWeight:"900", fontSize:16}}>{item.name}</Text>
                                    <TouchableOpacity>
                                        <Icon name="md-more" size={24}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TextInput
                                value={item.note}
                                style={{fontSize:14, alignSelf:'baseline', flex:1, marginTop:-10,fontWeight:"400", width:'100%'}}
                                autoFocus={false}
                                placeholder="Add notes"
                                underlineColorAndroid="transparent"
                                onChangeText={(value)=>{
                                    let list = this.state.list;
                                    list[index].note = value;
                                    this.setState({
                                        list:list
                                    })
                                }}
                            />
                        </View>
                    )
                }}

                ListEmptyComponent={this.renderNoListItem()}
                ItemSeparatorComponent={()=>{
                    return(
                        <View style={{height:0.7, width:'100%', backgroundColor:"#cbcbcb"}}/>
                    )
                }}
            />
        )
    };

    addItemToList = (item) =>{
        if(this.state.listitem !== "") {
            let currArray = this.state.list;
            currArray.push({name: item, note: "",bought:false});
            currArray.reverse();
            this.setState({list: currArray,listitem:''});

        }
    };

    itemsFromPrevList = () => {
       return(
           <FlatList
               horizontal
               keyboardShouldPersistTaps
               data={this.state.unaquireditems}
               renderItem = {({item, index})=>{
                      return(
                          <View style={css.previtem}>
                              <Text>{item.name}</Text>
                          </View>
                      )
                   }
               }
           />
       )
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

}
const css = StyleSheet.create({
    container:{
        flexDirection:'column',
        flex:1,
        backgroundColor:'white'
    },
    mainarea:{
        flex:1,
        padding:10
    },
    footer:{
        height:45,
        justifyContent:'flex-end',
        borderTopColor:'#cbcbcb',
        flexDirection:'row',
        borderTopWidth:0.7
    },
    addarea:{
        flex:1
    },
    datearea:{
        height:35,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:4,
        paddingRight:4
    },previtem:{
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#f7f7f7",
        borderRadius:100,
        padding:8,
        margin:10
    }
});

function mapStateToProps(state) {
    return {
        pin: state.pinReducer,
        netState: state.listReducer
    }
}
function mapDispatchToProps(dispatch) {
    return{
        fetctlist: (pin) =>{
            dispatch(fetchUserList(pin))
        }
    }
}



export  default connect(mapStateToProps,mapDispatchToProps)(CreateList);