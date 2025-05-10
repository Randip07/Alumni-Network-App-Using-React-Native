import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, Platform, useColorScheme, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { getRoomId } from "@/helpers/common";
import MessageList from "@/components/MessageList";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import ChatRoomHeader from "@/components/ChatRoomHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";

const ios = Platform.OS === "ios";

const Chat = () => {
   const isDarkMode = useColorScheme() === "dark";
   const { top } = useSafeAreaInsets();
   const item = useLocalSearchParams();
   const { user } = useAuth();
   const router = useRouter();
   const [messages, setMessages] = useState([]);
   const textRef = useRef("");
   const inputRef = useRef(null);
   const scrollViewRef = useRef(null);

   useEffect(() => {
      let roomId = getRoomId(user?.id, item?.id);

      const docRef = doc(db, "rooms", roomId);
      const messageRef = collection(docRef, "messages");
      const q = query(messageRef, orderBy("createdAt", "asc"));

      const unsub = onSnapshot(q, (snapshot) => {
         let allmessages = snapshot.docs.map((doc) => {
            return doc.data();
         });

         setMessages([...allmessages]);
      });

      const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", updateScrollView);

      return unsub;
   }, []);

   const createRoomIfNotExists = async () => {
      let roomId = getRoomId(user?.id, item?.id);
      await setDoc(doc(db, "rooms", roomId), {
         roomId,
         createdAt: Timestamp.fromDate(new Date()),
      });

      const { data, error } = await supabase
      .from("chatRoom")
      .upsert({id:roomId, createdAt:Date.now()});
   };

   const handleSendMessage = async () => {
      let message = textRef.current.trim();
      if (!message) {
         return;
      }
      try {
         createRoomIfNotExists();
         let roomId = getRoomId(user?.id, item?.id);
         const docRef = doc(db, "rooms", roomId);
         const messageRef = collection(docRef, "messages");

         const newDoc = await addDoc(messageRef, {
            userId: user?.id,
            text: message,
            senderName: user?.name,
            createdAt: Timestamp.fromDate(new Date()),
         });

         textRef.current = "";
         if (inputRef) inputRef?.current?.clear();
      } catch (err) {
         Alert.alert("Message", err.message);
      }
   };

   useEffect(() => {
      updateScrollView();
   }, [messages]);

   const updateScrollView = () => {
      setTimeout(() => {
         scrollViewRef?.current?.scrollToEnd({ animated: true });
      }, 100);
   };

   return (
      <CustomKeyboardView inChat={true}>
         <View className="flex-1" style={[isDarkMode ? styles.darkContainer : styles.lightContainer, { paddingTop: ios ? top + 10 : top + 20 }]}>
            <StatusBar style={isDarkMode ? "light" : "dark"} />
            <ChatRoomHeader user={item} router={router} />

            <View className={`flex-1 justify-between overflow-visible ${!isDarkMode && "bg-neutral-100 "}`} style={isDarkMode && styles.darkContainerMsg}>
               <View className="flex-1">
                  <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} />
               </View>

               <View className="p-2 mb-2">
                  <View className="flex-row items-center justify-left w-full">
                     <View
                        className={`flex-row justify-between  border p-3 rounded-full ${!isDarkMode && "border-neutral-300"} pl-5 flex-1`}
                        style={{ backgroundColor: isDarkMode ? theme.darkMode.blackColorV2 : "white" }}
                     >
                        <TextInput
                           ref={inputRef}
                           onChangeText={(value) => (textRef.current = value)}
                           placeholder="Type a message...."
                           placeholderTextColor={"#737373"}
                           style={{ fontSize: hp(2) }}
                           className="flex-1 mr-2"
                        />
                     </View>
                     <TouchableOpacity onPress={handleSendMessage} className="rounded-full mr-[1px]">
                        <MaterialCommunityIcons name="send-circle" size={55} color={theme.colors.primary} />
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </View>
      </CustomKeyboardView>
   );
};

export default Chat;

const styles = StyleSheet.create({
   darkContainer: {
      backgroundColor: theme.darkMode.bgColor,
   },

   darkContainerMsg: {
      backgroundColor: theme.darkMode.bgColorLight,
   },

   lightContainer: {
      backgroundColor: "white",
   },
});
