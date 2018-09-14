import React from 'react';
import { StatusBar,Dimensions, AsyncStorage, Button, Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import uuidv1 from "uuid/v1";
import {LinearGradient} from 'expo';
import {Ionicons} from "@expo/vector-icons";
const {width} = Dimensions.get('window');


export default class ThirdScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: "SETTINGS",
    drawerIcon: ({tintColor}) => {
      return (
        <Ionicons 
        color='gray' 
        size={25} 
        name="ios-settings-outline"
        />
      );
    }
  }

  constructor(props){
    super(props);
    var d = new Date();
    var yr = d.getFullYear();
    var mth = d.getMonth() + 1;
    var tday = d.getDate();
    if(yr < 10){
      yr = "0" + yr;
    }else{
      yr = yr;
    }
    if(mth < 10){
      mth = "0" + mth;
    }else{
      mth = mth;
    }
    if(tday < 10){
      tday = "0" + tday;
    }else{
      tday = tday;
    }
    var todayId = yr + mth + tday;

    this.retrieveItem = this.retrieveItem.bind(this);


    var theEvent = {};
      this.retrieveItem('gpr').then((goals) => {
        this.setState(goals);
      }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
      }); 

    theEvent = this.state;
     if(theEvent == null || {} ){
        theEvent = {
          biblePicked:0,
          newToDo: "",
          toDos: {},
          todayEvent: [],
          isPlaying:false,
          prayerMessage: "Time to Pray!",
          theTimeGoal: 60,
          bible:[
            {id:0, book: "matthew", chapters: 28 },
            {id:1, book: "mark", chapters: 14 },
            {id:2, book: "luke", chapters: 29 },
            {id:3, book: "john", chapters: 39 },
            {id:4, book: "acts", chapters: 16 }
          ],
          bibleCheck:[],
          readingGoal:5,
          bibleMessage:"Time to read Bible"        
        }      
      }




    var todayData = theEvent.todayEvent; // get todays info from localstorage    
    var theTimeGoal = theEvent.theTimeGoal;
    var todayEvent = {}; // create today event in this variable
    var readingGoal = theEvent.readingGoal;
    if(todayData.length > 0){
      var obj = todayData.find(function (obj) { return obj.todayId == todayId; });      
      if(obj){
        //console.log('today data exit');
      }else{
        todayEvent = {todayId: todayId, reading:0, praying:0};
        theEvent.todayEvent.push(todayEvent);
      }
    }else{
      todayEvent = {todayId: todayId, reading:0, praying:0};
      theEvent.todayEvent.push(todayEvent);
    }    


    /// Work on Prayer Message
    var pMessage = "";
    var i = todayData.length - 1;
    if(todayData[i].praying < theTimeGoal){
      theEvent.prayerMessage = "Lets pray Today!";
    }else{
      theEvent.prayerMessage = "You reached your prayer goal today!";
    }

    /// Work on Bible Message
    var bMessage = "";
    var j = todayData.length - 1;
    if(todayData[j].reading < readingGoal){
      theEvent.bibleMessage = "Time to read bible!";
    }else{
      theEvent.bibleMessage = "Awesome! Good job to finish the reading today";
    }


    this.state = theEvent;
    console.log(this.state);

    this._controllTime = this._controllTime.bind(this);
    this._controllReading = this._controllReading.bind(this);

    AsyncStorage.setItem('gpr', JSON.stringify(this.state));


  }

  async retrieveItem(key) {
    try {
      const retrievedItem =  await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return
  }

  componentDidUpdate(){
    AsyncStorage.setItem('gpr', JSON.stringify(this.state));
  }

  // PRAYER TOPIC CRUDE
  _controllTime = text =>{
    //var min = text * 60;
    text = parseInt(text);
    text = text * 60;
    this.setState({ theTimeGoal: text });
  }  

  _controllReading = text =>{
    //var min = text * 60;
    text = parseInt(text);
    this.setState({ readingGoal: text });
  }  

  render() {
    const { theTimeGoal, readingGoal } = this.state;
// Goal Time
// Bible Reading Chapters
    return (
      <LinearGradient
        colors={["#f6d365","#fda085"]}
        style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.header}>
          <Text style={{color:'white'}}>SETTING</Text>
        </View>
        <View style={styles.theBox}>
          <Text style={styles.first}>How many minutes will you pray?</Text>
          <TouchableOpacity>
            <TextInput                
              value={theTimeGoal.toString()}
              onChangeText={this._controllTime}
              blurOnSubmit={true}
              keyboardType = 'numeric'
              returnKeyType={"done"}
              style={styles.timeInput}
              underlineColorAndroid={"transparent"}   
            />
          </TouchableOpacity>        

          <Text style={styles.second}>How many chapters will you read?</Text>
          <TouchableOpacity>
            <TextInput                
              value={readingGoal.toString()}
              onChangeText={this._controllReading}
              blurOnSubmit={true}
              keyboardType = 'numeric'
              returnKeyType={"done"}
              style={styles.timeInput}
              underlineColorAndroid={"transparent"}    
            />
          </TouchableOpacity>  

        </View>
      </LinearGradient>      
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:20,
    paddingBottom:40
  },
  header:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
  },
  theBox:{
    flex:4,   
    alignItems:'center',

  },
  timeInput:{
    fontSize:30,
    paddingTop:5,
    paddingBottom:5,
    alignItems:'center',
    width:'50%',
    color:'white',
  },
  first:{
    color:'white'
  },
  second:{
    marginTop:80,
    color:'white'
  }


});
