import React, { useEffect } from 'react';
import { Avatar,  Card, Title, Paragraph } from 'react-native-paper'
import {useState} from 'react'
import { StyleSheet, Button,Text, View, TextInput, Modal, ScrollView} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker"

export default class FoodCard extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            modalVisible: false,
            name: this.props.name,
            calories: this.props.calories,
            carbohydrates: this.props.carbohydrates,
            fat: this.props.fat,
            protein: this.props.protein
        }

        this.stateTemp = this.state
    }

    render(){
    return(
    <View style={{}}>
        <Card style={{margin: 10, borderColor: "orange", borderWidth: 1}}>
            <Text style={{fontWeight: "bold"}}>Food Name: {this.props.name}</Text>
            <Text>Calories: {this.props.calories}{"\n"}Carbohydrates: {this.props.carbohydrates}{"\n"}
            Fat: {this.props.fat}{"\n"}Protein: {this.props.protein}</Text>
            <View style={styles.dualButton}>
            <Button title="Edit this food" onPress={() => {
                this.stateTemp = this.state
                this.setState({modalVisible: true})
            }}></Button>
            <Button title="Delete" onPress={() => {
                fetch('http://cs571.cs.wisc.edu:5000/meals/' + this.props.mealId.toString() + "/foods/" + this.props.foodId.toString(), {
                    method: 'DELETE',
                    headers: {
                      'x-access-token': this.props.token
                    }
                  }).then(res => res.json())
                  .then(res => {
                                    alert(res.message)
                    this.props.forceUpdate()
                  })
            }}></Button>
            </View>
        </Card>
        <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        backdropOpacity={0.3}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        //   setModalVisible(!modalVisible);
        // }}
      >
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <View style={{backgroundColor: "white", margin: 25, borderRadius: 20,shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4, borderColor: "red", borderWidth: 3, margin: 3}}>
            <Text style={{fontWeight: "bold"}}>Edit Food</Text>
            <Text>Food Name</Text>
            <TextInput defaultValue={this.state.name.toString()} onChangeText={(text) => this.setState({name: text})}/>
            <Text>Calories</Text>
            <TextInput defaultValue={this.state.calories.toString()} onChangeText={(text) => this.setState({calories: text})}/>
            <Text>Carbohydrates</Text>
            <TextInput defaultValue={this.state.carbohydrates.toString()} onChangeText={(text) => this.setState({carbohydrates: text})}/>
            <Text>Protein</Text>
            <TextInput defaultValue={this.state.protein.toString()} onChangeText={(text) => this.setState({protein: text})}/>
            <Text>Fat</Text>
            <TextInput defaultValue={this.state.fat.toString()} onChangeText={(text) => this.setState({fat: text})}/>
            <View style={styles.dualButton}>
            <Button title="Save" onPress={() => {
              let missingField = []
              for(let i of ['calories', 'carbohydrates', 'protein', 'fat']){
                  if(isNaN(this.state[i]) || this.state[i].trim() === ""){
                    missingField.push(i)
                }
              }
              if(missingField.length !== 0){
                alert("Field(s) " + missingField.join(", ") + " should only contain numerical values!")
                return
              }
                this.setState({modalVisible: false})
                fetch('http://cs571.cs.wisc.edu:5000/meals/' + this.props.mealId.toString() + "/foods/" + this.props.foodId.toString(), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': this.props.token
          },
          body: JSON.stringify({
            "name": this.state.name,
            "calories": this.state.calories,
            "carbohydrates": this.state.carbohydrates,
            "protein": this.state.protein,
            "fat": this.state.fat
          })
        }).then(res => res.json())
        .then(res => {
                          alert(res.message)
          this.props.forceUpdate()
        })
            }} />
            <Button title="Nevermind!" onPress={() => this.setState(this.stateTemp)}/>
            </View>
           </View>
        </View>
      </Modal>
    </View>)
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputText: {width: 100, borderWidth: 1, margin: 4, paddingLeft: 3},
    dualButton: {flexDirection: "row", justifyContent: "center", margin: 4}
  });