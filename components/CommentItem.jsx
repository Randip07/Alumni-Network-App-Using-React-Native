import { Alert, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";
import { useAuth } from "@/context/AuthContext";
import themeMode from "@/constants/themeMode";

const CommentItem = ({item , canDelete = false, onDelete= ()=>{} , highlight = false}) => {

    const scheme = useColorScheme()
       const isDarkMode = scheme === "dark";
       const mode = themeMode[scheme] || themeMode.light;
    const handleDelete = () => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete?", [
            {
                text : "Cancel",
                onPress : ()=> {},
                style : "cancel"
            },
            {
                text : "Delele",
                onPress : ()=> onDelete(item),
                style : "destructive"
            },

        ])
    }
   return (
      <View style = {styles.container}>
        <Avatar uri={item?.user?.image} style={{borderRadius : theme.radius.xxl}}/>

        <View style = {[styles.content, highlight && styles.highlight]}>
            <View style = {{flexDirection : "row", justifyContent : "space-between", alignItems : 'center'}}>
                <View style = {styles.nameContainer}>
                    <Text style = {[styles.text, {color : mode.colors.text}]}>{item?.user?.name}</Text>
                    <Text style = {[{color : mode.colors.text}]}>•</Text>
                    <Text style = {[styles.text, {color : theme.colors.textLight, fontSize : hp(1.3)}]}>{moment(item?.created_at).format("MMM D")}</Text>
                </View>
                {
                    canDelete && (
                        <TouchableOpacity onPress={handleDelete}>
                            <Icon name="delete" size = {20} color = {theme.colors.rose}/>
                        </TouchableOpacity>
                    )
                }
            </View>
            
            <Text style = {[styles.text, {fontWeight  : 'normal', color : mode.colors.text}]}>
                {item?.text}
            </Text>
        </View>
      </View>
   );
};

export default CommentItem;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: "row",
      gap: 7,
   },
   content: {
      backgroundColor: "rgba(0,0,0,0.06)",
      flex: 1,
      gap: 5,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: theme.radius.md,
      borderCurve: "continuous",
   },
   highlight: {
      borderWidth: 0.2,
      backgroundColor: "white",
      borderColor: theme.colors.dark,
      shadowColor: theme.colors.dark,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
   },
   nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent : "center",
      gap: 3,
   },
   text: {
      fontSize: hp(1.6),
      fontWeight: theme.fonts.medium,
      color: theme.colors.textDark,
   },
});
