/**
 * Created by archibold on 14/07/2018.
 */
import React , {Component} from 'react'
import {StatusBar,View, Text, TouchableOpacity, StyleSheet, ScrollView, BackHandler,Dimensions, Switch} from 'react-native'
import NavBar from '../_sharedComponent/navBar'
import {connect} from 'react-redux'
import DashBoardButton from '../_sharedComponent/dashbbutton'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'

class DashBoard extends Component {
    constructor(props){
        super(props);
        this.state = {
            listname:'',
            view:'large'
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
                            goto={()=>Actions.listheader({page:"Past list",loadlist:'pastlist'})}
                        />
                        <DashBoardButton
                            btntext="Expired list"
                            iconname ="ios-folder-open-outline"
                            goto={()=>Actions.listheader({page:"Expired list",loadlist:'expiredlist'})}
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
                            btntext="Shoppers Cloud"
                            iconname ="ios-cloud-outline"
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
                        goto={()=>Actions.listheader({page:"Past list",loadlist:'pastlist'})}
                    />
                    <DashBoardButton
                        btntext="Expired list"
                        iconname ="ios-folder-open-outline"
                        goto={()=>Actions.listheader({page:"Expired list",loadlist:'expiredlist'})}
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
                        btntext="Shoppers Cloud"
                        iconname ="ios-cloud-outline"
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
                            <Icon name="ios-cart-outline" size={24}/>
                            <Text style = {{color:"#ff4b13", fontSize:18,margin:4, fontWeight:"bold"}}>Shoppers Cloud</Text>
                        </View>
                        <TouchableOpacity
                            onPress={()=>{
                                Actions.account()
                            }}
                           >
                            <Icon name="ios-person-outline" size={28}/>

                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{width:"100%",
                    justifyContent:"center", alignItems:"center",
                    height:35, backgroundColor:"#eee",
                    borderBottomWidth:0.6, borderBottomColor:"#cbcbcb"
                }}>
                    <Text>hello {userdetails.name}</Text>
                </View>
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
}
const css = StyleSheet.create({
    rowoption:{
        flexDirection:'row'
    },
    navbar:{
        height:45,
        width:"100%",
        justifyContent:"space-between",
        flexDirection:"row",
        alignItems:"center",
        padding:4
    }
});

function mapStateToProps(state) {
    return{
        pin:state.pinReducer
    }
}
export default connect (mapStateToProps, null)(DashBoard)

