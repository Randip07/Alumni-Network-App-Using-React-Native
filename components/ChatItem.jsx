import { View, Text, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image';
import { blurhash, formatDate, getRoomId } from '../helpers/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Avatar from './Avatar';
import { theme } from '@/constants/theme';


const ChatItem = ({item, index, router, noBorder , currUser}) => {

    const isDarkMode = useColorScheme() === "dark"
    const [lastMessage , setLastMessage] = useState(undefined);

    useEffect(() => {
          let roomId = getRoomId(currUser?.id, item?.id);

          const docRef = doc(db, "rooms", roomId);
          const messageRef = collection(docRef, "messages");
          const q = query(messageRef, orderBy("createdAt", "desc"));
    
          const unsub = onSnapshot(q, (snapshot) => {
             let allmessages = snapshot.docs.map((doc) => {
                return doc.data();
             });

             setLastMessage(allmessages[0] ? allmessages[0] : null)
          });
    
          return unsub;
       }, []);

    const openChatRoom = () => {
        router.push({pathname : "/chatRoom", params : item}); 

    }

    const renderTime =  ()=>{
        if(lastMessage){
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
    }

    const renderLastMessage = () => {
        if(typeof lastMessage == "undefined") return "Loading......"
        if(lastMessage){
            if(currUser?.userId == lastMessage?.userId){
                return "You : " + lastMessage?.text;
            }else{
                return lastMessage?.text;
            }
        }else{
            return "Say Hi 👋"
        }
    }

  return (
    <TouchableOpacity onPress={openChatRoom} style = {[styles.container, isDarkMode && styles.darkContainer]}>
        <Avatar uri={item?.image} size={hp(6)} rounded={theme.radius.xxl * 10}/>
        <View style = {styles.chatBox} >
            <View style = {{gap : 5}}>
                <Text style = {[styles.title, isDarkMode && styles.darkText]}>{item?.name}</Text>
                <Text style = {[styles.lastMsg, isDarkMode && styles.darkTextLastMsg]}>{renderLastMessage()}</Text>
            </View>
            <View style = {{gap : 5}}>
                <Text style = {[styles.lastMsg, isDarkMode && styles.darkTextLastMsg]}>{renderTime()}</Text>
            </View>

        </View>
    </TouchableOpacity>
  )
}

export default ChatItem


const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection : "row",
      padding : wp(2),
      borderBottomColor : theme.colors.gray,
      borderBottomWidth : 0.5,
      gap : 5,
   },

   darkContainer : {
    borderBottomWidth : 0
   },

   chatBox : {
    flex : 1,
    flexDirection : "row",
    justifyContent : "space-between",
    paddingHorizontal : wp(2),
   },

   darkText : {
    color : theme.darkMode.textColor
   },

   title : {
    fontSize : hp(1.7),
    fontWeight : theme.fonts.bold

   },

   darkTextLastMsg : {
    color : theme.colors.darkLight
   }
})
