import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import BackButton from "./BackButton";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";

const ChatRoomHeader = ({ user, router }) => {
   const isDarkMode = useColorScheme() === "dark"
   return (
      <View style ={styles.container}>
            <View>
                <BackButton router={router} />
            </View>
            <Avatar uri={user?.image} size={hp(5.5)} rounded="50%" />
            <View>
               <Text style={[{ fontSize: hp(2) }, isDarkMode && styles.darkText]} className="font-bold text-neutral-700">
                  {user?.name}
               </Text>
               {/* <Text className="text-sm" style={[isDarkMode && styles.darkText]}>Active now</Text> */}
         </View>
      </View>
   );
};

export default ChatRoomHeader;

const styles = StyleSheet.create({
    container  :{
        paddingHorizontal : wp(4),
        paddingBottom : hp(1),
        flexDirection : "row",
        alignItems : "center",
        gap : 20
    },

   darkText : {
      color : theme.darkMode.textColor,
    }
})