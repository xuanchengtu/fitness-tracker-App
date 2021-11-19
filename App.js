import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler'
import base64 from 'base-64'
import { createRef } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateTodayView from './Today'
import CreateExerciseView from './Exercises'
import {useState} from 'react'
import CreateMealView from './Meal'
import Ionicons from 'react-native-vector-icons/Ionicons'

class PersonalInfo extends React.Component {

  constructor(props){
    super(props)
    this.state = 
    { token: this.props.token,
      username: this.props.username,
      firstName: "", 
      lastName: "",
      goalDailyActivity:"",
      goalDailyCalories:"",
      goalDailyCarbohydrates:"",
      goalDailyFat:"",
      goalDailyProtein:""
    } 
    this.fn = createRef()
    this.ln = createRef()
    this.cal = createRef()
    this.pro = createRef()
    this.car = createRef()
    this.fat = createRef()
    this.act = createRef()
  }

  componentDidMount(){
    fetch('http://cs571.cs.wisc.edu:5000/users/' + this.props.username, {
      "method": 'GET',
      "headers": {
        "Content-Type": "application/json",
        "x-access-token": this.props.token
      }
    }).then(res => res.json())
    .then(res => {
      if(res.username){
        this.fn.current.setNativeProps({text: res.firstName})
        this.ln.current.setNativeProps({text: res.lastName})
        this.cal.current.setNativeProps({text: res.goalDailyCalories.toString()})
        this.pro.current.setNativeProps({text: res.goalDailyProtein.toString()})
        this.car.current.setNativeProps({text: res.goalDailyCarbohydrates.toString()})
        this.fat.current.setNativeProps({text: res.goalDailyFat.toString()})
        this.act.current.setNativeProps({text: res.goalDailyActivity.toString()})
        this.setState({
          firstName: res.firstName,
          lastName: res.lastName,
          goalDailyCalories: res.goalDailyCalories.toString(),
          goalDailyProtein: res.goalDailyProtein.toString(),
          goalDailyCarbohydrates: res.goalDailyCarbohydrates.toString(),
          goalDailyFat: res.goalDailyFat.toString(),
          goalDailyActivity: res.goalDailyActivity.toString()
        })
      }
      else{
        alert(res.message)
      }
    })
  }

  render(){
    return(
    <ScrollView contentContainerStyle={{alignItems: "center"}}>
      <Text style={{fontWeight: "bold", fontSize: 26}}>About Me</Text>
      <Text>Let's get to know you!</Text>
      <Text>Specify your information below.</Text>
      <Text style={{fontWeight: "bold", fontSize: 26}}>Personal Information</Text>
      <Text>First Name</Text>
      <TextInput ref={this.fn} onChangeText={(text) => this.setState({firstName: text})} style={styles.inputText}/>
      <Text>Last Name</Text>
      <TextInput ref={this.ln} onChangeText={(text) => this.setState({lastName: text})} style={styles.inputText}/>
      <Text style={{fontWeight: "bold", fontSize: 26}}>Fitness Goals</Text>
      <Text>Daily Calories (kcal) </Text>
      <TextInput ref={this.cal} onChangeText={(text) => this.setState({goalDailyCalories: text})} style={styles.inputText}/>
      <Text>Daily Protein (grams) </Text>
      <TextInput ref={this.pro} onChangeText={(text) => this.setState({goalDailyProtein: text})} style={styles.inputText}/>
      <Text>Daily Carbs (grams) </Text>
      <TextInput ref={this.car} onChangeText={(text) => this.setState({goalDailyCarbohydrates: text})} style={styles.inputText}/>
      <Text>Daily Fats (grams) </Text>
      <TextInput ref={this.fat} onChangeText={(text) => this.setState({goalDailyFat: text})} style={styles.inputText}/>
      <Text>Daily Activity (mins) </Text>
      <TextInput ref={this.act} onChangeText={(text) => this.setState({goalDailyActivity: text})} style={styles.inputText}/>
      <Text>Looks good! All set?</Text>
      <View style={styles.dualButton}>
      <View style={{marginRight: 10}}>
      <Button title="Save Profile" onPress={() => {
        let fieldCheck = ""
        for(let i of Object.keys(this.state)){
          if(i.includes("goal")){
            if(isNaN(this.state[i]) || this.state[i].trim() === ""){
              fieldCheck += "Daily " + i.substring(9, i.length) + ", "
            }
          }
        }
        if(fieldCheck !== ""){
          alert("Field(s) " + fieldCheck.substring(0, fieldCheck.length - 2) + " should only contain numerical values!")
          return
        }
        fetch('http://cs571.cs.wisc.edu:5000/users/' + this.props.username, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': this.props.token
          },
          body: JSON.stringify({
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "goalDailyCalories": this.state.goalDailyCalories,
            "goalDailyProtein": this.state.goalDailyProtein,
            "goalDailyCarbohydrates": this.state.goalDailyCarbohydrates,
            "goalDailyFat": this.state.goalDailyFat,
            "goalDailyActivity": this.state.goalDailyActivity
          })
        }).then(res => res.json())
        .then(res => {
          if(res.message){
            alert(res.message)
            this.props.forceUpdate()
          }
        })
      }} />
      </View>
      {/* <Button title="Exit" onPress={() => this.props.navigation.navigate("Log in")}/> */}
      </View>
    </ScrollView>
    )
  }
}

class Signup extends React.Component {
  constructor(props){
    super(props)
    this.state = {username: "", password: ""}
    this.handlePress = this.handlePress.bind(this)
  }

  handlePress(){
    fetch('http://cs571.cs.wisc.edu:5000/users', {
      "method": 'POST',
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "username": this.state.username,
        "password": this.state.password
      })
    }).then(res => res.json())
    .then(res => {
      if(res.message === "User created!"){
        alert(res.message)
        this.props.navigation.navigate("Log in")
      }
      else{
        alert(res.message)
      }
    })
  }

  render(){
    return(<View style={{alignItems: "center"}}>
      <Text style={{fontWeight: "bold", fontSize: 26}}>Fitness Tracker</Text>
      <Text>New here? Let's get started! </Text>
      <Text>Please create an account below. </Text>
      <TextInput onChangeText={(text) => this.setState({username: text})} placeholder="username" style={styles.inputText}/>
      <TextInput onChangeText={(text) => this.setState({password: text})} placeholder="password" secureTextEntry={true} style={styles.inputText}/>
      <View style={styles.dualButton}>
      <View style={{marginRight: 10}}>
      <Button title="Create Account" onPress={this.handlePress} />
      </View>
      <Button title="Never mind!" onPress={() => this.props.navigation.navigate("Log in")}/>
      </View>
  </View>)
  }
}

class Login extends React.Component {

  constructor(props){
      super(props)
      this.state = {username: "", password: ""}
  }

  handlePress = () => {
    fetch('http://cs571.cs.wisc.edu:5000/login', {
      method: 'GET',
      headers: {
      'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password)
      }
    }).then(res => res.json())
      .then(res => {
      if (res.token) {
      this.props.navigation.navigate("Tab navigator", {token: res.token, username: this.state.username})
      } else {
      alert("Incorrect username or password! Please try again.")
      }
    }
      )}

  render(){
      return(
          <View style={{alignItems: "center"}}>
              <Text style={{fontWeight: "bold", fontSize: 26}}>Fitness Tracker</Text>
              <Text>Welcome! Please login or signup to continue.</Text>
              <TextInput onChangeText={(text) => this.setState({username: text})} placeholder="username" style={styles.inputText}/>
              <TextInput onChangeText={(text) => this.setState({password: text})} secureTextEntry={true} placeholder="password" style={styles.inputText}/>
              <View style={styles.dualButton}>
                <View style={{marginRight: 10}}>
                <Button title="Log in" onPress={this.handlePress}/>
                </View>
                <View>
                <Button title="sign up" onPress={() => this.props.navigation.navigate("Sign up")}/>
                </View>
              </View>
          </View>
      )
  }

}


export default function App() {
  return (
    <NavigationContainer>
      <CreateStackNavigator />
    </NavigationContainer>
  );
}

const TabNavigator = createBottomTabNavigator()

function CreateTabNavigation(props) {

  const [update, forceUpdate] = useState(Math.random())

  return (
    <TabNavigator.Navigator
    initialRouteName="Today"
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
      screenOptions={{
        headerShown: true,
        headerRight: () => {
          return <Ionicons.Button name="log-out" onPress={() => props.navigation.navigate("Log in")}>Log Out</Ionicons.Button>
        }
      }}
      initialRouteName="Today">
      <TabNavigator.Screen
        name="Today"
        children={() => <CreateTodayView username={props.route.params.username} update={update} token={props.route.params.token}></CreateTodayView>}
        options={{
          title: "Today",
          tabBarLabel: 'Today',
          tabBarIcon: ({ focused, tintColor }) => {
            let iconName = `today${focused ? '' : '-outline'}`;
            return <Ionicons name={iconName} size={25} color={tintColor} />;
          },
          tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          },
          animationEnabled: true,
        }}
      />
      <TabNavigator.Screen
        name="Exercises"
        children={() => <CreateExerciseView forceUpdate={() => forceUpdate(Math.random())} token={props.route.params.token}></CreateExerciseView>}
        options={{
          title:"Exercises",
          tabBarLabel: 'Exercises',
          tabBarIcon: ({ focused, tintColor }) => {
            let iconName = `walk${focused ? '' : '-outline'}`;
            return <Ionicons name={iconName} size={25} color={tintColor} />;
          },
          tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          },
          animationEnabled: true,
        }}
      />
      <TabNavigator.Screen
        name="Meals"
        children={() => <CreateMealView forceUpdate={() => forceUpdate(Math.random())} token={props.route.params.token}></CreateMealView>}
        options={{
          title:"Meals",
          tabBarLabel: 'Meals',
          tabBarIcon: ({ focused, tintColor }) => {
            let iconName = `fast-food${focused ? '' : '-outline'}`;
            return <Ionicons name={iconName} size={25} color={tintColor} />;
          },
          tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          },
          animationEnabled: true,
        }}
      />
      <TabNavigator.Screen
        name="Personal Info"
        children={() => <PersonalInfo forceUpdate={() => forceUpdate(Math.random())} username={props.route.params.username} token={props.route.params.token}></PersonalInfo>}
        options={{
          title:"Personal Info",
          tabBarLabel: 'Personal Info',
          tabBarIcon: ({ focused, tintColor }) => {
            let iconName = `information-circle${focused ? '' : '-outline'}`;
            return <Ionicons name={iconName} size={25} color={tintColor} />;
          },
          tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          },
          animationEnabled: true,
        }}
      />
    </TabNavigator.Navigator>
  );
}

const StackNavigator = createStackNavigator()

function CreateStackNavigator(){
  return(
    <StackNavigator.Navigator initialRouteName="Log in">
      <StackNavigator.Screen name="Log in" component={Login} options={{headerLeft: () => null}}/>
      <StackNavigator.Screen name="Sign up" component={Signup} options={{headerLeft: () => null}}/>
      <StackNavigator.Screen name="Tab navigator" component={CreateTabNavigation} options={{headerLeft: () => null, headerShown: false}}/>
    </StackNavigator.Navigator>
  )
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
