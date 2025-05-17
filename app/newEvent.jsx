import { Alert, FlatList, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/context/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "@/assets/icons";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/Button";
import { Image } from "expo-image";
import { getSupabaseFileUrl } from "@/services/imageService";
import { Audio, Video } from "expo-av";
import { createOrUpdateEvent, createOrUpdateEventRequest, createOrUpdatePost } from "@/services/postService";
import themeMode from "@/constants/themeMode";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import Input from "@/components/Input";
import DatePicker from "react-native-date-picker";
import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker";
import { supabase } from "@/lib/supabase";
import SearchCard from "@/components/SearchCard";

const NewEvent = () => {
   const scheme = useColorScheme();
   const isDarkMode = useColorScheme() == "dark";
   const mode = themeMode[scheme] || themeMode.light;
   const { user } = useAuth();

   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [file, setFile] = useState(file);
   const [shouldPlay, setShouldPlay] = useState(true);
   const [playButtonShow, setPlayButtonShow] = useState(true);
   const [muted, setMuted] = useState(false);
   const post = useLocalSearchParams();

   const defaultStyles = useDefaultStyles();
   const [selectedStartDate, setSelectedStartDate] = useState();
   const [selectedEndDate, setSelectedEndDate] = useState();
   const [searchResult, setSearchResult] = useState([]);

   const titleRef = useRef("");
   const descriptionRef = useRef("");
   const locationRef = useRef("");
   const [faculty, setFaculty] = useState("");
   const facultyIdRef = useRef("");
   const [facultyShow, setFacultyShow] = useState(false);

   useEffect(() => {
      if (post && post?.id) {
         setFile(post.file || null);
      }
   }, []);

   const onPick = async (isImage) => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ["images"],
         allowsEditing: true,
          aspect: [4, 3],
         quality: 0.7,
      });

      if (!result.canceled) {
         setFile(result.assets[0]);
      }
   };

   const isLocalFile = (file) => {
      if (!file) return null;
      if (typeof file == "object") return true;

      return false;
   };

   const getFileType = (file) => {
      if (!file) return null;
      if (isLocalFile(file)) {
         return file.type;
      }

      if (file.includes("postImages")) {
         return "image";
      }

      return "video";
   };

   const getFileUri = (file) => {
      if (!file) return null;
      if (isLocalFile(file)) {
         return file.uri;
      }
      return getSupabaseFileUrl(file)?.uri;
   };

   const controllVideo = () => {
      if (shouldPlay) {
         setShouldPlay(false);
      } else {
         setPlayButtonShow(true);
         setShouldPlay(true);
         setTimeout(() => {
            setPlayButtonShow(false);
         }, 1000);
      }
   };

   const onSubmit = async () => {
      if (!file) {
         Alert.alert("Post", "Please select image or video and add caption.");
         return;
      }
      if (!titleRef.current || !descriptionRef.current || !locationRef.current || !facultyIdRef.current) {
         Alert.alert("Post", "Please fill all the details");
         return;
      }
      const title = titleRef.current.trim();
      const description = descriptionRef.current.trim();
      const location = locationRef.current.trim();
      const faculty = facultyIdRef.current.trim();

      let data = {
         file,
         title,
         description,
         location,
         startDate: selectedStartDate,
         endDate: selectedEndDate,
         userId : user?.id,
         faculty
      };

      let eventReq = {
         senderId : user?.id,
         receiverId : faculty,
         status : "requested"
      }


      if (post && post?.id) data.id = post?.id;

      // create post
      setLoading(true);
      let res = await createOrUpdateEvent(data);
      setLoading(false);

      if (res.success) {
         setFile(null);
         let res = await createOrUpdateEventRequest(eventReq);
         console.log(res);
         
         router.back();
      } else {
         Alert.alert("Event", res.msg);
      }
   };

   const searchProfiles = async (value) => {
      setFaculty(value);

      if (value.length == 0 || value == "") {
         setSearchResult([]);
         return 0;
      }
      try {
         if (value.length > 0 || value != "") {
            const { data, error } = await supabase
               .from("users")
               .select("id, name, image, bio")
               .or(`name.ilike.%${value}%,department.ilike.%${value}%`)
               .eq("faculty", "faculty")
               .order("name", { ascending: true });

            // setSearchResult((prev) => {
            //    if (prev.length == 0) {
            //       return [...prev, ...data];
            //    }
            //    return data;
            // });
            // setSearchResult((prev) => {
            //    const filteredData = data.filter((item) => item.id !== curruser.id);

            //    if (prev.length === 0) {
            //       return [...prev, ...filteredData];
            //    }
            //    return filteredData;
            // });

            setSearchResult(data);
         }
      } catch (err) {
         return;
      }
   };

   return (
      <ScreenWrapper bg={mode.colors.bgColor}>
         <View
            style={styles.container}
            onPress={() => {
               Keyboard.dismiss();
            }}
         >
            <Header title={post && post?.id ? "Update Event" : "Create Event"} />
            <CustomKeyboardView>
               <ScrollView contentContainerStyle={{ gap: 20, marginBottom: hp(2) }} keyboardShouldPersistTaps="always">
                  <View style={styles.header}>
                     {/* Avatar */}
                     <Avatar uri={user?.image} size={hp(6.5)} rounded={theme.radius.xl} />

                     <View style={{ gap: 2 }}>
                        <Text style={[styles.username, { color: mode.colors.text }]}>{user && user?.name}</Text>
                        <Text style={styles.publicText}>Public</Text>
                     </View>
                  </View>

                  <View style={styles.media}>
                     <Text style={[styles.addImageText, { color: mode.colors.text }]}>Add Banner of the Event</Text>
                     <View style={styles.medialcons}>
                        <TouchableOpacity>
                           <Icon name="image" size={30} color={mode.colors.text} onPress={() => onPick(true)} />
                        </TouchableOpacity>
                     </View>
                  </View>

                  {file && (
                     <View style={styles.file}>
                        {getFileType(file) == "video" ? (
                           <>
                              <Video
                                 style={{ flex: 1 }}
                                 source={{ uri: getFileUri(file) }}
                                 onTouchEnd={() => controllVideo()}
                                 resizeMode="cover"
                                 isLooping
                                 shouldPlay={shouldPlay ? true : false}
                                 isMuted={muted ? true : false}
                              />
                           </>
                        ) : (
                           <>
                              <Image source={{ uri: getFileUri(file) }} contentFit="cover" style={{ flex: 1 }} />
                           </>
                        )}

                        <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                           <Icon name="delete" size={20} color="white" />
                        </Pressable>

                        {getFileType(file) == "video" &&
                           (muted ? (
                              <Pressable style={styles.muteIcon} onPress={() => setMuted(false)}>
                                 <Icon name="mute" size={20} color="black" />
                              </Pressable>
                           ) : (
                              <Pressable style={styles.muteIcon} onPress={() => setMuted(true)}>
                                 <Icon name="unmute" size={20} color="black" />
                              </Pressable>
                           ))}

                        {getFileType(file) == "video" &&
                           (shouldPlay ? (
                              playButtonShow && (
                                 <Pressable style={styles.pauseIcon} onPress={() => controllVideo()}>
                                    <Icon name="pause" size={20} color="black" />
                                 </Pressable>
                              )
                           ) : (
                              <Pressable style={styles.pauseIcon} onPress={() => controllVideo()}>
                                 <Icon name="play" size={20} color="black" />
                              </Pressable>
                           ))}
                     </View>
                  )}
                  <View style={styles.form}>
                     <Input
                        placeholder="Event Title"
                        onChangeText={(value) => {
                           titleRef.current = value;
                        }}
                     />
                     <Input
                        placeholder="Event Description"
                        multiline={true}
                        containerStyle={styles.description}
                        onChangeText={(value) => {
                           descriptionRef.current = value;
                        }}
                     />
                     <Input
                        placeholder="Event Location"
                        onChangeText={(value) => {
                           locationRef.current = value;
                        }}
                     />
                     <Text style={{ color: isDarkMode ? "white" : "black", fontSize: hp(3), fontWeight: theme.fonts.semibold }}>Start Date & Time</Text>
                     <DateTimePicker
                        timePicker={true}
                        use12Hours={true}
                        mode="single"
                        minDate={Date.now()}
                        date={selectedStartDate}
                        onChange={({ date }) => setSelectedStartDate(date)}
                        styles={defaultStyles}
                     />
                     <Text style={{ color: isDarkMode ? "white" : "black", fontSize: hp(3), fontWeight: theme.fonts.semibold }}>End Date & Time</Text>
                     <DateTimePicker
                        timePicker={true}
                        use12Hours={true}
                        mode="single"
                        minDate={Date.now()}
                        date={selectedEndDate}
                        onChange={({ date }) => setSelectedEndDate(date)}
                        styles={defaultStyles}
                     />

                     <Text style={{ color: isDarkMode ? "white" : "black", fontSize: hp(3), fontWeight: theme.fonts.semibold }}>Select Faculty </Text>
                     <Input
                        value={faculty}
                        placeholder="Search Faculty"
                        onChangeText={(value) => {
                           setFacultyShow(true)
                           facultyIdRef.current = "";
                           searchProfiles(value);
                        }}
                     />
                     {searchResult.length != 0 && facultyShow && (
                        <View>
                           <FlatList
                              data={searchResult}
                              keyboardShouldPersistTaps = "always"
                              showsVerticalScrollIndicator={false}
                              contentContainerStyle={styles.listStyle}
                              keyExtractor={(item) => item.id.toString()}
                              renderItem={({ item }) => (
                                 <TouchableOpacity
                                    onPress={() => {
                                       setFaculty(item?.name);
                                       facultyIdRef.current = item?.id;
                                       setFacultyShow(false)
                                    }}
                                 >
                                    <SearchCard item={item} inEvent={true} />
                                 </TouchableOpacity>
                              )}
                              onEndReachedThreshold={0}
                           />
                        </View>
                     )}
                  </View>
               </ScrollView>
               <Button
                  buttonStyle={{ height: hp(6.2), marginBottom: hp(10) }}
                  title={post && post?.id ? "Update" : "Create"}
                  hasShadow={false}
                  loading={loading}
                  onPress={onSubmit}
               />
            </CustomKeyboardView>
         </View>
      </ScreenWrapper>
   );
};

export default NewEvent;

const styles = StyleSheet.create({
   listStyle: {
      paddingBottom: hp(5),
   },
   dateBtn: {
      flexDirection: "row",
      height: hp(7.2),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.text,
      borderRadius: theme.radius.xl,
      borderCurve: "continuous",
      paddingHorizontal: 18,
      gap: 12,
   },
   dateBtnText: {
      fontSize: hp(1.8),
      fontWeight: theme.fonts.semibold,
   },
   container: {
      flex: 1,
      paddingHorizontal: wp(4),
      gap: 15,
   },

   header: {
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
   },

   title: {
      // marginBottom: 10,
      fontSize: hp(2.5),
      fontWeight: theme.fonts.semibold,
      color: theme.colors.text,
      textAlign: "center",
   },

   username: {
      fontSize: hp(2.2),
      fontWeight: theme.fonts.semibold,
      color: theme.colors.text,
   },

   avatar: {
      height: hp(6.5),
      width: hp(6.5),
      borderRadius: theme.radius.xl,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.1)",
   },

   publicText: {
      fontSize: hp(1.7),
      fontWeight: theme.fonts.medium,
      color: theme.colors.textLight,
   },

   form: {
      gap: 15,
   },

   media: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1.5,
      padding: 12,
      paddingHorizontal: 18,
      borderRadius: theme.radius.xl,
      borderCurve: "continuous",
      borderColor: theme.colors.gray,
   },

   medialcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
   },

   addImageText: {
      fontSize: hp(1.9),
      fontWeight: theme.fonts.semibold,
      color: theme.colors.text,
   },

   file: {
      height: 200,
      width: "100%",
      borderRadius: theme.radius.xl,
      overflow: "hidden",
      borderCurve: "continuous",
   },

   closeIcon: {
      position: "absolute",
      top: 10,
      right: 10,
      padding: 7,
      borderRadius: 50,
      backgroundColor: theme.colors.rose,
      // shadowColor: theme.colors. textLight,
      // shadowOffset: {width: 0, height: 3},
      // shadowOpacity: 0.6,
   },

   muteIcon: {
      position: "absolute",
      bottom: 10,
      right: 10,
      padding: 7,
      borderRadius: 50,
      backgroundColor: theme.colors.gray,
   },

   pauseIcon: {
      position: "absolute",
      bottom: 10,
      left: 10,
      padding: 7,
      borderRadius: 50,
      backgroundColor: theme.colors.gray,
   },

   description: {
      flexDirection: "row",
      height: hp(15),
      alignItems: "flex-start",
      paddingVertical: 15,
   },
});
