import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ChatList from "@/components/ChatList";
import { LoadingI } from "@/components/Loading";
import { usersRef } from "@/firebaseConfig";
import { getAllUserData, getUserData } from "@/services/userServices";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import HomeHeader from "@/components/HomeHeader";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { getUserIdsFromRoomId } from "@/helpers/common";
import themeMode from "@/constants/themeMode";
import Icon from "@/assets/icons";

const Chat = () => {
   const isDarkMode = useColorScheme() === "dark";
   const mode = isDarkMode ? themeMode.dark : themeMode.light;
   const { user } = useAuth();
   const [users, setUsers] = useState([]);

   useEffect(() => {
      if (user?.id) {
         getUsers();
      }
   }, []);
   const getUsers = async () => {
      // fetch users
      const { data, error } = await supabase.from("chatRoom").select("*").ilike("id", `%${user?.id}%`);

      const partnersIds = data.map((item) => {
         const userIds = getUserIdsFromRoomId(item.id);
         const partnerId = userIds.filter((id) => id !== user?.id)[0];

         return partnerId;
      });
      const { data :  partnersData , err } = await supabase.from("users").select("id, name, image").in("id", partnersIds);
      setUsers(partnersData);
   };
   return (
      <View style={[styles.container, isDarkMode && styles.darkModeBg]}>
         {/* <Header title="Chats" showBackButton = {false}/> */}
         <HomeHeader />

         {users.length > 0 ? (
            <ChatList users={users} currUser={user} />
         ) : (
            <View className="flex justify-center items-center" style={{ top: hp(25) }}>
               <Icon name="chat" size={60} strokeWidth={1.6} color={theme.colors.textLight} />
               <Text style= {[styles.text,{color : mode.colors.text, fontSize : hp(2.2), fontWeight : 700}]}>No messages</Text>
            </View>
         )}
      </View>
   );
};

export default Chat;

const styles = StyleSheet.create({
   darkModeBg: {
      backgroundColor: theme.darkMode.bgColor,
   },
   darkModeText: {
      color: theme.darkMode.textColor,
   },
   container: {
      flex: 1,
   },
   text: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
   },
});

