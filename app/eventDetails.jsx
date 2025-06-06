import { Alert, Pressable, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import themeMode from "@/constants/themeMode";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import dateFormat from "dateformat";
import { getSupabaseFileUrl } from "@/services/imageService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchEvents } from "@/services/postService";
import Loading from "@/components/Loading";
import BackButton from "@/components/BackButton";
import { getUserData } from "@/services/userServices";
import Avatar from "@/components/Avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const EventDetails = () => {
   const scheme = useColorScheme();
   const mode = themeMode[scheme] || themeMode.light;
   const {user} = useAuth();

   const router = useRouter();

   const [item, setItem] = useState();
   const [faculty, setFaculty] = useState();
   const [owner, setOwner] = useState();
   const [loading, setLoading] = useState(true);

   const { eventId } = useLocalSearchParams();

   const getItemDetails = async () => {
      const response = await fetchEvents(1, eventId);

      if (response.success) {
         const facData = await getUserData(response?.data?.faculty, true);
         const ownerData = await getUserData(response?.data?.userId, true);
         setItem(response?.data);
         setFaculty(facData?.data);
         setOwner(ownerData?.data);
      }
   };

   useEffect(() => {
      setLoading(true);
      getItemDetails();
      setTimeout(() => {
         setLoading(false);
      }, 800);
   }, []);

   const reload = ()=>{
      setLoading(true);
      getItemDetails();
      setTimeout(() => {
         setLoading(false);
      }, 800);
   }

   const approveReq = async () => {
      
      
      const data = {
         status: "approved",
      };
      const { error } = await supabase.from("eventRequest").update(data).eq("id", item.requestId.id);
      if(!error){
         reload();
      }
   };

   const rejectReq = async () => {
      const data = {
         status: "approved",
      };
      const { error } = await supabase.from("eventRequest").update(data).eq("id", item.requestId.id);
      if(!error){
         reload();
      }
   };

   const onApprove = async () => {
      Alert.alert("Confirm", "Are you sure you want to approve?", [
         {
            text: "Approve",
            onPress: () => approveReq(),
            style: "Cancel",
         },
         {
            text: "Cancel",
            onPress: () => {},
            style: "destructive",
         },
      ]);
   };

   const onReject = async () => {
      Alert.alert("Confirm", "Are you sure you want to reject?", [
         {
            text: "Reject",
            onPress: () => rejectReq(),
            style: "destructive",
         },
         {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
         },
      ]);
   };


   return (
      <View>
         {!loading && (
            <View style={styles.container}>
               <BackButton router={router} size={30} />
               <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(10) }} style={{ width: "100%" }}>
                  <Image style={styles.bannerImage} source={getSupabaseFileUrl(item?.file)} />
                  {item?.requestId?.status == "requested" && item?.faculty == user?.id && <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", marginTop: hp(3) }}>
                     <TouchableOpacity style={styles.approve} onPress={onApprove}>
                        <Text style={{ fontSize: hp(2), fontWeight: "600", color: "green" }}>Approve</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.reject} onPress={onReject}>
                        <Text style={{ fontSize: hp(2), fontWeight: "600", color: "red", opacity: "0.8" }}>Reject</Text>
                     </TouchableOpacity>
                  </View>}
                  <View style={styles.detailsContainer}>
                     <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row" }}>
                        <Text style={[styles.description, { color: mode.colors.textLight }]}>{dateFormat(item?.startDate, "dddd dS mmmm h:MM TT")}</Text>
                        <Text style={[styles.description, { color: mode.colors.textLight }]}>{item?.totalHour}hrs+</Text>
                     </View>
                     <Text style={[styles.title, { color: mode.colors.text }]}>{item?.title}</Text>
                     <Text style={[styles.description, { color: mode.colors.textLight }]}>{item?.description}</Text>
                     <View style={styles.eventAddress}>
                        <Icon name="location" size={20} />
                        <Text style={[styles.description, { color: mode.colors.textLight }]}> {item?.location}</Text>
                     </View>
                     <Text style={{ color: mode.colors.text, fontSize: hp(2), fontWeight: mode.fonts.bold, marginTop: hp(2) }}>Organized By</Text>
                     <View style={styles.organizerCon}>
                        <View style={styles.organizerdCard}>
                           <Avatar uri={owner?.image} rounded={mode.radius.xxl} />
                           <Text style={[styles.organizer, { color: mode.colors.textLight }]}>{owner?.name}</Text>
                        </View>
                        <View style={styles.organizerdCard}>
                           <Avatar uri={faculty?.image} rounded={mode.radius.xxl} />
                           <Text style={[styles.organizer, { color: mode.colors.textLight }]}>{faculty?.name}</Text>
                        </View>
                     </View>
                  </View>
               </ScrollView>
            </View>
         )}
         {loading && (
            <View style={{ flex: 1, marginTop: hp(15), alignItems: "center" }}>
               <Loading size={hp(7)} />
            </View>
         )}
      </View>
   );
};

export default EventDetails;

const styles = StyleSheet.create({
   container: {
      paddingBottom: hp(2),
      alignItems: "flex-start",
      marginBottom: hp(4),
      paddingHorizontal: wp(2),
   },
   bannerImage: {
      width: "100%",
      height: 200,
      borderRadius: 10,
      marginTop: hp(2),
   },
   detailsContainer: {
      // paddingHorizontal: wp(1),
      marginTop: hp(2),
      gap: 10,
      alignItems: "flex-start",
   },
   title: {
      fontSize: hp(4),
      fontWeight: "bold",
   },
   description: {
      fontSize: hp(1.6),
      textAlign: "justify",
      verticalAlign: "center",
      paddingRight: wp(2),
   },
   buttonStyle: {
      marginTop: hp(1),
      height: hp(5),
      marginHorizontal: 0,
   },
   eventAddress: {
      flexDirection: "row",
      alignItems: "center",
   },
   footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
   },

   organizerCon: {
      flex: 1,
      flexDirection: "row",
      gap: 20,
   },

   organizerdCard: {
      alignItems: "center",
      maxWidth: 100,
      gap: 10,
   },
   organizer: {
      textAlign: "center",
   },

   approve: {
      borderColor: "green",
      borderWidth: 1,
      paddingHorizontal: wp(5),
      paddingVertical: hp(2),
      borderRadius: 10,
      width: "40%",
      alignItems: "center",
   },
   reject: {
      borderColor: "red",
      borderWidth: 1,
      paddingHorizontal: wp(5),
      paddingVertical: hp(2),
      borderRadius: 10,
      width: "40%",
      alignItems: "center",
   },
});
