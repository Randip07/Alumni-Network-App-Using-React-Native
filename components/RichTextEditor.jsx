import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { theme } from "@/constants/theme";

const RichTextEditor = ({ editorRef, onChangeText }) => {
   return (
      <View style={{ minHeight: 285}}>
         <RichToolbar
            actions={[
               actions.setBold,
               actions.setItalic,
               actions.insertBulletsList,
               actions.insertOrderedList,
               actions.setStrikethrough,
               actions.setUnderline,
            ]}
            style = {styles.richBar}
            flatContainerStyle = {styles.flatStyle}
            selectedIconTint = {theme.colors.primaryDark}
            editor = {editorRef}
            disabled = {false}
         />

         <RichEditor
            ref={editorRef}
            containerStyle = {styles.rich}
            editorStyle={styles.contentStyle}
            placeholder="Write your caption..."
            onChange={onChangeText}
         />
      </View>
   );
};

export default RichTextEditor;

const styles = StyleSheet.create({
    richBar : {
        borderTopLeftRadius : theme.radius.xl,
        borderTopRightRadius : theme.radius.xl,
        backgroundColor : theme.colors.gray,
        paddingTop : 5
    },

    rich: {
        minHeight: 100, 
        flex: 1, 
        borderWidth: 1.5, 
        borderTopWidth: 0, 
        borderBottomLeftRadius: theme.radius.xl, 
        borderBottomRightRadius: theme.radius.xl, 
        borderColor: theme.colors.gray,
        padding : 5
    },

    contentStyle : {
        color : theme.colors.textDark,
        placeholderColor : "gray"
    },

    flatStyle : {
        paddingHorizontal : 8,
        gap : 5
    }
});
