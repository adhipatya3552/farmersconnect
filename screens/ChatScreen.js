import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome";
import { db, auth } from '../firebase';
import * as firebase from "firebase";

const ChatScreen = ({ navigation, route }) => {
  // to access the props -> use route.params.propsName
  // make sure use parenthese instead of curly brackets in headerOptions

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
          <Avatar 
            rounded
            source={{
              uri: messages[messages.length-1]?.data.photoURL || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
          <Text style={{ color: "white", marginLeft: 5, fontWeight: "700", }}>{route.params.chatName}</Text>
        </View>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 80,
          marginRight: 10,
        }}>
          <TouchableOpacity>
            <Icon 
              name="video-camera"
              type="antdesign"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon 
              name="phone"
              type="antdesign"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp","asc")
      .onSnapshot((snapshot) => 
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
      ));  
    return unsubscribe;
  }, [route])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={130}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
              >
                {messages.map(({ id, data }) => 
                  data.email === auth.currentUser.email ? (
                    // Sender
                    <View key={id} style={styles.sender}>
                      <Avatar
                        position="absolute"
                        bottom={-15}
                        right={-5}
                        //web
                        containerStyle={{
                          position: "absolute",
                          bottom: -15,
                          right: -5,
                        }}
                        rounded
                        size={30}
                        source={{
                          uri: data.photoURL,
                        }}
                      />
                      <Text style={styles.senderText}>{data.message}</Text>
                    </View>
                  ) : (
                    // Receiver
                    <View key={id} style={styles.receiver}>
                      <Avatar 
                        position="absolute"
                        containerStyle={{
                          position: "absolute",
                          bottom: -15,
                          left: -5,
                        }}
                        bottom={-15}
                        left={-5}
                        rounded
                        size={30}
                        source={{
                          uri: data.photoURL,
                        }}
                      />
                      <Text style={styles.receiverText}>{data.message}</Text>
                      <Text style={styles.receiverName}>{data.displayName}</Text>
                    </View>
                  )
                )}
                <View style={{ height: 20, }}></View>
              </ScrollView>
              <View style={styles.footer}>
                <TextInput
                  value={input}
                  onChangeText={(text) => setInput(text)}
                  style={styles.textInput}
                  onSubmitEditing={sendMessage}
                  placeholder="Send a message"
                />
                <TouchableOpacity onPress={sendMessage}>
                  <Icon 
                    name="send"
                    type="antdesign"
                    size={24}
                    color="#2B68E6"
                  />
                </TouchableOpacity>
              </View>
            </>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    color: "grey",
    padding: 10,
    borderRadius: 30,
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-end",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
    maxWidth: "80%",
    position: "relative",
  },
  receiverText:{
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  receiverName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "black",
  }, 
  senderText: {
    marginLeft: 10,
    color: "white",
    fontWeight: "500",
  } 
});
