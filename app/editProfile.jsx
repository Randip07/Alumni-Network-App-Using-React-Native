import { Alert, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import ScreenWrapper from "@/components/ScreenWrapper";
import Icon from "@/assets/icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { getUserImageSrc, uploadFile } from "@/services/imageService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { updateUserData } from "@/services/userServices";
import themeMode from "@/constants/themeMode";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import { Feather, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";

const EditProfile = () => {
   const scheme = useColorScheme();
   const isDarkMode = useColorScheme() == "dark";
   const mode = themeMode[scheme] || themeMode.light;
   const { user: currentUser, setUserData } = useAuth();
   const router = useRouter();
   const faculty = currentUser?.faculty == "faculty";

   const [loading, setLoading] = useState(false);
   const [user, setUser] = useState({
      name: "",
      bio: "",
      image: null,
      phoneNumber: "",
      address: "",
      course: "",
      batch: "",
      department: "",
   });

   useEffect(() => {
      if (currentUser) {
         setUser({
            name: currentUser.name || "",
            bio: currentUser.bio || "",
            phoneNumber: currentUser.phoneNumber || "",
            image: currentUser.image || null,
            address: currentUser.address || "",
            course: currentUser.course || "",
            batch: currentUser.batch || "",
            department: currentUser.department || "",
         });
      }
   }, [currentUser]);

   const onPickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ["images"],
         allowsEditing: true,
         aspect: [4, 3],
         quality: 0.7,
      });

      if (!result.canceled) {
         setUser({ ...user, image: result.assets[0] });
      }
   };

   const onSubmit = async () => {
      let userData = { ...user };
      let { name, bio, phoneNumber, image, address, course, batch , department} = userData;
      if (!faculty && (!name || !address || !course || !batch)) {
         Alert.alert("Profile", "Please fill all the fields");
         return;
      }
      if (faculty && (!name || !address || !department)) {
         Alert.alert("Profile", "Please fill all the fields");
         return;
      }

      setLoading(true);

      if (typeof image == "object") {
         let imageRes = await uploadFile("profiles", image?.uri, true);

         if (imageRes.success) {
            userData.image = imageRes.data;
         } else {
            userData.image = null;
         }
      }

      // updateUser
      const res = await updateUserData(currentUser?.id, userData);

      setLoading(false);

      if (res.success) {
         setUserData({ ...currentUser, ...userData });
         router.back();
      }
   };

   let imageSource = user.image && typeof user.image == "object" ? user.image.uri : getUserImageSrc(user.image);
   return (
      <ScreenWrapper bg={mode.colors.bgColor}>
         <View style={styles.container}>
            <Header title="Edit Profile" />
            <CustomKeyboardView>
               <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Form */}
                  <View style={styles.form}>
                     <View style={styles.avatarContainer}>
                        <Image source={imageSource} style={styles.avatar} />
                        <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                           <Icon name="camera" size={20} strokeWidth={2.5} />
                        </Pressable>
                     </View>

                     <View>
                        <Text style={{ fontSize: hp(1.5), color: isDarkMode ? "white" : theme.colors.textLight }}>Please fill your profile details</Text>
                        {faculty && (
                           <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                              <Text style={{ fontSize: hp(1.5), color: "#7CFC00", verticalAlign: "middle" }}>Faculty email verfied</Text>
                              <Ionicons name="checkmark-done-circle-sharp" size={20} color="#7CFC00" />
                           </View>
                        )}
                     </View>
                     <Input
                        icon={<Icon name="user" size={26} strokeWidth={1.6} color={isDarkMode ? "white" : theme.colors.textLight} />}
                        placeholder="Enter your name"
                        value={user.name}
                        onChangeText={(value) => setUser({ ...user, name: value })}
                     />

                     <Input placeholder="Enter your bio" value={user.bio} multiline={true} containerStyle={styles.bio} onChangeText={(value) => setUser({ ...user, bio: value })} />
                     <Input
                        icon={<Icon name="call" size={26} strokeWidth={1.6} color={isDarkMode ? "white" : theme.colors.textLight} />}
                        placeholder="Enter your phone number"
                        keyboardType="numeric"
                        value={user.phoneNumber}
                        onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
                     />
                     <Input
                        icon={<Icon name="location" size={26} strokeWidth={1.6} color={isDarkMode ? "white" : theme.colors.textLight} />}
                        placeholder="Enter your address"
                        value={user.address}
                        onChangeText={(value) => setUser({ ...user, address: value })}
                     />
                     {faculty && (
                        <Input
                           icon={<FontAwesome name="university" size={20} color={isDarkMode ? "white" : theme.colors.textLight} />}
                           placeholder="Enter Department (eg. CSE)"
                           value={user.department}
                           onChangeText={(value) => setUser({ ...user, department: value })}
                        />
                     )}
                     {!faculty && (
                        <Input
                           icon={<FontAwesome name="university" size={20} color={isDarkMode ? "white" : theme.colors.textLight} />}
                           placeholder="Enter Course (eg. B.Tech CSE)"
                           value={user.course}
                           onChangeText={(value) => setUser({ ...user, course: value })}
                        />
                     )}
                     {!faculty && (
                        <Input
                           icon={<Feather name="calendar" size={24} color={isDarkMode ? "white" : theme.colors.textLight} />}
                           placeholder="Enter Batch (eg. 2022-26)"
                           value={user.batch}
                           onChangeText={(value) => setUser({ ...user, batch: value })}
                        />
                     )}

                     <Button title="Update" loading={loading} onPress={onSubmit} />
                  </View>
               </ScrollView>
            </CustomKeyboardView>
         </View>
      </ScreenWrapper>
   );
};

export default EditProfile;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: wp(4),
      marginBottom: hp(5),
   },

   avatarContainer: {
      height: hp(14),
      width: hp(14),
      alignSelf: "center",
   },

   avatar: {
      width: "100%",
      height: "100%",
      borderRadius: theme.radius.xxl * 1.8,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: theme.colors.darkLight,
   },
   cameraIcon: {
      position: "absolute",
      bottom: 0,
      right: -10,
      padding: 8,
      borderRadius: 50,
      backgroundColor: "white",
      shadowColor: theme.colors.textLight,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
      elevation: 7,
   },
   form: {
      gap: 18,
      marginTop: 20,
      marginBottom: hp(10),
   },

   bio: {
      flexDirection: "row",
      height: hp(15),
      alignItems: "flex-start",
      paddingVertical: 15,
   },
});
