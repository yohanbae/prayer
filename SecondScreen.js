import React from 'react';
import { StatusBar,Dimensions, AsyncStorage, Button, Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Topics from './Topics';
import uuidv1 from "uuid/v1";
import {LinearGradient} from 'expo';
import {Ionicons} from "@expo/vector-icons";
const {width} = Dimensions.get('window');


export default class SecondScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: "READ BIBLE",
    drawerIcon: ({tintColor}) => {
      return (
        <Ionicons 
        color='gray' 
        size={25} 
        name="ios-book-outline"
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

    this.prevBook = this.prevBook.bind(this);
    this.nextBook = this.nextBook.bind(this);
    this.bibleClicked = this.bibleClicked.bind(this);

    AsyncStorage.setItem('gpr', JSON.stringify(this.state));

  } // CONSTRUCTION CLOSE

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

  // HANDLING BIBLE
  prevBook(){
    var num = this.state.biblePicked;
    if(num == 0){
      num = this.state.bible.length - 1;
    }else{
      num -= 1;
    }
    this.setState({
      biblePicked: num
    });
  }

  nextBook(){
    var num = this.state.biblePicked;
    if(num == this.state.bible.length - 1){
      num = 0;
    }else{
      num += 1;
    }
    this.setState({
      biblePicked: num
    });
  }

  bibleClicked(book, chapter) {
    var bibleCheck = this.state.bibleCheck;
    var obj = bibleCheck.find(function (obj) { return obj.book == book && obj.chapter == chapter; });

    var j = this.state.todayEvent.length - 1;
    var bibleMessage = "Please read bible today";

    if(obj){
      //REMOVE READING
      var index = bibleCheck.findIndex(obj => obj.book == book && obj.chapter == chapter);

      //DELETE READING
      var arrays = [...this.state.bibleCheck];
      arrays.splice(index, 1);

      var i = this.state.todayEvent.length - 1;
      var newNum = this.state.todayEvent[i].reading - 1;

      if(newNum < this.state.readingGoal){
          bibleMessage = "Please read bible today";
      }else{
        bibleMessage = "FINISH READING! GOOD JOB";
      }

      var newArray = this.state.todayEvent;
      newArray[i].reading = newNum;


      this.setState({
        bibleCheck: arrays,
        todayEvent: newArray,
        bibleMessage: bibleMessage
      });


    }else{
      //ADD READING
      const check = {book: book, chapter: chapter}

      //reading minus one
      var i = this.state.todayEvent.length - 1;
      var newNum = this.state.todayEvent[i].reading + 1;

      if(newNum >= this.state.readingGoal){
          bibleMessage = "FINISH READING! GOOD JOB";
      }

      var newArray = this.state.todayEvent;
      newArray[i].reading = newNum;

      this.setState({
        bibleCheck: [...this.state.bibleCheck, check],
        todayEvent: newArray,
        bibleMessage:bibleMessage
      });
    }
  }

  createChart = () =>{
    let table = [];
    var book = this.state.biblePicked;
    var bibleCheck = this.state.bibleCheck;
    for(let i = 1; i <= this.state.bible[this.state.biblePicked].chapters; i++){
      var obj = bibleCheck.find(function (obj) { return obj.book == book && obj.chapter == i; });
      if(obj){
        table.push(<TouchableOpacity style={[styles.biblepiece, styles.read]} key={i} onPress={() => this.bibleClicked(book, i) }><Text style={styles.biblechartTextRead}>{i}</Text></TouchableOpacity>);     
      }else{
        table.push(<TouchableOpacity style={styles.biblepiece}  key={i} onPress={() => this.bibleClicked(book, i) }><Text style={styles.biblechartText}>{i}</Text></TouchableOpacity>);        
      }

    }
    return table;
  }


  render() {
    var i = this.state.todayEvent.length - 1;
    var chapter = this.state.bible[this.state.biblePicked].chapters;

    return (
      <LinearGradient
        colors={["#f6d365","#fda085"]}
        style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.contheader}>
          <Text style={styles.headerText}>GENTLE PRAYER</Text>

          <View style={styles.thebar}>
            <TouchableOpacity onPress={this.prevBook} style={styles.themarginLeft}>
              <Ionicons 
              color='white' 
              size={25} 
              name="ios-arrow-dropleft"
              />
            </TouchableOpacity>         
            <Text style={styles.goal}>{this.state.bible[this.state.biblePicked].book}</Text>          
            <TouchableOpacity onPress={this.nextBook} style={styles.themarginRight}>
              <Ionicons 
              color='white' 
              size={25} 
              name="ios-arrow-dropright"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>{this.state.readingGoal - this.state.todayEvent[i].reading} CHAPTERS READING LEFT TODAY</Text>

        </View>

        <View style={styles.bibleWrap}>
          <ScrollView>
            <View style={styles.biblechart}>
            {this.createChart()}
            </View>
          </ScrollView>
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
  contheader:{
    flex:1,
    alignItems: "center",
    paddingTop:45
  },
  goal:{
    color:"#fff",
    fontSize:40,
    fontWeight:"100",
    textAlign:'center',
    marginTop:-25
  },
  headerText:{
    color:"#fff",
    fontWeight:"100",
    margin:0,
    padding:0,
    fontSize:11,
    marginTop: -3
  },
  bibleWrap:{
    flex:3,
    alignItems:"center"
  },
  biblechart:{
    width: width - 50,
    justifyContent: 'flex-start',
    flexDirection:'row',
    flexWrap:'wrap',
  },
  biblechartText:{
    color:'white'
  },
  biblechartTextRead:{
    color:'gray'
  },  
  biblepiece:{
    width: '20%',
    height:40,
    borderWidth:0.5,
    borderColor:"white",
    justifyContent: 'center',
    alignItems: 'center'
  },
  read:{
    backgroundColor:'white',
  },
  thebar:{
    justifyContent: 'flex-start',
    flexWrap:'wrap',
    flexDirection:'row',
    marginTop:15
  },
  themarginLeft:{
    marginTop:-5,
    marginRight:30
  },
  themarginRight:{
    marginTop:-5,
    marginLeft:30
  }  
});
