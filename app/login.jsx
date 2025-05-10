import { Alert, Keyboard, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "../constants/theme";
import Icon from "@/assets/icons";
import { StatusBar } from "expo-status-bar";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "@/helpers/common";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

export default login = () => {
   const isDarkMode = useColorScheme() === "dark"

   const router = useRouter();
   const emailRef = useRef("");
   const passwordRef = useRef("");
   const [loading, setLoading] = useState(false);

   const onSubmit = async () => {
      Keyboard.dismiss();
      
      if(!emailRef.current || !passwordRef.current){
         Alert.alert('Login', "Please enter your email and password to continue");
         return;
      };

      const email = emailRef.current.trim();
      const password = passwordRef.current.trim();

      
      setLoading(true);

      const {error} = await supabase.auth.signInWithPassword({
         email,
         password
      })
      setLoading(false);
      
      Alert.alert('Login', error.message);

   };

   return (
      <ScreenWrapper bg={isDarkMode ? theme.darkMode.bgColor : theme.lightMode.bgColor}>
         <StatusBar style={isDarkMode ? "light" : "dark"} />
         <View style={styles.container}>
            <BackButton router={router} />

            {/* Welcome text */}
            <View>
               <Text style={[styles.welcomeText, isDarkMode && styles.darkModeText]}>Hey,</Text>
               <Text style={[styles.welcomeText, isDarkMode && styles.darkModeText]}>Welcome Back</Text>
            </View>

            {/* form */}
            <View style={styles.form}>
               <Text style={{ fontSize: hp(1.5), color: isDarkMode ? theme.darkMode.textColor : "black" }}>Please login to continue</Text>
               <Input
                  icon={
                     <Icon
                        name="mail"
                        size={26}
                        strokeWidth={1.6}
                        color = {isDarkMode ? theme.darkMode.textColor  : theme.colors.textLight}
                        onPress={() => {
                        }}
                     />
                  }
                  placeholder="Enter your email"
                  onChangeText={(value) => {
                     emailRef.current = value;
                  }}
                  keyboardType="email-address"
               />
               <Input
                  icon={
                     <Icon
                        name="lock"
                        size={26}
                        strokeWidth={1.6}
                        color = {isDarkMode ? theme.darkMode.textColor  : theme.colors.textLight}
                        onPress={() => {
                        }}
                     />
                  }
                  placeholder="Enter your password"
                  onChangeText={(value) => {
                     passwordRef.current = value;
                  }}
                  secureTextEntry
               />
               {!loading && <Text style={[styles.forgotPassword, {color : isDarkMode ? theme.colors.darkLight : theme.colors.text}]}>Forgot Password?</Text>}

               {/* Button */}
               <Button title="Login" loading={loading} onPress={onSubmit} />
            </View>

            {/* footer */}
            {!loading && (
               <View style={styles.footer}>
                  <Text style={[styles.footerText, {color : isDarkMode ? theme.colors.darkLight : theme.colors.text}]}>Don't have an account?</Text>
                  <Pressable onPress={() => {
                     router.replace("signUp")}}>
                     <Text style={[styles.footerText, { color: theme.colors.primary, fontWeight: theme.fonts.semibold }]}>Sign up</Text>
                  </Pressable>
               </View>
            )}
         </View>
      </ScreenWrapper>
   );
};

const styles = StyleSheet.create({
   darkModeBg : {
      backgroundColor: theme.darkMode.bgColor
   },
   darkModeText : {
      color: theme.darkMode.textColor
   },

   container: {
      flex: 1,
      gap: 45,
      paddingHorizontal: wp(5),
   },

   welcomeText: {
      fontSize: hp(5),
      fontWeight: theme.fonts.bold,
      color: theme.colors.text,
   },

   form: {
      gap: 20,
   },

   forgotPassword: {
      textAlign: "right",
      color: theme.colors.text,
      fontWeight: theme.fonts.semibold,
   },

   footer: {
      gap: 5,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
   },

   footerText: {
      fontSize: hp(1.8),
      color: theme.colors.text,
   },
});
