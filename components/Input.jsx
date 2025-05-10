import { StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import React from 'react'
import { hp } from '@/helpers/common'
import { theme } from '@/constants/theme'

const Input = (props) => {
    const isDarkMode = useColorScheme() === "dark"

  return (
    <View style = {[styles.container, props.containerStyle && props.containerStyle, {borderWidth : isDarkMode ? 1 : 0.4}]}>
        {
            props.icon && props.icon
        }

        <TextInput
            style = {{flex : 1, fontSize : hp(1.8), height : "100%", color : isDarkMode ? "white" : "black"}}
            placeholderTextColor={ theme.colors.textLight }
            ref={ props.inputRef && props.inputRef}
            {...props}
        />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container : {
        flexDirection : "row",
        height : hp(7.2),
        alignItems : "center",
        justifyContent : "center",
        borderWidth : 0.4,
        borderColor : theme.colors.text,
        borderRadius : theme.radius.xxl,
        borderCurve : "continuous",
        paddingHorizontal : 18,
        gap : 12
    }
})