import { View, Text, Platform, StyleSheet, useColorScheme } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";

const ios = Platform.OS === "ios";

const HomeHeader = () => {
   const isDarkMode = useColorScheme() == "dark"
   const { top } = useSafeAreaInsets();

   return (
      <View style={[styles.container, {paddingTop: ios ? top : top + 10}]}>
         <View>
            <Text style={[styles.text, isDarkMode && styles.darkMode]}>
               Chats
            </Text>
         </View>
      </View>
   );
};

export default HomeHeader;

const styles = StyleSheet.create({
   container : {
      backgroundColor : theme.colors.primary,
      paddingHorizontal : wp(4),
      paddingBottom : hp(4),
      borderBottomRightRadius : "100%",
   },
   text : {
      fontSize: hp(5),
      fontWeight : theme.fonts.bold,
   },
   darkMode : {
      color : theme.darkMode.textColor
   }
})