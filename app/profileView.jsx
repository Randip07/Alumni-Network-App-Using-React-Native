import { FlatList, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import themeMode from "@/constants/themeMode";
import { useLocalSearchParams, useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { getUserData } from "@/services/userServices";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";
import { getUserImageSrc } from "@/services/imageService";
import Button from "@/components/Button";
import { TouchableOpacity } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

const profileView = () => {
   const item = useLocalSearchParams();
   const { user } = useAuth;
   const router = useRouter();
   const scheme = useColorScheme();
   const isDarkMode = scheme === "dark";
   const mode = themeMode[scheme] || themeMode.light;

   const [userData, setUserData] = useState("");
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);

   const getProfileData = async () => {
      setLoading(true);
      const res = await getUserData(item?.id);
      if (res.success) {
         setUserData(res.data);
      }
      const resPosts = await fetchPosts(10, item?.id);
      if (resPosts.success) {
         setPosts(resPosts.data);
      }
      setLoading(false);
   };

   const openPostDetails = async (id) => {
      router.push({ pathname: "postDetails", params: { postId: id } });
   };

   const openChatRoom = () => {
      router.push({ pathname: "/chatRoom", params: item });
   };

   useEffect(() => {
      getProfileData();
   }, []);

   return (
      <ScreenWrapper bg={mode.colors.bgColor}>
         <View style={{ marginLeft: wp(4) }}>
            <Header showBackButton={true} />
         </View>
         {loading ? (
            <View style={{ flex: 1, alignItems: "center", marginTop: hp(10) }}>
               <Loading size={hp(8)} color={mode.colors.text} />
            </View>
         ) : (
            <View style={{ flex: 1 }}>
               <View style={[{ flex: 5, backgroundColor: mode.colors.bgColor, paddingHorizontal: wp(4) }]}>
                  <View style={styles.container}>
                     <View style={{ gap: 15, flexDirection: "row", alignItems: "center" }}>
                        {/* avatar */}
                        <View style={styles.avatarContainer}>
                           <Avatar uri={userData?.image} size={hp(12)} rounded={mode.radius.xxl * 1.4} />
                        </View>

                        {/* username and address */}
                        <View style={{ gap: 5 }}>
                           <Text style={[styles.userName, { color: mode.colors.text }]}>{userData && userData.name} {userData?.faculty == "faculty" && <FontAwesome5 name="chalkboard-teacher" size={20} color={theme.colors.gray} />}</Text>
                           {userData && userData?.bio && <Text style={styles.infoText}>{userData && userData.bio}</Text>}
                           {userData && userData.course && <Text style={styles.infoText}>{userData.course + " " + userData.batch}</Text>}
                        </View>
                     </View>
                     {/* email , bio, phone NO*/}
                     <View style={{ gap: 10, marginTop: 20 }}>
                        <View style={styles.info}>
                           <Icon name="location" size={20} color={mode.colors.textLight} />
                           <Text style={styles.infoText}>{userData && userData.address}</Text>
                        </View>

                        <View style={styles.info}>
                           <Icon name="mail" size={20} color={mode.colors.textLight} />
                           <Text style={styles.infoText}>{userData && userData.email}</Text>
                        </View>

                        {userData && userData.phoneNumber && (
                           <View style={styles.info}>
                              <Icon name="call" size={20} color={mode.colors.textLight} />
                              <Text style={styles.infoText}>+91{userData && userData.phoneNumber}</Text>
                           </View>
                        )}
                        <Button title="Send Message" buttonStyle={styles.buttonStyle} textStyle={styles.textStyle} onPress={openChatRoom} />
                     </View>
                  </View>
               </View>
               <View style={{ flex: 8, backgroundColor: mode.colors.bgColor }}>
                  {posts?.length != 0 ? (
                     <FlatList
                        data={posts}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listStyle}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        renderItem={({ item }) => (
                           <TouchableOpacity onPress={() => openPostDetails(item?.id)}>
                              <Image source={getUserImageSrc(item?.file)} transition={100} style={styles.image} />
                           </TouchableOpacity>
                        )}
                        onEndReachedThreshold={0}
                        // onEndReached={() => {
                        //    getPosts();
                        // }}
                        // ListFooterComponent={
                        //    hasMore && (
                        //       <View style={{ alignItems: "center", marginVertical: posts?.length == 0 ? hp(30) : 30 }}>
                        //          <Loading size={hp(5)} />
                        //       </View>
                        //    )
                        // }
                     />
                  ) : (
                     <View style={styles.noPostsContainer}>
                        <Feather name="camera-off" size={hp(6)} color="gray" />
                        <Text style={[styles.noPosts]}>No posts yet</Text>
                     </View>
                  )}
               </View>
            </View>
         )}
      </ScreenWrapper>
   );
};

export default profileView;

const styles = StyleSheet.create({
   image: {
      width: wp(30),
      height: hp(20),
      margin: 5,
      borderRadius: theme.radius.lg,
      resizeMode: "cover",
   },
   container: {
      flex: 1,
      padding: 10,
   },
   avatarContainer: {
      height: hp(12),
      width: hp(12),
      alignSelf: "center",
   },

   infoText: {
      fontSize: hp(1.6),
      fontWeight: "500",
      color: theme.colors.textLight,
   },

   userName: {
      fontSize: hp(3),
      fontWeight: "600",
   },

   info: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
   },
   listStyle: {
      paddingBottom: hp(12),
   },
   buttonStyle: {
      marginTop: hp(2),
      height: hp(5),
      width: wp(40),
      padding: 0,
   },
   textStyle: {
      fontSize: hp(2.2),
      fontWeight: "500",
   },
   noPostsContainer: {
      borderTopColor : theme.colors.textLight,
      borderTopWidth : 0.5,
      padding : 20,
      marginHorizontal : wp(4),
      alignItems : "center",
      justifyContent : "center",
      paddingTop : hp(10),
      gap : 10,
   },
   noPosts: {
      fontSize: hp(3),
      fontWeight: "600",
      color: theme.colors.text,
   },
});
