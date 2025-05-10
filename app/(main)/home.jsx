import { Button, FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import Loading, { LoadingI, LoadingII } from "@/components/Loading";
import { getUserData } from "@/services/userServices";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/constants/theme";
import themeMode from "@/constants/themeMode";

let limit = 0;
const Home = () => {
   const scheme = useColorScheme();
   const isDarkMode = scheme === "dark";
   const mode = themeMode[scheme] || themeMode.light;

   const { user, setAuth } = useAuth();
   const router = useRouter();
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [hasMore, setHasMore] = useState(true);
   const [notificationCount, setNotificationCount] = useState(0);

   const handlePostEvent = async (payload) => {
      setLoading(true);
      if (payload.eventType == "INSERT" && payload?.new?.id) {
         let newPost = { ...payload.new };
         let res = await getUserData(newPost.userId);
         newPost.postsLike = [];
         newPost.comments = [{ count: 0 }];
         newPost.user = res.success ? res.data : {};
         setPosts((prevPost) => [newPost, ...prevPost]);
      }

      if (payload.eventType == "DELETE" && payload?.old?.id) {
         setPosts((prevPosts) => {
            let updatedPosts = prevPosts.filter((prevPost) => prevPost.id != payload?.old?.id);
            return updatedPosts;
         });
      }

      if (payload.eventType == "UPDATE" && payload?.new?.id) {
         setPosts((prevPosts) => {
            let updatedPosts = prevPosts.map((post) => {
               if (post.id == payload.new.id) {
                  post.body = payload.new.body;
                  post.file = payload.new.file;
               }
               return post;
            });
            return updatedPosts;
         });
      }
   };

   const handleNewNotifications = (payload) => {
      if (payload.eventType == "INSERT" && payload.new.id) {
         setNotificationCount((prev) => prev + 1);
      }
   };

   const handleLikeEvent = (payload) => {
      if (payload.eventType == "INSERT" && payload.new.id) {
         setPosts((prevPosts) => {
            let updatedPosts = prevPosts.map((post) => {
               if (post.id == payload.new.postId) {
                  post.postsLike.push(payload.new);
               }
               return post;
            });
            return updatedPosts;
         });
      }

      if (payload.eventType == "DELETE" && payload.old.id) {
         setPosts((prevPosts) => {
            const updatedPosts = prevPosts.map((prevPost) => {
               // Create a new post object to keep things immutable
               const postsLike = prevPost.postsLike.filter((item) => item?.id !== payload?.old?.id);
               
               // Return the updated post with the modified likes array
               return { ...prevPost, postsLike};
             });
         
             console.log(updatedPosts[0].postsLike);
             
             return updatedPosts;
         });
      }

      
   };

   const refreshApp = () => {
      limit = 0;
      setLoading(true);
      setTimeout(() => {
         setHasMore(true);
         setPosts([]);
         getPosts(limit);
         setLoading(false);
      }, 2000);
   };

   useEffect(() => {
      let postChannel = supabase.channel("posts").on("postgres_changes", { event: "*", schema: "public", table: "posts" }, handlePostEvent).subscribe();

      let notificationChannel = supabase
         .channel("notifications")
         .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `receiverId=eq.${user.id}` }, handleNewNotifications)
         .subscribe();

      // for like and unlike
      let likeChannel = supabase.channel("postsLike").on("postgres_changes", { event: "*", schema: "public", table: "postsLike" }, handleLikeEvent).subscribe();

      // getPosts();

      return () => {
         supabase.removeChannel(postChannel);
         supabase.removeChannel(notificationChannel);
         supabase.removeChannel(likeChannel);
      };
   }, []);

   const getPosts = async () => {
      if (!hasMore) return null;

      limit = limit + 5;
      let res = await fetchPosts(limit);

      // console.log(limit);

      if (res.success) {
         if (posts.length == res.data.length) setHasMore(false);
         setPosts(res.data);
      }
   };

   return (
      <ScreenWrapper bg={mode.colors.bgColor}>
         <StatusBar style={isDarkMode ? "light" : "dark"} />
         <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
               <Pressable onPress={() => refreshApp()}>
                  <Text style={[styles.title, { color: mode.colors.text }]}>GradNet</Text>
               </Pressable>

               {/* Icons */}
               <View style={styles.icons}>
                  <Pressable
                     onPress={() => {
                        router.push("newPost");
                     }}
                  >
                     <Icon name="plus" size={hp(3.2)} color={mode.colors.primary} strokeWidth={2} />
                  </Pressable>
                  <Pressable
                     onPress={() => {
                        setNotificationCount(0);
                        router.push("notifications");
                     }}
                  >
                     <Icon name="heart" size={hp(3.2)} color={mode.colors.primary} strokeWidth={2} />
                     {notificationCount > 0 && (
                        <View style={styles.pill}>
                           <Text style={styles.pillText}>{notificationCount}</Text>
                        </View>
                     )}
                  </Pressable>

                  {/* <Pressable onPress={()=> {router.push("profile")}}>
                        <Avatar
                            uri={user?.image}
                            size={hp(4.3)}
                            rounded={theme.radius.sm}
                            style={{borderWidth : 2}}
                        />
                    </Pressable> */}
               </View>
            </View>

            {/* posts */}

            {loading && (
               <View style={styles.refreshLoading}>
                  <Loading size={hp(5)} />
               </View>
            )}

            <FlatList
               data={posts}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.listStyle}
               keyExtractor={(item) => item.id.toString()}
               renderItem={({ item }) => <PostCard item={item} currentUser={user} router={router} hasShadow={isDarkMode ? true : false} />}
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
                        <Text style={styles.noPost}>No more posts</Text>
                     </View>
                  )
               }
            />
         </View>
      </ScreenWrapper>
   );
};

export default Home;

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      marginHorizontal: wp(4),
   },

   title: {
      color: theme.colors.text,
      fontSize: hp(3.5),
      fontWeight: theme.fonts.bold,
   },

   icons: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
   },

   listStyle: {
      paddingTop: 20,
      paddingBottom: hp(12),
   },

   refreshLoading: {
      alignItems: "center",
      position: "absolute",
      top: 30,
      zIndex: 1000,
      alignSelf: "center",
      backgroundColor: "transparent",
   },

   noPost: {
      fontSize: hp(2),
      textAlign: "center",
      color: theme.colors.gray,
      fontWeight: theme.fonts.semibold,
   },

   pill: {
      position: "absolute",
      right: -10,
      top: -4,
      height: hp(2.2),
      width: hp(2.2),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: theme.colors.roseLight,
   },
   pillText: {
      color: "white",
      fontSize: hp(1.2),
      fontWeight: theme.fonts.bold,
   },
});
