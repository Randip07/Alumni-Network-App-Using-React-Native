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

const Event = () => {
   const isDarkMode = useColorScheme() === "dark";
   const mode = isDarkMode ? themeMode.dark : themeMode.light;
   const router = useRouter();
   const [events, setEvents] = useState([]);

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
         setEvents((prevPost)=>[newPost, ...prevPost]);
      }

      if (payload.eventType == "DELETE" && payload?.old?.id) {
         setEvents((prevPosts) => {
            let updatedPosts = prevPosts.filter((prevPost) => prevPost.id != payload?.old?.id);
            return updatedPosts;
         });
      }

      if (payload.eventType == "UPDATE" && payload?.new?.id) {
         setEvents((prevPosts) => {
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
   useEffect(() => {
      let eventChannel = supabase.channel("events").on("postgres_changes", { event: "*", schema: "public", table: "events" }, handlePostEvent).subscribe();

      // getPosts();

      return () => {
         supabase.removeChannel(eventChannel);
      };
   }, []);
   return (
      <ScreenWrapper bg={mode.colors.bgColor}>
         <View style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.heading}>Events</Text>
               <Pressable
                  onPress={() => {
                     router.push("newEvent");
                  }}
               >
                  <Icon name="plus" size={hp(3.2)} color={mode.colors.primary} strokeWidth={2} />
               </Pressable>
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
});
