import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscibe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        navigation.replace("Home");
      }
    });
    return unsubscibe;
  }, []);

  const signIn = () =>{
    auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      console.log('Logged in with ',user.email);
    })
    .catch((error) => alert(error.message))
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <StatusBar style="light" />
        <Image 
          source={{
            uri: "https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png",
          }}
          style={{
            width: 200,
            height: 200,
          }}
        />
        <View style={styles.inputContainer}>
          <Input type="email" autoFocus placeholder="Email" value={email} onChangeText={(text) => setEmail(text)}  />
          <Input type="password" secureTextEntry placeholder="Password" value={password} onChangeText={(text) => setPassword(text)}  />
        </View>
        <Button title="Login" onPress={signIn} containerStyle={styles.button} />
        <Button title="Register" type="outline" containerStyle={styles.button} onPress={() => navigation.navigate('Register')} />
        <View style={{height: 100,}} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default LoginScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  scrollview: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
});
