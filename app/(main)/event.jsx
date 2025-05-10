import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import themeMode from "@/constants/themeMode";
import { hp, wp } from "@/helpers/common";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";

const Event = () => {
   const isDarkMode = useColorScheme() === "dark";
   const mode = isDarkMode ? themeMode.dark : themeMode.light;
   return (
      <ScreenWrapper bg={mode.colors.bgColor}>
         <View style={styles.container}>
            <Text style={styles.heading}>Events</Text>
            <EventCard/>
         </View>
      </ScreenWrapper>
   );
};

export default Event;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal : wp(6),
    gap: 10,
   },
   heading: {
      color: "white",
      fontSize: hp(5),
      fontWeight: 700,
      marginBottom : hp(2),
   },
});
