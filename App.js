import React from 'react';
import { SafeAreaView, Dimensions, Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';

import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import {LinearGradient} from 'expo';

import FirstScreen from './FirstScreen';
import SecondScreen from './SecondScreen';
import ThirdScreen from './ThirdScreen';

const {width} = Dimensions.get('window');

export default class App extends React.Component {
  render(){
    return (
      <AppDrawerNavigator />
    );
  }
}

const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{flex:1}}>
    <LinearGradient
      colors={["#f6d365","#fda085"]}
      style={styles.containers}>  
      <Text style={styles.prayer}>GP</Text>
    </LinearGradient>
    <ScrollView>
      <DrawerItems {...props} />
    </ScrollView>
  </SafeAreaView>
)

const AppDrawerNavigator = createDrawerNavigator({

  Main: FirstScreen,
  Reading: SecondScreen,
  Setting: ThirdScreen,
  
}, {
  contentComponent: CustomDrawerComponent,
  drawerWidth: width / 2,
  contentOptions:{
    activeTintColor:'red'
  }
})

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containers:{
    height:150,
    alignItems:"center",
    justifyContent:"center"
  },
  prayer:{
    fontSize:40,
    fontWeight:'100',
    color:'white'
  }
});