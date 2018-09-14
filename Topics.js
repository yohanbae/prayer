import React from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import {Ionicons} from "@expo/vector-icons";

const {width} = Dimensions.get('window');


export default class Topics extends React.Component {

  constructor(props){
    super(props);
    this.state={
      isEditing:false,
      toDoValue: props.name
    };    
  }

  _startEditing = () => {
    this.setState({
      isEditing:true,
    });
  }

  _finishEditing=() => {
    const {toDoValue} = this.state;
    const {id, updateToDo} = this.props;
    updateToDo(id, toDoValue);
    this.setState({
      isEditing:false
    });
  }

  _controllInput = text =>{
    this.setState({ toDoValue: text });
  }


  render() {
    const {isEditing, toDoValue } = this.state;
    const { name, id, deleteToDo} = this.props;
    return (

        <View style={styles.topics}>

          <TouchableOpacity>
            {isEditing ? 
            (
              <TextInput               
                value={toDoValue}
                onChangeText={this._controllInput}
                blurOnSubmit={true}
                multiline={true}                
                returnKeyType={"done"}
                onBlur={this._finishEditing}
                style={styles.editStyle}
                underlineColorAndroid={"transparent"}    
              />                          
            ) : ( 
              <Text style={styles.theTopic}>{ name }</Text>
            )}
          </TouchableOpacity>

            {isEditing ? (
              <View style={styles.actions}>
                <TouchableOpacity onPressOut={this._finishEditing}>
                  <View style={styles.actionContainer}>
                    <Ionicons color='gray' size={20} name="ios-checkmark-circle-outline" textAlign="center" />
                  </View>
                </TouchableOpacity>
              </View>
              ) : (
              <View style={styles.actions}>
                <TouchableOpacity onPressOut={this._startEditing}>
                  <View style={styles.actionContainer}>
                    <Ionicons color='gray' size={20} name="ios-create-outline" textAlign="center" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPressOut={() => deleteToDo(id) }>
                  <View style={styles.actionContainer}>
                    <Ionicons color='gray' size={20} name="ios-trash-outline" textAlign="center" />
                  </View>
                </TouchableOpacity>                
              </View>

              )}
        </View>
    );
  }
}


const styles = StyleSheet.create({
  topics:{
    paddingTop:10,
    paddingBottom:10,
    borderBottomColor:"#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    flex:1
  },
  theTopic:{
    fontSize:10,
    fontWeight:"200",
    paddingLeft:10,
    paddingRight:10,
    width: width / 10 * 7
  },
  column:{
    flexDirection:"row",
    alignItems:"center",
    width: "50%"
  },
  editStyle:{
    width: width / 10 * 7,
    paddingLeft:10,
    paddingRight:10,
    fontSize:10,
    fontWeight:"200",
    borderWidth:0
  },
  actions:{
    flexDirection:"row",
  },
  actionText:{
    fontSize:10,
    fontWeight:"200",    
  }, 
  actionContainer:{
     marginHorizontal:10
  },
  input:{
    backgroundColor:"yellow",
    width:"100%",

  }


});
