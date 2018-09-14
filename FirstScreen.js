import React from 'react';
import { StatusBar, Dimensions, AsyncStorage, Button, Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Topics from './Topics';
import uuidv1 from "uuid/v1";
import {Header, Left, Right, Icon} from 'native-base';
import {LinearGradient} from 'expo';
import {Ionicons} from "@expo/vector-icons";
const {width} = Dimensions.get('window');


export default class FirstScreen extends React.Component {
  static navigationOptions = { // DRAWER MENU OPTION
    drawerLabel: "HOME",
    drawerIcon: ({tintColor}) => {
      return (
        <Ionicons 
        color='gray' 
        size={25} 
        name="ios-heart-outline"
        />
      );
    }
  }

  constructor(props){
    super(props);

    // GET Today Date and compare with prev Day status
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

    var theEvent = {}; // CREATE EVENT DATA FOR 'TODAY'
    this.retrieveItem = this.retrieveItem.bind(this);
    this.retrieveItem('gpr').then((goals) => { // GET LOCAL STORAGE DATA
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
            {id:0, book: "matthew", chapters: 50 },
            {id:1, book: "mark", chapters: 50 },
            {id:2, book: "luke", chapters: 50 },
            {id:3, book: "john", chapters: 50 },
            {id:4, book: "acts", chapters: 50 }
          ],
          bibleCheck:[],
          readingGoal:5,
          bibleMessage:"Time to read Bible"        
        }      
      }


    var todayData = theEvent.todayEvent; // get todays info from localstorage    
    var theTimeGoal = theEvent.theTimeGoal;
    var todayEvent = {}; // create today event in this variable
    if(todayData.length > 0){
      var obj = todayData.find(function (obj) { return obj.todayId == todayId; });      
      if(obj){
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


    this.state = theEvent;

    this._controllNewToDo = this._controllNewToDo.bind(this);
    this._addToDo = this._addToDo.bind(this);
    this._deleteToDo = this._deleteToDo.bind(this);
    this._updateToDo = this._updateToDo.bind(this);
    this._startPrayer = this._startPrayer.bind(this);
    this._handleStart = this._handleStart.bind(this);
    this._handleStop = this._handleStop.bind(this);
    this.showTime = this.showTime.bind(this);

    AsyncStorage.setItem('gpr', JSON.stringify(this.state));

  }// Constrocutor close

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

    var i = this.state.todayEvent.length - 1;

    if(this.state.isPlaying){
      setTimeout(this._startPrayer, 1000);
      if(this.state.todayEvent[i].praying == this.state.theTimeGoal){
        this.setState({
          prayerMessage: "You reached your prayer goal today!",
          isPlaying: false
        });
        alert("Prayer Goal Reached");
      }   
    }
  }



  // PRAYER TOPIC CRUD
  _controllNewToDo = text =>{
    this.setState({ newToDo: text });
  }  

  _addToDo = () => {
    const {newToDo} =this.state;
    if(newToDo !== ""){

      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            name: newToDo,
            createdAt: Date.now()
          }
        };

        const newState = {
          ...prevState,
          newToDo: "",
          toDos:{
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        return { ...newState };
      });
    }
  }


  _deleteToDo = (id) =>{
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState ={
        ...prevState,
        ...toDos
      };
      return {...newState};
    })
  }



  _updateToDo = (id, name) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: { ...prevState.toDos[id], name: name }
        }
      };
      return {...newState};
    });
  }
  // PRAYER TOPIC CRUD DONE


  //TIMER PART
  _handleStart = () => {    
    this.setState(prevState => {
      const newState = {
        ...prevState,
        isPlaying: true
      };
      return { ...newState };
    });
  }

  _startPrayer = () => {
    var i = this.state.todayEvent.length - 1;
    var now = this.state.todayEvent[i].praying + 1;
    var newEvent = this.state.todayEvent;
    newEvent[i].praying = now;
    console.log(newEvent);

    if(this.state.isPlaying){
      this.setState({
        todayEvent: newEvent
      });

    }
  }

  _handleStop = () => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        isPlaying: false
      };
      return { ...newState };
    });    
  }

  showTime(time){

    var min = Math.floor(time / 60);
    var sec = time - (min * 60);    
    
    var showmin = "";
    var showsec = "";
    if(min < 10){
      showmin = "0" + min;
    }else{
      showmin = min;
    }
    if(sec < 10){
      showsec = "0" + sec;
    }else{
      showsec = sec;
    }
    var totalTime = showmin + ":" + showsec;
    return totalTime;
  }


  // TIMER PART DONE
  nextButton(){
    this.props.navigator.push({
      id:'Second'
    });
  }



  render() {
    const { newToDo, toDos, isPlaying, todayEvent, prayerMessage, readingGoal } = this.state;    
    var i = todayEvent.length - 1;

    const startPrayer = <View style={styles.bottomTab}><Ionicons color='white' size={25} name="ios-play-outline" alignItems="center" /><TouchableOpacity onPress={this._handleStart}><Text style={styles.bottomText}>TAB TO START PRAYER</Text></TouchableOpacity></View>;
    const stopPrayer = <View style={styles.bottomTab}><Ionicons color='white' size={25} name="ios-pause-outline" alignItems="center" /><TouchableOpacity onPress={this._handleStop}><Text style={styles.bottomText}>TAB TO STOP PRAYER</Text></TouchableOpacity></View>;

    return (
      <LinearGradient
        colors={["#f6d365","#fda085"]}
        style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.contheader}>

          <Text style={styles.headerText}>GENTLE PRAYER</Text>
          <Text style={styles.goal}>{this.showTime(this.state.todayEvent[i].praying)}</Text>
          <Text style={styles.headerText}>
            TODAY GOAL {this.state.theTimeGoal}
          </Text>        
          <Text style={styles.headerText}>
            {readingGoal - todayEvent[i].reading} CHAPTERS LEFT TODAY
          </Text>        

        </View>

        <View style={styles.card}>
          <TouchableOpacity>
            <TextInput               
              value={newToDo}
              onChangeText={this._controllNewToDo}
              blurOnSubmit={true}
              multiline={true}                
              returnKeyType={"done"}
              onSubmitEditing={this._addToDo}
              placeholder={"TAB TO ADD NEW PRAYER TOPIC"}
              style={styles.addStyle}
              underlineColorAndroid={"transparent"}   
            />
          </TouchableOpacity>        
          <ScrollView style={styles.wwrap}>
            {Object.values(toDos).map(toDo => <Topics key={toDo.id} {...toDo} deleteToDo={this._deleteToDo} updateToDo={this._updateToDo} />)}
          </ScrollView>

        </View>
          
          { isPlaying ? stopPrayer : startPrayer }

      </LinearGradient>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flex:2,
    //backgroundColor:"#C5D4E3",
    alignItems: "center"
  },
  contheader:{
    flex:1,
    alignItems: "center",
    paddingBottom:20,
    paddingTop:45
  },
  goal:{
    color:"#fff",
    fontSize:40,
    fontWeight:"100",
    textAlign:'center',
    marginTop:-10
  },
  goaldesc:{
    fontSize:10,
    textAlign:'center',
  },

  headerText:{
    color:"#fff",
    fontWeight:"100",
    margin:0,
    padding:0,
    fontSize:11,
    marginTop: -3
  },
  addStyle:{
    paddingLeft:10,
    paddingBottom:20,    
  },

  topics:{
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    borderBottomColor:"#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center"
  },
  topictext:{
    fontWeight:"200",
    fontSize:13
  },

  card:{
    backgroundColor:'white',
    paddingTop:25,
    paddingBottom:25,
    flex:2,

    width: width,
    elevation: 5
  },
  wwrap:{
  },
  bottomTab:{
    flex:1,
    justifyContent:'center',
    elevation:3,
    alignItems:'center'
  },
  bottomText:{
    fontWeight:"100",
    fontSize:10,
    color:'white',
    marginTop:3
  },

});

