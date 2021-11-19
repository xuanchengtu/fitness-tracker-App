import React, { useEffect } from 'react';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper'
import {useState} from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';

class FoodCard extends React.Component{

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
          <Text style={{fontWeight: "bold"}}>Food Name:{this.props.name}</Text>
          <Text>Calories: {this.props.calories}{"\n"}Carbohydrates: {this.props.carbohydrates}{"\n"}
          Fat: {this.props.fat}{"\n"}Protein: {this.props.protein}</Text>
      </Card>
  </View>)
}
}

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
      </Card>
  </View>)
}
}

export default function CreateTodayView(props) {

    const [exerciseData, setExerciseData] = useState([])
    const [mealData, setMealData] = useState([])
    const [goal, setGoal] = useState({
      "goalDailyActivity": 0.0,
      "goalDailyCalories": 0.0,
      "goalDailyCarbohydrates": 0.0,
      "goalDailyFat": 0.0,
      "goalDailyProtein": 0.0,
  })
    const [totalDuration, setTotalDuration] = useState(0)
    const [totalCalories, setTotalCalories] = useState(0)
    const [totalCarbohydrates, setTotalCarbohydrates] = useState(0)
    const [totalProtein, setTotalProtein] = useState(0)
    const [totalFat, setTotalFat] = useState(0)

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
        let totalDuration = 0
        for(let i of res["activities"]){
          let exerciseDate = new Date(JSON.parse('"' + i["date"] + '"'))
          if(!sameDayCheck(new Date(), exerciseDate)){
            continue
        }
            totalDuration += i["duration"]
        }
        setTotalDuration(totalDuration)
      }
      else{
          alert(res["message"])
      }
    }
      )
    
      fetch('http://cs571.cs.wisc.edu:5000/meals/', {
      method: 'GET',
      headers: {
      'x-access-token': props.token
      }
    }).then(res => res.json())
      .then(res => {
      if(! ("message" in Object.keys(res))){
        setMealData(res["meals"])
        let cal = 0
      let car = 0
      let fat = 0
      let pro = 0
        for(let i of res["meals"]){
          let mealDate = new Date(JSON.parse('"' + i["date"] + '"'))
          if(!sameDayCheck(new Date(), mealDate)){
            continue
        }
          fetch('http://cs571.cs.wisc.edu:5000/meals/' + i.id.toString() + '/foods', {
    method: 'GET',
    headers: {
    'x-access-token': props.token
    }
  }).then(res => res.json())
  .then(res => {
    if(Object.keys(res).indexOf("foods") != -1){
      for(let i of res["foods"]){
        cal += i["calories"]
              car += i["carbohydrates"]
              fat += i["fat"]
              pro += i["protein"]
      }
      
    }
    setTotalCalories(cal)
      setTotalCarbohydrates(car)
      setTotalProtein(pro)
      setTotalFat(fat)
  })
        }
        
      }
      else{
          alert(res["message"])
      }
    }
      )

      fetch('http://cs571.cs.wisc.edu:5000/users/' + props.username, {
        "method": 'GET',
        "headers": {
          "Content-Type": "application/json",
          "x-access-token": props.token
        }
      }).then(res => res.json())
      .then(res => {
        setGoal(res)
      })
    }, [props.update])

    var sameDayCheck = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
    }

    var getMeals = () => {
      let meals = []
      for(let i of mealData){
          let mealDate = new Date(JSON.parse('"' + i["date"] + '"'))
          if(!sameDayCheck(new Date(), mealDate)){
            continue
        }
          meals.push(
          <View key={Math.random()}>
              <MealCard forceUpdate={() => {
                  forceUpdate(Math.random())
                  props.forceUpdate()
              }} id={i["id"].toString()} token={props.token} date={mealDate} name={i["name"].toString()}
              incrementCal={(cal) => setTotalCalories(totalCalories + cal)}
              incrementCar={(car) => setTotalCarbohydrates(totalCarbohydrates + car)}
              incrementPro={(pro) => setTotalProtein(totalProtein + pro)}
              incrementFat={(fat) => setTotalFat(totalFat + fat)}/>
          </View>)
      }
      return meals
  }

    var getExercises = () => {
        let date = new Date()
        let exercises = []
        let count = 0
        for(let i of exerciseData){
            count++
            console.log(count)
            let exerciseDate = new Date(JSON.parse('"' + i["date"] + '"'))
            console.log(date.getFullYear() === exerciseDate.getFullYear() && date.getMonth() === exerciseDate.getMonth() && date.getDate() === exerciseDate.getDate())
            console.log(date.getFullYear(), exerciseDate.getFullYear(), date.getMonth(), exerciseDate.getMonth(), date.getDate(), exerciseDate.getDate())
            if(!sameDayCheck(date, exerciseDate)){
                continue
            }
            exercises.push(
            <View>
                <Card style={{margin: 10, borderColor: "orange", borderWidth: 1}}>
                    <Text style={{fontWeight: "bold"}}>Exercise Name: {i["name"]}</Text>
                    <Text>Date: {exerciseDate.toString()}{"\n"}Calories Burnt: {i["calories"]} cal{"\n"}Duration: {i["duration"]} Minutes</Text>
                </Card>
            </View>)
        }
        return exercises
    }

    return(
        <ScrollView>
            <Text style={{fontWeight: "bold"}}>Today</Text>
            <Text>What's on the agenda for today?{"\n"}Below are all of your goals and exercises.</Text>
            <Card style={{margin: 10, borderColor: "orange", borderWidth: 1}}>
                <Text>Goal Status</Text>
                <Text>Daily Activity: {totalDuration}/{goal.goalDailyActivity} min</Text>
                <Text>Daily Calories: {totalCalories}/{goal.goalDailyCalories} cal</Text>
                <Text>Daily Carbohydrates: {totalCarbohydrates}/{goal.goalDailyCarbohydrates} g</Text>
                <Text>Daily Protein: {totalProtein}/{goal.goalDailyProtein} g</Text>
                <Text>Daily Fat: {totalFat}/{goal.goalDailyFat} g</Text>
            </Card>
            <Text>Exercises</Text>
            {getExercises()}
            <Text>Meals</Text>
            {getMeals()}
        </ScrollView>
    )
}