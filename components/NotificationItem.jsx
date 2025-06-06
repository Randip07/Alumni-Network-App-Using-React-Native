import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import themeMode from "@/constants/themeMode";

const NotificationItem = ({router, item}) => {
     const scheme = useColorScheme()
    const mode = themeMode[scheme] || themeMode.light;

    const handleClick = ()=>{
        let {eventId} = JSON.parse(item?.data)
        router.push({pathname : "eventDetails", params : {eventId}})
    }

   return (
      <TouchableOpacity style = {[styles.container, {backgroundColor : mode.colors.bgColor}]} onPress={handleClick}>
        <Avatar uri={item?.sender?.image} size={hp(5)}/>
        <View style = {styles.nameTitle}>
            <Text style = {[styles.text, {color : mode.colors.text}]}>
                {item?.sender?.name}
            </Text>
            <Text style = {[styles.text, {color : theme.colors.textLight}]}>
                {item?.title}
            </Text>
        </View>
        <Text style = {[styles.text, {color : theme.colors.textLight}]}>
            {moment(item?.created_at).format("MMM d")}
        </Text>

      </TouchableOpacity>
   );
};

export default NotificationItem;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      backgroundColor: "white",
      borderWidth: 0.5,
      borderColor: theme.colors.darkLight,
      padding: 15,
      // paddingVertidal: 12,
      borderRadius: theme.radius.xxl,
      borderCurve: "continuous",
   },
   nameTitle: {
      flex: 1,
      gap: 2,
   },
   text: {
      fontSize: hp(1.6),
      fontWeight: theme.fonts.medium,
      color: theme.colors.text,
   },
});
