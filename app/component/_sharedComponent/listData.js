/**
 * Created by archibold on 28/06/2018.
 */
import React, {Component} from 'react';
import { View, Text, FlatList } from 'react-native'

let mockData = [{name:'Archibold'}, {name:'Bernard'}, {name:'Maame AD'}];


const ListData = (props) => {

  return (
      <FlatList
            data = {mockData}
            renderItem= {(item, index)=>{
                return(
                <View style={{width:'100%', margin:10}} key = {index}>
                    <Text>{item.name}</Text>
                </View>)
            }}
      />
  )
};

export  default ListData;