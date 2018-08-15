/**
 * Created by archibold on 12/08/2018.
 */
import React , {Component} from 'react'
import {View, ActivityIndicator, Modal} from 'react-native'

export default class Loader extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.props.show}
                onRequestClose={()=>{console.log("List name closed")}}
            >

                <View style={{justifyContent:'center', alignItems:'center', height:'100%', width:'100%'}}>
                    <Spinner style={} isVisible={true} size={60} type='ChasingDots' color="green"/>

                </View>
            </Modal>
        )
    }
}