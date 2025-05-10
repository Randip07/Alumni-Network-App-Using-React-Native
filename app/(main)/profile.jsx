import { Alert, FlatList, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import Avatar from "@/components/Avatar";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import themeMode from "@/constants/themeMode";
import { Image } from "expo-image";
import { getUserImageSrc } from "@/services/imageService";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

var limit = 10;
const Profile = () => {
   const scheme = useColorScheme();
   const mode = themeMode[scheme] || themeMode.light;

   const { user, setAuth } = useAuth();
   const router = useRouter();
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [hasMore, setHasMore] = useState(true);

   const faculty = "faculty";
   const logoutUser = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
         "Sign out", error.message;
      }

      setAuth(null);
   };

   const handleLogout = async () => {
      Alert.alert("Confirm", "Are you sure you want to log out?", [
         {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
         },
         {
            text: "Log out",
            onPress: () => logoutUser(),
            style: "destructive",
         },
      ]);
   };

   const getPosts = async () => {
      if (!hasMore) return null;

      limit = limit + 5;
      let res = await fetchPosts(limit, user?.id);

      // console.log(limit);

      if (res.success) {
         if (posts.length == res.data.length) setHasMore(false);
         setPosts(res.data);
      }
   };

   const openPostDetails = async (id) => {
      router.push({ pathname: "postDetails", params: { postId: id } });
   };

   useEffect(() => {
      getPosts(limit);
   }, []);

   const UserHeader = ({ user, router, handleLogout }) => {
      return (
         <View style={[{ flex: 1, backgroundColor: mode.colors.bgColor, paddingHorizontal: wp(4) }]}>
            <View>
               <Header title="Profile" mb={30} showBackButton={false} />
               <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Icon name="logout" color={mode.colors.rose} />
               </TouchableOpacity>
            </View>

            <View style={styles.container}>
               <View style={{ gap: 15, flexDirection: "row", alignItems: "center" }}>
                  {/* avatar */}
                  <View style={styles.avatarContainer}>
                     <Avatar uri={user?.image} size={hp(12)} rounded={mode.radius.xxl * 1.4} />
                     <Pressable
                        style={styles.editIcon}
                        onPress={() => {
                           router.push("editProfile");
                        }}
                     >
                        <Icon name="edit" strokeWidth={2} size={20} />
                     </Pressable>
                  </View>

                  {/* username and address */}
                  <View style={{ gap: 5 }}>
                     <Text style={[styles.userName, { color: mode.colors.text }]}>
                        {user && user.name + "  "}
                        {user?.faculty == "faculty" && <FontAwesome5 name="chalkboard-teacher" size={20} color={theme.colors.gray} />}
                     </Text>
                     {user && user.bio && <Text style={[styles.infoText, {marginLeft: 5}]}>{user.bio}</Text>}
                     {user && user.course && <Text style={[styles.infoText, {marginLeft: 5}]}>{user.course + " " + user.batch}</Text>}
                  </View>
               </View>
               {/* email , bio, phone NO*/}
               <View style={{ gap: 10, marginTop: 20 }}>
                  {user && user.address && (
                     <View style={styles.info}>
                        <Icon name="location" size={20} color={mode.colors.textLight} />
                        <Text style={styles.infoText}>{user && user.address}</Text>
                     </View>
                  )}

                  <View style={styles.info}>
                     <Icon name="mail" size={20} color={mode.colors.textLight} />
                     <Text style={styles.infoText}>{user && user.email}</Text>
                  </View>

                  {user && user.phoneNumber && (
                     <View style={styles.info}>
                        <Icon name="call" size={20} color={mode.colors.textLight} />
                        <Text style={styles.infoText}>+91{user && user.phoneNumber}</Text>
                     </View>
                  )}
               </View>
            </View>
         </View>
      );
   };

   return (
      <ScreenWrapper bg={mode.colors.bgColor}>
         {/* <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<UserHeader user={user} router={router} handleLogout={handleLogout} />}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PostCard item={item} currentUser={user} router={router} />}
            onEndReached={() => {
               getPosts();
            }}
            onEndReachedThreshold={0}
            ListFooterComponent={
               hasMore ? (
                  <View style={{ alignItems: "center", marginVertical: posts?.length == 0 ? hp(30) : 30 }}>
                     <Loading size={hp(5)} />
                  </View>
               ) : (
                  <View style={{ marginVertical: 30 }}>
                     <Text style={styles.noPosts}>No more posts</Text>
                  </View>
               )
            }
         /> */}
         <View style={[{ flex: 4.5, backgroundColor: mode.colors.bgColor }]}>
            <UserHeader user={user} router={router} handleLogout={handleLogout} />
         </View>
         <View style={{ flex: 8.5, backgroundColor: mode.colors.bgColor }}>
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
                  onEndReached={() => {
                     getPosts();
                  }}
                  // ListFooterComponent={
                  //    hasMore && (
                  //       <View style={{ alignItems: "center", marginVertical: posts?.length == 0 ? hp(30) : 30 }}>
                  //          <Loading size={hp(5)} />
                  //       </View>
                  //    )
                  // }
               />
            ) : (
               <View style = {styles.noPostsContainer}>
                  <Feather name="camera-off" size={hp(6)} color="gray" />
                  <Text style={[styles.noPosts]}>No posts yet</Text>
               </View>
            )}
         </View>
      </ScreenWrapper>
   );
};

export default Profile;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginBottom: hp(3),
   },
   avatarContainer: {
      height: hp(12),
      width: hp(12),
      alignSelf: "center",
   },
   editIcon: {
      position: "absolute",
      bottom: 0,
      right: -12,
      padding: 7,
      borderRadius: 50,
      backgroundColor: "white",
      shadowColor: theme.colors.textLight,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
      elevation: 7,
   },
   infoText: {
      fontSize: hp(1.6),
      fontWeight: "500",
      color: theme.colors.textLight,
   },
   logoutButton: {
      position: "absolute",
      right: 0,
      padding: 6,
      borderRadius: theme.radius.sm,
      backgroundColor: "#fee2e2",
   },
   listStyle: {
      // paddingHorizontal: wp(4),
      paddingBottom: hp(15),
   },
  

   userName: {
      fontSize: hp(3),
      fontWeight: "600",
      width: wp(60),
   },

   info: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
   },
   image: {
      width: wp(30),
      height: hp(20),
      margin: 5,
      borderRadius: theme.radius.lg,
      resizeMode: "cover",
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
