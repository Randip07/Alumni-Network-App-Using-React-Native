import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import BackButton from './BackButton';
import { hp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import themeMode from '@/constants/themeMode';

const Header = ({title , showBackButton = true , mb=10}) => {
    const scheme = useColorScheme();
    const mode = themeMode[scheme] || themeMode.light;
    const router = useRouter();

  return (
    <View style = { [styles.container, {marginBottom : mb}] }>
        {
            showBackButton && (
                <View style = {styles.backButton} >
                    <BackButton router={router} />
                </View>
            )       
        }

        <Text style = {[styles.title, {color : mode.colors.text}]}>
            {title || ""}
        </Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container : {
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
        marginTop : 5,
        gap : 10
    },

    title : {
        fontSize : hp(2.7),
        fontWeight : theme.fonts.semibold,
    },

    backButton : {
        position : "absolute",
        left : 0,
    }
})