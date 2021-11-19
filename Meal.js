import React, { useEffect } from 'react';
import { Avatar,  Card, Title, Paragraph } from 'react-native-paper'
import {useState} from 'react'
import { StyleSheet, Button,Text, View, TextInput, Modal, ScrollView} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import FoodCard from './Food'

class AddFoodPopUp extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            name: "",
            calories: "0",
            carbohydrates: "0",
            protein: "0",
            fat: "0"
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
    shadowRadius: 4 , borderColor: "red", borderWidth: 3, margin: 3}}>
            <Text style={{fontWeight:"bold"}}>New Food</Text>
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
                fetch('http://cs571.cs.wisc.edu:5000/meals/' + this.props.id.toString() + "/foods", {
          method: 'POST',
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
          this.props.setInvisible()
        })
            }} />
            <Button title="Nevermind!" onPress={() => this.props.setInvisible()}/>
            </View>
           </View>
        </View>
      </Modal>
        </View>
    )
}}

class MealCard extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            modalVisible: false,
            isDatePickerVisible: false,
            addPopUpVisible: false,
            name: this.props.name,
            date: this.props.date,
            foods: [],
            totalCalories: 0,
            totalCarbohydrates: 0,
            totalFat: 0,
            totalProtein: 0
        }

        this.stateTemp = this.state
    }

    fetchFood = () => {
        fetch('http://cs571.cs.wisc.edu:5000/meals/' + this.props.id.toString() + '/foods', {
      method: 'GET',
      headers: {
      'x-access-token': this.props.token
      }
    }).then(res => res.json())
    .then(res => {
        let cal = 0
        let car = 0
        let fat = 0
        let pro = 0
        if(Object.keys(res).indexOf("foods") != -1){
            console.log("has food")
            for(let i of res["foods"]){
                cal += i["calories"]
                car += i["carbohydrates"]
                fat += i["fat"]
                pro += i["protein"]
            }
        }
            this.setState({
                totalCalories: cal,
                totalCarbohydrates: car,
                totalFat: fat,
                totalProtein: pro,
                foods: Object.keys(res).indexOf("foods") != -1 ? res["foods"] : []
            })
        
    })
    }

    componentDidMount(){
        console.log("mount")
        this.fetchFood()
    }

    getFoods(){
        let foods = []
        console.log(this.state.foods)
        for(let i of this.state.foods){
            foods.push(
            <View key={Math.random()}>
                <FoodCard forceUpdate={() => {
                    this.props.forceUpdate()
                }} mealId={this.props.id} foodId={i["id"].toString()} token={this.props.token} name={i["name"].toString()} calories={i["calories"].toString()} carbohydrates={i["carbohydrates"].toString()} protein={i["protein"].toString()} fat={i["fat"].toString()}/>
            </View>)
        }
        return foods
    }

    render(){
    return(
    <View style={{}}>
        <Card style={{margin: 10, borderColor: "orange", borderWidth: 1}}>
            <Text style={{fontWeight: "bold"}}>Meal Name: {this.props.name}</Text>
            <Text>Date: {this.state.date.toString()}{"\n"}Total Calories: {this.state.totalCalories}{"\n"}Total Carbohydrates: {this.state.totalCarbohydrates}{"\n"}
            Total Fat: {this.state.totalFat}{"\n"}Total Protein: {this.state.totalProtein}{"\n"}Foods:</Text>
            {this.getFoods()}
            <View style={styles.dualButton}>
            <Button title="Edit Name and Date" onPress={() => {
                this.stateTemp = this.state
                this.setState({modalVisible: true})
            }}></Button>
            <Button title="Delete" onPress={() => {
                fetch('http://cs571.cs.wisc.edu:5000/meals/' + this.props.id.toString(), {
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
            {/* Todo: Add Food Button */}
            <View style={{flexDirection: "row", justifyContent: "center"}}>
            <Button title="Add Food" onPress={() => this.setState({addPopUpVisible: true})}/>
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
        <View style={{flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{backgroundColor: "white", margin: 20, borderRadius: 20,shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4, borderColor: "red", borderWidth: 3, margin: 3}}>
            <Text style={{fontWeight:"bold"}}>Edit Meal Name and Date</Text>
            <Text>Meal Name</Text>
            <TextInput defaultValue={this.state.name.toString()} onChangeText={(text) => this.setState({name: text})}/>
            <Text>Meal Date and Time</Text>
            <Text>{this.state.date.toString()}</Text>
            <Button title="Set Date and Time" onPress={() => this.setState({isDatePickerVisible: true})}/> 
            <View style={styles.dualButton}>
            <Button title="Save" onPress={() => {
                this.setState({modalVisible: false})
                fetch('http://cs571.cs.wisc.edu:5000/meals/' + this.props.id.toString(), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': this.props.token
          },
          body: JSON.stringify({
            "name": this.state.name,
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
    <AddFoodPopUp visible={this.state.addPopUpVisible} setInvisible={() => this.setState({addPopUpVisible: false})} token={this.props.token} id={this.props.id} forceUpdate={() => this.props.forceUpdate()}></AddFoodPopUp>
    </View>)
}
}

class AddMealPopUp extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            name: "",
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
    shadowRadius: 4, borderColor: "red", borderWidth: 3, margin: 3 }}>
            <Text style={{fontWeight:"bold"}}>New Meal</Text>
            <Text>Meal Name</Text>
            <TextInput defaultValue={this.state.name.toString()} onChangeText={(text) => this.setState({name: text})}/>
            <Text>Meal Date and Time</Text>
            <Text>{this.state.date.toString()}</Text>
            <Button title="Set Date and Time" onPress={() => this.setState({isDatePickerVisible: true})}/> 
            <View style={styles.dualButton}>
            <Button title="Save" onPress={() => {
                fetch('http://cs571.cs.wisc.edu:5000/meals/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': this.props.token
          },
          body: JSON.stringify({
            "name": this.state.name,
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

export default function CreateMealView(props){

    const [mealData, setMealData] = useState([])
    const [update, forceUpdate] = useState(Math.random())
    const [addPopUpVisible, setAddPopUpVisible] = useState(false)

    useEffect(() => {
        console.log("meal view force update")
        fetch('http://cs571.cs.wisc.edu:5000/meals/', {
      method: 'GET',
      headers: {
      'x-access-token': props.token
      }
    }).then(res => res.json())
      .then(res => {
      if(! ("message" in Object.keys(res))){
        setMealData(res["meals"])
      }
      else{
          alert(res["message"])
      }
    }
      )
    }, [update])

    var getMeals = () => {
        let meals = []
        for(let i of mealData){
            let mealDate = new Date(JSON.parse('"' + i["date"] + '"'))
            meals.push(
            <View key={Math.random()}>
                <MealCard forceUpdate={() => {
                    forceUpdate(Math.random())
                    props.forceUpdate()
                }} id={i["id"].toString()} token={props.token} date={mealDate} name={i["name"].toString()}/>
            </View>)
            console.log(i["id"])
        }
        console.log("dsdsdsdsds")
        return meals
    }

    return(
    <ScrollView >
        <Text style={{fontWeight:"bold"}}>Meals</Text>
        <Text>Record your meals below.</Text>
        <View  style={{flexDirection: "row"}}>
        <Button title="Add Meal" onPress={() => setAddPopUpVisible(true)}/>
        </View>
        {getMeals()}
        <AddMealPopUp token={props.token} visible={addPopUpVisible} setInvisible={() => setAddPopUpVisible(false)} forceUpdate={() => {
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