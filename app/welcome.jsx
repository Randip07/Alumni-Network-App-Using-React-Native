import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";

import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { Intro } from "@/components/Loading";

const welcome = () => {

   const isDarkMode = useColorScheme() === "dark"
   
  const router = useRouter();

   return (
      <ScreenWrapper bg={isDarkMode ? theme.darkMode.bgColor : theme.lightMode.bgColor}>
         <StatusBar style={isDarkMode ? "light" : "dark"} />
         <View style={[styles.container]}>
            {/* Welcome image */}
            {/* <Image style={styles.welcomeImage} source={require("../assets/images/welcome.png")} /> */}

            {/* Into Animtaion */}

            <Intro size={hp(40)}/>

            {/* title */}
            <View style = {{gap : 20}}>
                <Text style = {[styles.title, isDarkMode && styles.darkModeText]}>GradNet</Text>
                <Text style = {[styles.punchline, isDarkMode && styles.darkModeText]}>
                  where every thought finds a home and every image tells a story.
                </Text>
            </View>

            {/* footer */}
            <View style = {styles.footer}>
              <Button
              title = "Getting Started"
              buttonStyle={{marginHorizontal : wp(3)}}
              onPress = {()=>{ router.push("signUp")}}
              />
              <View style = {styles.bottomTextContainer}>
                <Text style = {[styles.loginText, {color: isDarkMode ? theme.colors.darkLight : theme.colors.text,}]}>Already have an account?</Text>
                <Pressable onPress={()=>router.push("login")}>
                  <Text style = {[styles.loginText, {color : theme.colors.primary, fontWeight : theme.fonts.semibold, fontSize : hp(2.2)}]}>Login</Text>
                </Pressable>
              </View>
            </View>

         </View>
      </ScreenWrapper>
   );
};

export default welcome;

const styles = StyleSheet.create({
   darkModeBg : {
      backgroundColor: theme.darkMode.bgColor
   },
   darkModeText : {
      color: theme.darkMode.textColor
   },
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-around",
      paddingHorizontal: wp(4),
   },
   welcomeImage: {
      width: wp(100),
      height: hp(30),
      resizeMode: "contain",
      alignSelf: "center",
   },

   title  : {
    fontSize : hp(5.5),
    textAlign : "center",
    fontWeight : theme.fonts.extrabold
   },

   punchline : {
    textAlign : "center",
    paddingHorizontal : wp(10),
    fontSize : hp(1.7),
    color : theme.colors.text,
   },

   footer : {
    gap : 25,
    width : "100%"
   },

   bottomTextContainer : {
    flexDirection : "row",
    justifyContent : "center",
    alignItems : "center",
    gap : 5
   },

   loginText : {
    textAlign : "center",
    fontSize : hp(1.8),
   }
});
