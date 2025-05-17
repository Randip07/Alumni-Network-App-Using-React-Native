import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import themeMode from "@/constants/themeMode";
import { hp, wp } from "@/helpers/common";
import ButtonII from "./ButtonII";
import Icon from "@/assets/icons";
import dateFormat from "dateformat";
import { getSupabaseFileUrl } from "@/services/imageService";

const EventCard = ({ item }) => {
   const scheme = useColorScheme();
   const mode = themeMode[scheme] || themeMode.light;

   return (
      <View style={styles.container}>
         <Image style={styles.bannerImage} source={getSupabaseFileUrl(item.file)} />
         <View style={styles.detailsContainer}>
            <Text style={[styles.description, { color: mode.colors.textLight }]}>{dateFormat(item.startDate, "dddd dS mmmm h:MM TT")}</Text>
            <Text style={[styles.title, { color: mode.colors.text }]}>{item?.title}</Text>
            <Text style={[styles.description, { color: mode.colors.textLight }]}>{item?.description.split(" ").splice(0,20).join(" ")}.........</Text>
            <View style={styles.eventAddress}>
               <Icon name="location" size={20} />
               <Text style={[styles.description, { color: mode.colors.textLight }]}> {item.location}</Text>
            </View>
            {/* <View style={styles.footer}>
               <ButtonII title="more details" buttonStyle={styles.buttonStyle} />
               <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Icon name="user" size={20} />
                  <Text style={[styles.description, { color: mode.colors.textLight }]}>200+</Text>
               </View>
            </View> */}
         </View>
      </View>
   );
};

export default EventCard;

const styles = StyleSheet.create({
   container: {
      borderWidth: 0.5,
      borderColor: "gray",
      borderRadius: 10,
      paddingBottom: hp(2),
      alignItems: "flex-start",
      marginBottom : hp(4)
   },
   bannerImage: {
      width: "100%",
      height: 200,
      borderRadius: 10,
   },
   detailsContainer: {
      paddingHorizontal: wp(2),
      marginTop: hp(2),
      gap: 10,
      alignItems: "flex-start",
   },
   title: {
      fontSize: hp(3),
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
});
