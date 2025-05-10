import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { AntDesign } from "@expo/vector-icons";

const ButtonII = ({ title = " ", onPress = () => {}, buttonStyle = {}, textStyle = {} }) => {
   return (
      <Pressable onPress={onPress} style={[styles.button, buttonStyle]}>
         <Text style={[styles.text, textStyle]}>{title}</Text>
         <AntDesign name="arrowright" size={24} color="white" />
      </Pressable>
   );
};

export default ButtonII;

const styles = StyleSheet.create({
   button: {
      backgroundColor: theme.colors.textDark,
      height: hp(6.6),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderCurve: "continuous",
      marginHorizontal: wp(6),
      paddingHorizontal: wp(4),
      borderRadius: theme.radius.lg,
   },

   text: {
      fontSize: hp(1.8),
      color: "white",
      fontWeight: theme.fonts.semibold,
   },
});
