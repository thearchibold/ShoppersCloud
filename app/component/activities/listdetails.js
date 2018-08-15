/**
 * Created by archibold on 26/07/2018.
 */
import React, {Component} from 'react'
import {
    View, Text, TouchableOpacity, FlatList,
    TextInput,AsyncStorage,Image,
    CheckBox, Alert, BackHandler, StyleSheet, Modal, Picker
} from 'react-native'
import NavBar from '../_sharedComponent/navBar'
import firebaseApp from '../_sharedComponent/firebase_connector'
import {Caption, Title,Subtitle} from '@shoutem/ui'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux'
import {getRandomColor} from '../_sharedComponent/generatePDF'
import {updateUserList} from '../../redux/actions'

const haversine = require('haversine');
const compareTo = require('string-similarity');


let link ;
let listkey;
let name = '';
let phone = '';

class ListDetails extends Component {
    constructor(props){
        super(props);
         listkey=this.props.key;
        this.state = {
            refreshing:false,
            data:[],
            shopestimate:[],
            boughtitem:0,
            showmodal:false,
            name:'',
            selectedShop:'',
            selectedShopKey:'',
            selectedShopCoord:'',
            itemKey:'',
            item:'',
            listKey:'',
            position:'',
            optPrice:'',
            optQty:'',
            optDes:'',
            user:'',
            phone:'',
            show:'items',
            totalItem:0,
            distance:0.1,
            currCoordinate:null
        };





        this.handleBack = this.handleBack.bind(this)
    }
    componentWillMount(){

        navigator.geolocation.getCurrentPosition(
            (position)=>{

                let coord = {lat:position.coords.latitude, lon:position.coords.longitude};
                console.log(coord);
                this.setState({
                    currCoordinate:coord
                })
            }

        );

        BackHandler.addEventListener('hardwareBackPress', this.handleBack);

        this.renderData();
        this.renderShopItem()

    }

    async componentDidMount(){
        let value  = await AsyncStorage.getItem('user');
        console.log(JSON.parse(value));
        this.setState({value:value})
    }

    handleBack = () => {
      Actions.pop();
      return true
    };


    renderData = () =>{
        this.setState({refreshing:true});

        let itemArray = [];
        let done = false;
        link = firebaseApp.database().ref().child("all-list").child(this.props.listKey).child("items");

        link.once('value',(snap)=>{

            snap.forEach(item=>{
                let currItemArray = [];
                let itemKey = item.key;
                const currItem = item.val().name;
                /*Loading the shops and the items they have*/
                firebaseApp.database().ref().child("shops").once('value',(child)=>{
                    let foundItems = [];
                    let itemitself = {};
                    child.forEach(itemShop=> {                  // looping through the shops one by one
                                                                  // items in the shop
                        const details = itemShop.val().details || [];// this is the shop details

                        let dist = 0;
                        let decider = false;
                        if (details.coordinate) {
                           dist = (getDistanceFromLatLonInKm(details.coordinate.lat,details.coordinate.longitude,this.state.currCoordinate.lat,this.state.currCoordinate.lon))
                            let distance = this.state.distance;
                            if(parseInt(+ dist) < parseInt(+distance)){
                                decider = true;
                            }
                        }
                        if(decider) {
                            const shopKey = itemShop.key;          // shop key value
                            const stock =itemShop.val().stock;
                            try {
                                stock.forEach(entity => {                // looping  through 1 shop stock
                                    const entItem = entity.item;
                                    if (compareTo.compareTwoStrings(currItem,entItem) > 0.6) {      // check if the item is in the stock
                                        let itemextra = {
                                            shopKey,
                                            price: entity.price,
                                            shop: details
                                        };

                                        foundItems.push(itemextra)
                                    }
                                });


                            } catch (error) {
                                console.log(error.message)
                            }
                        }
                        let uniqueKey = this.props.listKey + "-" + itemKey;
                        itemitself = {
                            key: uniqueKey,
                            listKey: this.props.listKey,
                            position: itemKey,
                            name: item.val().name,
                            bought: item.val().bought,
                            note: item.val().note,
                            status: item.val().status || null,
                            extrainfo: foundItems
                        };


                    });
                        itemArray.push(itemitself);
                });

            });

            setTimeout(()=>{
                this.setState({
                    data:itemArray.reverse(),
                    refreshing:false
                });
            }, 4000)
        });
    };

    renderShopItem = () =>{
        let finalItemsArray = [];
        link = firebaseApp.database().ref().child("all-list").child(this.props.listKey).child("items");
        link.once('value',(snap)=> {
            let currItemArray = [];
            let counter = 0;
            let avprice = 0;
            snap.forEach(item => {
                let itemKey = item.key;
                const currItem = item.val().name;
                currItemArray.push(currItem)
            });
            firebaseApp.database().ref().child("shops").once('value', snapshot=>{
                snapshot.forEach(child=>{
                    let shopdetails = child.val().details;
                    let shopStock = child.val().stock;
                    let ishaving = false;
                    counter = 0;
                    avprice = 0;
                   try{
                       shopStock.forEach(stockItem=>{

                           const stockitem = stockItem.item;

                           currItemArray.forEach(curritem=>{
                               if(curritem.includes(stockitem)){
                                   avprice = parseInt(avprice) + parseInt(stockItem.price);
                                   ishaving = true;
                                   counter ++
                               }
                           });

                       });
                   }catch (error){
                       console.log(error.message)
                   }

                    if(ishaving){
                        finalItemsArray.push({
                            shop:shopdetails,
                            count: counter,
                            total:avprice
                        });
                    counter = 0;
                    }
                });
                this.setState({
                    shopestimate:finalItemsArray,
                    totalItem:currItemArray.length
                })
                console.log(finalItemsArray)
            })

        })

    };

    showModal = () =>{

        return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.showmodal}
                onRequestClose={()=>{console.log("List name closed")}}
            >

                <TouchableOpacity
                    onPress = {()=>{this.setState({
                        showmodal:false,

                        name:'',
                        selectedShop:'',
                        selectedShopKey:'',
                        itemKey:'',
                        item:'',
                        listKey:'',
                        position:'',
                        optPrice:'',
                        optQty:'',
                        optDes:''
                    })}}
                    activeOpacity={0.95}
                    style={{flex:1,backgroundColor:'rgba(10,10,10, 0.9)',justifyContent:'center',  padding:15,height:'100%', width:'100%'}}>

                    <View style={{height:"100%",  alignItems:'center', width:'100%',padding:10}}>

                        <View style={{height:100, width:'100%', justifyContent:"center", alignItems:"center"}}>
                            <Text style = {{color:"white", fontSize:24, fontWeight:"bold"}}>{this.state.shopname?this.state.shopname.shopname:"Shop Name"}</Text>
                            <Text style = {{color:"white", fontSize:16, fontStyle:'italic', margin:2}}>{this.state.shopname?this.state.shopname.location:"Location"}</Text>
                            <Text style = {{color:"green", fontSize:12}}>{
                                getDistanceFromLatLonInKm(
                                    this.state.shopname ? this.state.shopname.coordinate.lat:0,
                                    this.state.shopname ? this.state.shopname.coordinate.longitude:0,
                                    this.state.currCoordinate ? this.state.currCoordinate.lat :0,
                                    this.state.currCoordinate ? this.state.currCoordinate.lon :0,
                                ).toFixed(2)
                            } km  away</Text>
                        </View>
                            <TextInput
                                onChangeText={(value)=>{
                                    this.setState({optQty:value})
                                }}
                                value={this.state.optQty}
                                placeholderTextColor="white"
                                style={{color:"white", fontWeight:"bold",width:"100%", }}
                                underlineColorAndroid="white"
                                placeholder="*Qty..."
                                keyboardType="numeric"
                                autoFocus={false}
                            />
                            <TextInput
                                onChangeText={(value)=>{
                                    this.setState({optPrice:value})
                                }}
                                value={this.state.optPrice}
                                placeholderTextColor="white"
                                style={{color:"white", fontWeight:"bold",width:"100%"}}
                                underlineColorAndroid="white"
                                placeholder="*Amt..."
                                keyboardType="numeric"
                                autoFocus={false}
                            />

                        <TextInput
                            onChangeText={(value)=>{
                                this.setState({optDes:value})
                            }}
                            value={this.state.optDes}
                            placeholderTextColor="white"
                            style={{color:"white", fontWeight:"bold",width:"100%"}}
                            underlineColorAndroid="white"
                            placeholder="Add small description..."
                            keyboardType="defaule"
                            autoFocus={false}
                        />

                            <TouchableOpacity

                                onPress={()=>{
                                    let reqLink = firebaseApp.database().ref().child("shops").
                                    child(this.state.selectedShopKey).child("customer-request").child(this.state.itemKey);
                                    let item = {
                                        userdetails:{name:this.state.user, phone:this.state.phone},
                                        listKey:this.state.listKey,
                                        position:this.state.position,
                                        item:this.state.item,
                                        price: parseInt(this.state.optPrice || "0"),
                                        quantity: parseInt(this.state.optQty || "0"),
                                        des:this.state.optDes
                                    }
                                    console.log(item);
                                     let key = reqLink.set(item);
                                    this.setState({
                                        showmodal:false
                                    })
                                }}
                                activeOpacity={0.5}
                                style={{borderRadius:10,width:'100%',margin:10,
                                    alignItems:"center",backgroundColor:"green",
                                    justifyContent:"center",padding:8}}>
                                <Text style={{color:'white', fontWeight:'bold'}}>Buy Item</Text>
                            </TouchableOpacity>

                    </View>

                </TouchableOpacity>

            </Modal>
        )
    };


    renderPlaceToGet = (userdetails,data,name, itemkey, key, position) => {
       return(
         <FlatList
             horizontal
             showsHorizontalScrollIndicator = {false}
             data = {data}
             renderItem = {({item, index})=>{
                return(
                    <TouchableOpacity
                        onPress = {()=>{
                            this.setState({
                                showmodal:true,
                                shopname:item.shop,
                                selectedShopKey:item.shopKey,
                                itemKey:itemkey,
                                item:name,
                                listKey:key,
                                position: position,
                                user:userdetails.name,
                                phone:userdetails.phone
                            });

                        }}
                        style={{margin:6,flexDirection:"row", backgroundColor:"#f8f8f8", borderRadius:10, justifyContent:"center", alignItems:"center", padding:6}}>
                        <Text>{item.shop.shopname}</Text>
                        <Text style={{fontWeight:"bold"}}> | GHs {item.price}</Text>
                    </TouchableOpacity>
                )
             }}
             ListEmptyComponent = {()=>{
                 return(
                     <Text style={{alignSelf:"center"}}>No shop near you for this item</Text>
                 )
             }}
         />
       )
    };

    render (){

        let {userdetails, pin} = this.props.pin;
        return(
            <View style={{flex:1, backgroundColor:'white'}}>
                <NavBar title={this.props.listname} showback backto="List"
                        advancedtoolbar={

                                <TouchableOpacity
                                    onPress={()=>{
                                        doneShopping(pin, this.props.listKey);

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

                <View style={{width:"100%",justifyContent:"center", padding:6, alignItems:"center"}}>
                    <Text style={{color:"green"}}> - Press item to reveal notes - </Text>
                </View>
                <View>
                    <FlatList
                        onRefresh={()=>{
                            this.renderData();
                            this.setState({refreshing:true});
                        }}
                        refreshing={this.state.refreshing}
                        horizontal
                        data={this.state.shopestimate}
                        renderItem={({item})=>{
                          return(
                              <View style={{justifyContent:"center", alignItems:"center", margin:8}}>
                                  <View style={{justifyContent:"center",height:45, width:45, borderRadius:40,
                                      alignItems:"center", backgroundColor:getRandomColor()}}>
                                        <Text style={{color:"white", fontWeight:"bold", fontSize:18}}>
                                            {item.count}/{this.state.totalItem}
                                        </Text>
                                  </View>
                                  <Text>{item.shop.shopname}</Text>
                                  <Text style={{fontSize:10}}>{item.shop.location}</Text>
                                  <Text style={{fontSize:10}}>Price est. <Text style={{fontSize:12, fontWeight:"bold"}}>Ghs {item.total}</Text></Text>
                              </View>
                          )
                        }}
                    />
                </View>
                <View style={{height:1, width:"100%", margin:2, backgroundColor:"#ff651c"}}/>

                {this.showModal()}

                <View style={{flex:1, height:'100%', width:'100%'}}>
                    <FlatList
                        /*onRefresh={()=>{alert("refreshing")}}
                        refreshing={false}*/
                        showsVerticalScrollIndicator = {false}
                        vertical
                        data={this.state.data}
                        renderItem = {({item, index}) =>
                            <View style={{flexDirection:"row",flex:1, padding:8,justifyContent:"center"}}>

                                <View style={{width:"100%",height:"100%", justifyContent:"space-between",  flexDirection:'row', alignItems:"center"}}>
                                    <View style={{height:"100%", justifyContent:"center", flexDirection:"column", width:"100%"}}>
                                        <View style={{flexDirection:"row",justifyContent:"space-between", height:30, alignItems:"center", width:"100%"}}>
                                            <TouchableOpacity
                                                style={{height:30, justifyContent:"center", alignItems:"center"}}
                                                onPress = {()=>{
                                                    Alert.alert(
                                                        item.name,
                                                        item.note? item.note:"Not available",
                                                    )
                                                }}
                                            >
                                                <Title styleName=  {item.bought? 'line-through': null}
                                                       style={{fontSize:20,marginTop:10, fontWeight:'bold', color:item.bought?"green":"#232323"}}
                                                >{item.name}</Title>
                                            </TouchableOpacity>
                                            <View>
                                                <CheckBox
                                                    tintColor="green"
                                                    value={item.bought}
                                                    onValueChange={(value)=>{

                                                        let currArray = this.state.data;
                                                        currArray[index].bought = value;

                                                        this.setState({
                                                            data:currArray
                                                        });
                                                        firebaseApp.database().ref().child("all-list").child(this.props.listKey)
                                                            .child("items").child(index).child("bought").set(value);

                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style = {{height:30, width:"100%"}}>
                                            {this.renderPlaceToGet(userdetails,item.extrainfo,item.name, item.key, item.listKey,item.position)}
                                        </View>

                                        {item.status?

                                            <View >
                                                <Text style={{margin:10, color:"#ff651c"}}>{item.status.shop} - {item.status.status}</Text>
                                            </View>: null}
                                    </View>


                                </View>
                            </View>

                        }
                        ItemSeparatorComponent = {()=>{
                            return(
                                <View style={{height:0.6, width:'100%',backgroundColor:'#ccc'}}/>
                            )
                        }}

                    />


                    <View style={{height:35, width:"100%",
                        padding:4,
                        flexDirection:"row", borderTopWidth:1,alignItems:"center",
                        borderTopColor:"green", justifyContent:"space-between"}}>
                        <Subtitle style={{alignSelf:'center', fontSize:14,color:"#4a4949"}}>{this.props.date}</Subtitle>
                        <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                            <Text>Shops within </Text>
                            <Picker selectedValue={this.state.distance}
                                    style={{ height: 30, width: 70, borderWidth:1,
                                        borderRadius:2, borderColor:"#cbcbcb" }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({distance: itemValue});
                                        this.renderData();
                                        this.renderShopItem();
                                    }
                                    }>
                                <Picker.Item label="100m" value={0.1} />
                                <Picker.Item label="1km"  value={1} />
                                <Picker.Item label="5km"  value={5} />
                                <Picker.Item label="10km" value={10} />
                                <Picker.Item label="20km" value={20} />
                                <Picker.Item label="50km" value={500} />
                            </Picker>
                        </View>
                    </View>

                </View>
                <View>

                </View>
            </View>
        )
    }
}

function doneShopping(key, listkey) {
    Alert.alert(
        'Done',
        'Done shopping with this list? move to expired list or delete list.',
        [
            {
                text:'Expired list',
                onPress:()=>{
                    firebaseApp.database().ref().child("list").child(key).child("currentlist").child(listkey).once('value', snap=>{

                        let expiredItemkey = firebaseApp.database().ref().child("list").child(key).child("expiredlist").push().key;
                        let item = {
                            key:expiredItemkey,
                            name:snap.val().name,
                            date:snap.val().date
                        };
                        firebaseApp.database().ref().child("list").child(key).child("expiredlist").child(expiredItemkey).set(item);
                        firebaseApp.database().ref().child("list").child(key).child("currentlist").child(listkey).remove()
                    })
                }
            }
        ]


    )
}


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1) ; // deg2rad below
    let dLon = deg2rad(lon2-lon1);
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d;
}

function deg2rad(value) {
    return value * Math.PI/180
}
const css =StyleSheet.create({

});

function mapStateToProps(state) {
    return {
        pin: state.pinReducer,
        list: state.listReducer
    }
}

function mapDispatchToProps(dispatch) {
   return{
       updateList : (list)=>{
           dispatch(updateUserList(list))
       }
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(ListDetails)