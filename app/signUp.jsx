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
import { useAuth } from "@/context/AuthContext";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";

export default signUp = () => {
   const isDarkMode = useColorScheme() == "dark";
   const router = useRouter();
   const nameRef = useRef("");
   const emailRef = useRef("");
   const passwordRef = useRef("");
   const courseRef = useRef("");
   const batchRef = useRef("");
   const departmentRef = useRef("");
   const [loading, setLoading] = useState(false);
   const [facultyStatus, setFacultyStatus] = useState(false);

   const { register } = useAuth();

   const checkFacultyEmail = () => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@dbuniversity.ac.in$/;
      const email = emailRef.current.trim();
      const isValidEmail = emailRegex.test(email);

      if (isValidEmail) {
         setFacultyStatus(true);
      } else {
         setFacultyStatus(false);
      }
   };

   const onSubmit = async () => {
      if(facultyStatus){
         if ( !emailRef.current || !passwordRef.current || !nameRef.current || !departmentRef.current) {
            Alert.alert("Login", "Please fill all the details to continue1");
            return;
         }
      }else{
         if ( !emailRef.current || !passwordRef.current || !nameRef.current || !courseRef.current || !batchRef.current) {
            Alert.alert("Login", "Please fill all the details to continue2");
            return;
         }
      }

      const name = nameRef.current.trim();
      const email = emailRef.current.trim();
      const password = passwordRef.current.trim();
      const course = courseRef.current.trim();
      const batch = batchRef.current.trim();
      const department = departmentRef.current.trim();
      let faculty = "student";
      const emailRegex = /^[a-zA-Z0-9._%+-]+@dbuniversity\.ac\.in$/;
      const isValidEmail = emailRegex.test(email);
      if (isValidEmail) {
         faculty = "faculty";
      }

      Keyboard.dismiss();

      setLoading(true);

      const {
         data: { session },
         error,
      } = await supabase.auth.signUp({
         email,
         password,
         options: {
            data: {
               name,
               email,
               course,
               batch,
               faculty,
               department
            },
         },
      });

      let res = await register(session?.user?.email, session?.user?.id);

      setLoading(false);

      Alert.alert("Sign up", error.message);
   };

   return (
      <ScreenWrapper bg={isDarkMode ? theme.darkMode.bgColor : "white"}>
         <StatusBar style={isDarkMode ? "light" : "dark"} />
         <View style={styles.container}>
            <BackButton router={router} />

            <CustomKeyboardView>
               {/* Welcome text */}
               <View>
                  <Text style={[styles.welcomeText, { color: isDarkMode ? theme.darkMode.textColor : "black" }]}>Let's</Text>
                  <Text style={[styles.welcomeText, { color: isDarkMode ? theme.darkMode.textColor : "black" }]}>Get Started</Text>
               </View>

               {/* form */}
               <View style={styles.form}>
                  <View style={{ gap: 5 }}>
                     <Text style={{ fontSize: hp(1.5), color: isDarkMode ? theme.darkMode.textColor : "black" }}>Please fill all the details to create an account</Text>
                     {facultyStatus && (
                        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                           <Text style={{ fontSize: hp(1.5), color: "#7CFC00", verticalAlign: "middle" }}>Faculty email identified</Text>
                           <Ionicons name="checkmark-done-circle-sharp" size={20} color="#7CFC00" />
                        </View>
                     )}
                  </View>
                  <Input
                     icon={<Icon name="user" size={26} strokeWidth={1.6} color={isDarkMode ? "white" : theme.colors.textLight} onPress={() => {}} />}
                     placeholder="Enter your name"
                     onChangeText={(value) => {
                        nameRef.current = value;
                     }}
                  />
                  <Input
                     icon={<Icon name="mail" size={26} strokeWidth={1.6} color={isDarkMode ? "white" : theme.colors.textLight} onPress={() => {}} />}
                     placeholder="Enter your email"
                     onChangeText={(value) => {
                        emailRef.current = value;
                        checkFacultyEmail();
                     }}
                     keyboardType="email-address"
                  />
                  <Input
                     icon={<Icon name="lock" size={26} strokeWidth={1.6} color={isDarkMode ? "white" : theme.colors.textLight} onPress={() => {}} />}
                     placeholder="Enter your password"
                     onChangeText={(value) => {
                        passwordRef.current = value;
                     }}
                     secureTextEntry
                  />

                  {facultyStatus && (
                     <Input
                        icon={<FontAwesome name="university" size={20} color={isDarkMode ? "white" : theme.colors.textLight} />}
                        placeholder="Enter Department (eg. CSE)"
                        onChangeText={(value) => {
                           departmentRef.current = value;
                        }}
                     />
                  )}
                  {!facultyStatus && (
                     <Input
                        icon={<FontAwesome name="university" size={20} color={isDarkMode ? "white" : theme.colors.textLight} />}
                        placeholder="Enter Course (eg. B.Tech CSE)"
                        onChangeText={(value) => {
                           courseRef.current = value;
                        }}
                     />
                  )}
                  {!facultyStatus && (
                     <Input
                        icon={<Feather name="calendar" size={24} color={isDarkMode ? "white" : theme.colors.textLight} />}
                        placeholder="Enter Batch (eg. 2022-26)"
                        onChangeText={(value) => {
                           batchRef.current = value;
                        }}
                     />
                  )}
                  {/* Button */}
                  <Button title="Sign up" loading={loading} onPress={onSubmit} />
               </View>

               {/* footer */}
               {!loading && (
                  <View style={styles.footer}>
                     <Text style={[styles.footerText, { color: isDarkMode ? theme.colors.darkLight : theme.colors.text }]}>Already have an account?</Text>
                     <Pressable onPress={() => router.replace("login")}>
                        <Text style={[styles.footerText, { color: theme.colors.primary, fontWeight: theme.fonts.semibold }]}>Login</Text>
                     </Pressable>
                  </View>
               )}
            </CustomKeyboardView>
         </View>
      </ScreenWrapper>
   );
};

const styles = StyleSheet.create({
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
      marginBottom: hp(5),
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
      marginTop: 20,
   },

   footerText: {
      fontSize: hp(1.8),
      color: theme.colors.text,
   },
});
