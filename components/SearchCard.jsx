import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import themeMode from "@/constants/themeMode";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const SearchCard = ({item}) => {
   const scheme = useColorScheme();
   const router = useRouter();
   const isDarkMode = scheme === "dark";
   const mode = themeMode[scheme] || themeMode.light;

   const openSearchedProfile = () => {
      // Navigate to the profile view of the searched user
      router.push({
         pathname: "/profileView",
         params: item,
      });
   }
   return (
      <TouchableOpacity onPress={openSearchedProfile}>
         <View style={styles.searchCard}>
         <Avatar uri={item?.image} size={hp(5.5)} rounded={mode.radius.xxl * 2} />
         <View style= {styles.infoContainer}>
            <Text style={[styles.searchCardUsername, { color: mode.colors.text }]}>{item?.name} {item?.faculty == "faculty" && <FontAwesome5 name="chalkboard-teacher" size={20} color={theme.colors.gray} />}</Text>
            <Text style={[styles.searchCardBio, { color: mode.colors.text }]}>{item?.bio?.length > 50 ?item?.bio?.split(" ").splice(0,10).join(" ") + "...." : item?.bio}</Text>
         </View>
      </View>
      </TouchableOpacity>
   );
};

export default SearchCard;

const styles = StyleSheet.create({
   searchCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginHorizontal: wp(5),
      gap: 15,
      marginVertical : 3,
   },

   searchCardUsername: {
      fontSize: 15,
      fontWeight: theme.fonts.bold,
   },

   searchCardBio: {
      fontSize: 12,
   },
});
