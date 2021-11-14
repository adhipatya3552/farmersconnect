import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Image, Text } from 'react-native-elements';
import { auth } from '../firebase';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  useLayoutEffect(() => {
    const unsubscibe = auth.onAuthStateChanged((user) => {
      if (user){
        navigation.replace("Home");
      }
    })

    return unsubscibe;
  }, [])

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Registered with ',user.email);
        userCredentials.user.updateProfile({
          displayName: name,
          photoURL: imageUrl || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
        });
      })
      .catch((error) => alert(error.message))
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <StatusBar style="light" />
        <Text h3 style={{ marginBottom: 50, }}>
          Create a Signal account
        </Text>
        <View style={styles.inputContainer}>
          <Input 
            placeholder="Full Name"
            autoFocus
            type="text"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input 
            placeholder="Email"
            type="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input 
            placeholder="Password"
            type="password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Input 
            placeholder="Profile Picture URL (optional)"
            type="text"
            value={imageUrl}
            onChangeText={(text) => setImageUrl (text)}
            onSubmitEditing={register}
          />
        </View>
        <Button 
          containerStyle={styles.button}
          raised
          title="Register"
          onPress={register}
        />
        <View style={{height: 100,}} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    
  },
  inputContainer: {
    width: 300,
  },
  button: {
    marginTop: 10,
    width: 200,
  },
  scrollview: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
});
