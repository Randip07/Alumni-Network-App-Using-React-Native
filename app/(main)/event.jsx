import { FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import themeMode from "@/constants/themeMode";
import { hp, wp } from "@/helpers/common";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import { fetchEvents } from "@/services/postService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/constants/theme";

const Event = () => {
   const isDarkMode = useColorScheme() === "dark";
   const mode = isDarkMode ? themeMode.dark : themeMode.light;
   const router = useRouter();
   const [events, setEvents] = useState([]);
   const [notificationCount, setNotificationCount] = useState(0);
   const {user} = useAuth();

   useEffect(() => {
      getEvents();
   }, []);

   const getEvents = async () => {
      const res = await fetchEvents(10);

      if (res.success) {
         setEvents(res.data);
      }
   };

   const handlePostEvent = async (payload) => {
      if (payload.eventType == "INSERT" && payload?.new?.id) {
         let newPost = { ...payload.new };
         setEvents((prevPost) => [newPost, ...prevPost]);
      }

      if (payload.eventType == "DELETE" && payload?.old?.id) {
         setEvents((prevPosts) => {
            let updatedPosts = prevPosts.filter((prevPost) => prevPost.id != payload?.old?.id);
            return updatedPosts;
         });
      }
   };

   const handleEventRequest = (payload)=>{
      if (payload.eventType == "UPDATE" && payload?.new?.id) {
         setEvents((prevPosts) => {
            let updatedPosts = prevPosts.map((post) => {
               if (post.requestId.id == payload.new.id) {
                  post.requestId = payload.new
               }
               return post;
            });
            return updatedPosts;
         });
      }
   }

   const handleNewNotifications = (payload) => {
      if (payload.eventType == "INSERT" && payload.new.id) {
         setNotificationCount((prev) => prev + 1);
      }
   };

   useEffect(() => {
      let eventChannel = supabase.channel("events").on("postgres_changes", { event: "*", schema: "public", table: "events" }, handlePostEvent).subscribe();
      let eventRequestChannel = supabase.channel("eventRequest").on("postgres_changes", { event: "UPDATE", schema: "public", table: "eventRequest" }, handleEventRequest).subscribe();
      let notificationChannel = supabase
               .channel("eventNotifications")
               .on("postgres_changes", { event: "INSERT", schema: "public", table: "eventNotifications", filter: `receiverId=eq.${user.id}` }, handleNewNotifications)
               .subscribe();

      // getPosts();

      return () => {
         supabase.removeChannel(eventChannel);
         supabase.removeChannel(eventRequestChannel);
         supabase.removeChannel(notificationChannel);
      };
   }, []);
   return (
      <ScreenWrapper bg={mode.colors.bgColor}>
         <View style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.heading}>Events</Text>
               <View style ={{flexDirection : "row", gap : 20}}>
                  <Pressable
                  onPress={() => {
                     router.push("newEvent");
                  }}
               >
                  <Icon name="plus" size={hp(3.2)} color={mode.colors.primary} strokeWidth={2} />
               </Pressable>
               <Pressable
                  onPress={() => {
                     setNotificationCount(0);
                     router.push("eventNotifications");
                  }}
               >
                  <Icon name="heart" size={hp(3.2)} color={mode.colors.primary} strokeWidth={2} />
                  {notificationCount > 0 && (
                     <View style={styles.pill}>
                        <Text style={styles.pillText}>{notificationCount}</Text>
                     </View>
                  )}
               </Pressable>
               </View>
            </View>
            <FlatList
               data={events}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.listStyle}
               keyExtractor={(item) => item.id.toString()}
               renderItem={({ item }) => <EventCard item={item} />}
            />
            {/* <EventCard /> */}
         </View>
      </ScreenWrapper>
   );
};

export default Event;

const styles = StyleSheet.create({
   listStyle: {
      // paddingTop: 20,
      paddingBottom: hp(12),
   },
   container: {
      paddingHorizontal: wp(6),
      gap: 10,
      marginBottom: hp(10),
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: hp(2),
   },
   heading: {
      color: "white",
      fontSize: hp(5),
      fontWeight: 700,
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
