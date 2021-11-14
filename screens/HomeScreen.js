import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { auth, db } from '../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomListItem from '../components/CustomListItem';
import { Avatar } from 'react-native-elements';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";


const HomeScreen = ({ navigation }) => {

  const [chats, setChats] = useState([]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  }

  useEffect(() => {
    const unsubscribe = db.collection('chats').onSnapshot(snapshot => (
      setChats(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })))
    ))

    return unsubscribe;
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerTitle: auth.currentUser?.displayName,
      title: "Farmers Connect",
      headerStyle: { backgroundColor: "white", },
      headerTitleStyle: { color: "black", },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginRight: 5, }}>
          <TouchableOpacity onPress={handleSignOut}>
            <Avatar 
              rounded
              source={{ uri: auth?.currentUser?.photoURL }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 80,
          marginRight: 5,
        }}>
          <TouchableOpacity>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("AddChat")}>
            <SimpleLineIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, chats])

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
      // id: id,
      // chatName: chatName,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {chats.map(({ id, data: {chatName} }) => (
          <CustomListItem id={id} key={id} chatName={chatName} enterChat={enterChat} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    height: "100%",
  },
});
