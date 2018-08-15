/**
 * Created by archibold on 14/07/2018.
 */
import React , {Component} from 'react'
import {StatusBar,View, Text,TextInput, TouchableOpacity,StyleSheet, FlatList, ScrollView, BackHandler,Dimensions, Modal} from 'react-native'
import NavBar from '../_sharedComponent/navBar'
import {connect} from 'react-redux'
import DashBoardButton from '../_sharedComponent/dashbbutton'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import firebaseApp from '../_sharedComponent/firebase_connector'
import Spinner from 'react-native-spinkit'
import {getRandomColor,getFirstLetter} from '../_sharedComponent/generatePDF'
const compareTo = require('string-similarity');

class DashBoard extends Component {
    constructor(props){
        super(props);
        this.state = {
            listname:'',
            view:'large',
            showmodal:false,
            searchItem:'',
            showloading:false,
            data:[]
        }

    }
    componentWillMount() {

        BackHandler.addEventListener('hardwareBackPress', ()=> {BackHandler.exitApp()});
        Dimensions.addEventListener("change", ()=>{
            let {height, width} = Dimensions.get('window');
            if(height < width){
                this.setState({
                    view:'small'
                })
            }else{
                this.setState({
                    view:'large'
                })
            }

        });

    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', ()=> {BackHandler.exitApp()});
    }

    renderLong = () =>{
        return(
                <View style = {{height:'100%', width:'100%'}}>
                    <View style={css.rowoption}>
                        <DashBoardButton
                            goto = {()=>Actions.createlistheader()}
                            btntext="Create list"
                            iconname ="ios-add-circle"
                        />
                        <DashBoardButton
                            btntext="Current list"
                            iconname ="ios-list-box-outline"
                            goto={()=>Actions.listheader({page:"Current list", loadlist:'currentlist'})}
                        />
                    </View>

                    <View style={css.rowoption}>
                        <DashBoardButton
                            btntext="Past list"
                            iconname ="ios-clock-outline"
                            goto={()=>Actions.pastlist({page:"Past list"})}
                        />
                        <DashBoardButton
                            btntext="Expired list"
                            iconname ="ios-folder-open-outline"
                            goto={()=>Actions.expiredlist({page:"Expired list"})}
                        />
                    </View>

                    <View style={css.rowoption}>
                        <DashBoardButton
                            btntext="Shopping stats"
                            iconname ="ios-stats-outline"
                            goto={()=>Actions.liststat({page:"Shopping stats"})}
                        />
                        <DashBoardButton
                            btntext="Deleted list"
                            iconname ="ios-trash-outline"
                            goto={()=>Actions.listheader({page:"Deleted list",loadlist:'deletedlist'})}
                        />
                    </View>

                    <View style={css.rowoption}>
                        <DashBoardButton
                            btntext="Shop4Me"
                            iconname ="ios-cart-outline"
                            goto={()=>Actions.shopperscloud()}
                        />
                        <DashBoardButton
                            btntext="List Settings"
                            iconname ="ios-settings-outline"
                            goto={()=>Actions.listsettings({page:"Settings"})}
                        />
                    </View>
                </View>
        )
    };
    renderShort = () => {
        return(
            <View style = {{height:'100%', width:'100%'}}>
                <View style={css.rowoption}>
                    <DashBoardButton
                        goto = {()=>Actions.createlistheader()}
                        btntext="Create list"
                        iconname ="md-add"

                    />
                    <DashBoardButton
                        btntext="Current list"
                        iconname ="ios-list-box-outline"
                        goto={()=>Actions.listheader({page:"Current list", loadlist:'currentlist'})}
                    />
                    <DashBoardButton
                        btntext="Past list"
                        iconname ="ios-clock-outline"
                        goto={()=>Actions.pastlist({page:"Past list"})}
                    />
                    <DashBoardButton
                        btntext="Expired list"
                        iconname ="ios-folder-open-outline"
                        goto={()=>Actions.expiredlist({page:"Expired list"})}
                    />
                </View>



                <View style={css.rowoption}>
                    <DashBoardButton
                        btntext="Shopping stats"
                        iconname ="ios-stats-outline"
                        goto={()=> Actions.liststat({page:"Shopping stats"})}
                    />
                    <DashBoardButton
                        btntext="Deleted list"
                        iconname ="ios-trash-outline"
                        goto={()=>Actions.listheader({page:"Deleted list",loadlist:'deletedlist'})}
                    />
                    <DashBoardButton
                        btntext="Shop4Me"
                        iconname ="ios-cart-outline"
                        goto={()=>Actions.shopperscloud()}

                    />
                    <DashBoardButton
                        btntext="List Settings"
                        iconname ="ios-settings-outline"
                        goto={()=>Actions.listsettings({page:"Settings"})}

                    />
                </View>

            </View>
        )
    };
    render(){
        let {pin, userdetails} = this.props.pin;

        return(
            <View style = {{backgroundColor:'white', flex:1}}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                />
                <View>
                    <View style={css.navbar}>
                        <View style={{flexDirection:"row", height:"100%", justifyContent:"center", alignItems:"center"}}>
                            <Icon name="ios-cloud" size={30} color="#8d2b0b"/>
                            <Text style = {{color:"#8d2b0b", fontSize:18,margin:1, fontWeight:"bold"}}>SHOPPERS</Text>
                            <Text style = {{color:"#ff651c", fontSize:18,margin:1}}>CLOUD</Text>

                        </View>
                        <View style={{flexDirection:"row", width:"18%", justifyContent:"space-between"}}>
                            <TouchableOpacity
                                style={{margin:2}}
                                onPress={()=>{
                                   this.setState({
                                       showmodal:true
                                   })
                                }}
                            >
                                <Icon name="ios-search-outline" size={28}/>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{margin:2}}
                                onPress={()=>{
                                    Actions.account()
                                }}
                               >
                                <Icon name="ios-person-outline" size={28}/>

                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <View style={{width:"100%",
                    justifyContent:"center", alignItems:"center",
                    height:35, backgroundColor:"#fdfdfd",
                    borderBottomWidth:0.6, borderBottomColor:"#cbcbcb"
                }}>
                    <Text>hello {userdetails.name}</Text>
                </View>
                {this.showSearchModal()}
                <ScrollView
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    >
                    {
                        this.state.view === 'large' ? this.renderLong() : this.renderShort()
                    }
                </ScrollView>
            </View>
        )
    }


    showSearchModal = ()=>{
        return(
            <Modal
                visible={this.state.showmodal}
                transparent={true}
                animationType="fade"
                onRequestClose={()=> console.log("search modal closed")}
            >
                <View
                    style={{height:"100%", width:"100%", backgroundColor:"rgba(10,10,10, 0.9)", padding:8}}>
                    <View style={css.modalSearch}>

                        <TextInput
                            value={this.state.searchItem}
                            onChangeText={(value)=>{this.setState({searchItem:value})}}
                            underlineColorAndroid="transparent"
                            placeholder="Item name..."
                            placeholderTextColor="#595959"
                            style={{color:"#595959", flex:1}}
                        />

                        <TouchableOpacity
                            onPress = {()=>{
                                this.findStores();
                            }}
                            style={{width:65,backgroundColor:"white",borderTopRightRadius:4, height:"100%", justifyContent:"center", alignItems:"center"}}
                        >
                            <Text style={{color:"green", fontWeight:"bold"}}>Find</Text>
                        </TouchableOpacity>
                    </View>
                    <Spinner  style={{alignSelf:"center"}} isVisible={this.state.showloading} size={40} type='ChasingDots' color={getRandomColor()}/>
                    <FlatList
                        style={{flex:1}}
                        isRefreshing={this.state.showloading}
                        data = {this.state.data}
                        renderItem = {({item, index})=>{

                            return(
                                <View style={{flexDirection:"row", padding:4, margin:4}}>
                                    <View style={{backgroundColor:getRandomColor(),borderRadius:50, height:50, width:50, justifyContent:"center", alignItems:"center"}}>
                                        <Text style={{color:"white", fontSize:30}}>{getFirstLetter(item.shop.shopname)}</Text>
                                    </View>
                                    <View style={{flex:1, justifyContent:"center", marginLeft:6}}>
                                        <View style={{margin:2,flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                            <Text  style={{color:"white", fontSize:18}}>{item.shop.shopname}</Text>
                                            <Text style={{color:"green", fontSize:14}}>Ghs {item.price}</Text>
                                        </View>
                                        <Text style={{ margin:2, color:"white", fontSize:14}}>Loc:{item.shop.location}</Text>
                                    </View>
                                </View>
                            )
                        }}
                    />
                    <TouchableOpacity
                        onPress={()=>{this.setState({showmodal:false})}}
                        style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}
                    >
                        <Icon name="ios-close" size={32} color="red"/>
                        <Text style={{color:"white", marginLeft:8, fontSize:16}}>Close</Text>
                    </TouchableOpacity>

                </View>

            </Modal>
        )
    };

    findStores = () => {
        this.setState({showloading:true});
        firebaseApp.database().ref().child("shops").once('value',(child)=>{
            let foundItems = [];
            child.forEach(itemShop=> {                  // looping through the shops one by one
                // items in the shop
                const details = itemShop.val().details || [];// this is the shop details

                let  currItem = this.state.searchItem;
                const shopKey = itemShop.key;          // shop key value
                const stock = itemShop.val().stock;
                try {
                    stock.forEach(entity => {                // looping  through 1 shop stock
                        const entItem = entity.item;
                        if ( compareTo.compareTwoStrings(currItem, entItem) > 0.6 ) {      // check if the item is in the stock
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

            });
            setTimeout(()=>{
                this.setState({
                    showloading:false,
                    data:foundItems
                });
            }, 4000)

        });

    }



}
const css = StyleSheet.create({
    rowoption:{
        flexDirection:'row'
    },
    navbar:{
        height:40,
        width:"100%",
        justifyContent:"space-between",
        flexDirection:"row",
        alignItems:"center",
        padding:6
    },
    modalSearch:{
        height:45,
        width:"100%",
        backgroundColor:"white",
        flexDirection:"row",
        borderTopLeftRadius:4,
        borderTopRightRadius:4,
        justifyContent:"center",
        alignItems:"center",
        shadowColor:"#ccc",
        elevation:4
    }
});

function mapStateToProps(state) {
    return{
        pin:state.pinReducer
    }
}
export default connect (mapStateToProps, null)(DashBoard)

