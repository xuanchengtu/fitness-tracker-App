import React, { useEffect } from 'react';
import { Avatar,  Card, Title, Paragraph } from 'react-native-paper'
import {useState} from 'react'
import { StyleSheet, Button,Text, View, TextInput, Modal, ScrollView} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker"

class ExerciseCard extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            modalVisible: false,
            isDatePickerVisible: false,
            name: this.props.name,
            duration: this.props.duration,
            calories: this.props.calories,
            date: this.props.date
        }

        this.stateTemp = this.state
    }

    dateConverter(date){
        return (date.getMonth() + 1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString() + 
        "  " + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString()
    }

    render(){
    return(
    <View>
        <Card style={{margin: 10, borderColor: "orange", borderWidth: 1}}>
            <Text style={{fontWeight: "bold"}}>Exercise Name: {this.props.name}</Text>
            <Text>Date: {this.props.date.toString()}{"\n"}Calories Burnt: {this.props.calories} cal{"\n"}Duration: {this.props.duration} Minutes</Text>
            <View style={styles.dualButton}>
            <Button title="Edit" onPress={() => {
                this.stateTemp = this.state
                this.setState({modalVisible: true})
            }}></Button>
            <Button title="Delete" onPress={() => {
                fetch('http://cs571.cs.wisc.edu:5000/activities/' + this.props.id, {
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
            <Text style={{fontWeight:"bold"}}>Edit Exercise</Text>
            <Text>Exercise Name</Text>
            <TextInput defaultValue={this.state.name} onChangeText={(text) => this.setState({name: text})}/>
            <Text>Duration (minutes)</Text>
            <TextInput defaultValue={this.state.duration} onChangeText={(text) => this.setState({duration: text})}/>
            <Text>Calories Burnt</Text>
            <TextInput defaultValue={this.state.calories} onChangeText={(text) => this.setState({calories: text})}/>
            <Text>Exercise Date and Time</Text>
            <Text>{this.state.date.toString()}</Text>
            <Button title="Set Date and Time" onPress={() => this.setState({isDatePickerVisible: true})}/> 
            <View style={styles.dualButton}>
            <Button title="Save" onPress={() => {
                console.log(JSON.stringify({
                    "name": this.state.name,
                    "duration": this.state.duration,
                    "calories": this.state.calories,
                    "date": JSON.stringify(this.state.date)
                  }))
                  let missingField = []
                  for(let i of ["duration", 'calories']){
                      if(isNaN(this.state[i]) || this.state[i].trim() === ""){
                        missingField.push(i)
                    }
                  }
                  if(missingField.length !== 0){
                    alert("Field(s) " + missingField.join(", ") + " should only contain numerical values!")
                    return
                  }
                this.setState({modalVisible: false})
                fetch('http://cs571.cs.wisc.edu:5000/activities/' + this.props.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': this.props.token
          },
          body: JSON.stringify({
            "name": this.state.name,
            "duration": this.state.duration,
            "calories": this.state.calories,
            "date": this.state.date
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
      <DateTimePickerModal
        isVisible={this.state.isDatePickerVisible}
        mode="datetime"
        onConfirm={(selectedDate) => {
            console.log(selectedDate)
            this.setState({isDatePickerVisible: false, date: selectedDate})
        }}
        onCancel={() => this.setState({isDatePickerVisible: false})} />

    </View>)
}
}

// function ExerciseCard(props){

//     return(
//     <View>
//         <Card>
//             <Text>{props.name}</Text>
//             <Text>Date: {props.date}{"\n"}Calories Burnt: {props.calories}{"\n"}Duration: {props.duration} Minutes</Text>
//             <Button title="Edit"></Button>
//             <Button title="Delete"></Button>
//         </Card>
//     </View>)
// }

class AddExercisePopUp extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            name: "",
            calories: "0",
            duration: "0",
            date: new Date(),
            isDatePickerVisible: false
        }
    }

    render(){
    return(
        <View>
            <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
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
            <Text style={{fontWeight:"bold"}}>Add Exercise</Text>
            <Text>Exercise Name</Text>
            <TextInput defaultValue={this.state.name} onChangeText={(text) => this.setState({name: text})}/>
            <Text>Duration (minutes)</Text>
            <TextInput defaultValue={this.state.duration} onChangeText={(text) => this.setState({duration: text})}/>
            <Text>Calories Burnt</Text>
            <TextInput defaultValue={this.state.calories} onChangeText={(text) => this.setState({calories: text})}/>
            <Text>Exercise Date and Time</Text>
            <Text>{this.state.date.toString()}</Text>
            <Button title="Set Date and Time" onPress={() => this.setState({isDatePickerVisible: true})}/> 
            <View style={styles.dualButton}>
            <Button title="Save" onPress={() => {
                console.log(JSON.stringify({
                    "name": this.state.name,
                    "duration": this.state.duration,
                    "calories": this.state.calories,
                    "date": JSON.stringify(this.state.date)
                  }))
                  let missingField = []
                  for(let i of ["duration", 'calories']){
                      if(isNaN(this.state[i]) || this.state[i].trim() === ""){
                        missingField.push(i)
                    }
                  }
                  if(missingField.length !== 0){
                    alert("Field(s) " + missingField.join(", ") + " should only contain numerical values!")
                    return
                  }
                fetch('http://cs571.cs.wisc.edu:5000/activities/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': this.props.token
          },
          body: JSON.stringify({
            "name": this.state.name,
            "duration": this.state.duration,
            "calories": this.state.calories,
            "date": this.state.date
          })
        }).then(res => res.json())
        .then(res => {
                          alert(res.message)
          this.props.forceUpdate()
          this.props.setInvisible()
        })
            }} />
            <Button title="Nevermind!" onPress={() => this.props.setInvisible()}/>
            </View>
           </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={this.state.isDatePickerVisible}
        mode="datetime"
        onConfirm={(selectedDate) => {
            console.log(selectedDate)
            this.setState({isDatePickerVisible: false, date: selectedDate})
        }}
        onCancel={() => this.setState({isDatePickerVisible: false})} />
        </View>
    )
}}

export default function CreateExerciseView(props){

    const [exerciseData, setExerciseData] = useState([])
    const [update, forceUpdate] = useState(Math.random())
    const [addPopUpVisible, setAddPopUpVisible] = useState(false)

    useEffect(() => {
        fetch('http://cs571.cs.wisc.edu:5000/activities/', {
      method: 'GET',
      headers: {
      'x-access-token': props.token
      }
    }).then(res => res.json())
      .then(res => {
      if(! ("message" in Object.keys(res))){
        setExerciseData(res["activities"])
      }
      else{
          alert(res["message"])
      }
    }
      )
    }, [update])

    var getExercises = () => {
        let exercises = []
        console.log(exerciseData)
        for(let i of exerciseData){
            let exerciseDate = new Date(JSON.parse('"' + i["date"] + '"'))
            console.log(exerciseDate)
            exercises.push(
            <View key={Math.random()}>
                <ExerciseCard forceUpdate={() => {
                    props.forceUpdate()
                    forceUpdate(Math.random())
                }} id={i["id"].toString()} token={props.token} date={exerciseDate} calories={i["calories"].toString()} duration={i["duration"].toString()} name={i["name"].toString()}/>
            </View>)
        }
        console.log(exercises.length)
        console.log(exercises)
        return exercises
    }

    return(
    <ScrollView >
        <Text style={{fontWeight: "bold"}}>Exercises</Text>
        <Text>Let's get to work!{"\n"}Record your exercises below.</Text>
        <View  style={{flexDirection: "row"}}>
        <Button title="Add Exercise" onPress={() => setAddPopUpVisible(true)}/>
        </View>
        {getExercises()}
        <AddExercisePopUp token={props.token} visible={addPopUpVisible} setInvisible={() => setAddPopUpVisible(false)} forceUpdate={() => {
            props.forceUpdate()
            forceUpdate(Math.random())}
        }/>
    </ScrollView>)
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