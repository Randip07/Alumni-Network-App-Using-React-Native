import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import themeMode from "@/constants/themeMode";
import { hp, wp } from "@/helpers/common";
import ButtonII from "./ButtonII";
import Icon from "@/assets/icons";

const EventCard = () => {
   const scheme = useColorScheme();
   const mode = themeMode[scheme] || themeMode.light;
   const source =
      "https://img.freepik.com/premium-vector/programming-web-banner-best-programming-languages-social-media-creative-concept-idea-desktop-pc_122058-1961.jpg?semt=ais_hybrid&w=740";
   return (
      <View style={styles.container}>
         <Image style={styles.bannerImage} source={source} />
         <View style={styles.detailsContainer}>
            <Text style={[styles.description, { color: mode.colors.textLight }]}>May 26 09:00 AM</Text>
            <Text style={[styles.title, { color: mode.colors.text }]}>Ui/UX Design Development</Text>
            <Text style={[styles.description, { color: mode.colors.textLight }]}>
               UI/UX refers to the design and experience aspects of digital products like websites, apps....
            </Text>
            <View style={styles.eventAddress}>
               <Icon name="location" size={20} />
               <Text style={[styles.description, { color: mode.colors.textLight }]}> Assam Don Bosco University, Azara</Text>
            </View>
            <View style={styles.footer}>
               <ButtonII title="more details" buttonStyle={styles.buttonStyle} />
               <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Icon name="user" size={20} />
                  <Text style={[styles.description, { color: mode.colors.textLight }]}>200+</Text>
               </View>
            </View>
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
   },
   bannerImage: {
      width: "100%",
      height: 200,
      borderRadius: 10,
   },
   detailsContainer: {
      paddingHorizontal: wp(2),
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
