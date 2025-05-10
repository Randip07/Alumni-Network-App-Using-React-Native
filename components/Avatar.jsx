import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp } from '@/helpers/common'
import { Image } from 'expo-image'
import { getUserImageSrc } from '@/services/imageService'
import { theme } from '@/constants/theme'

const Avatar = ({
    uri,
    size = hp(4.5),
    rounded = theme.radius.md,
    style = {}
}) => {
  return (
    <View>
        <Image
            source={getUserImageSrc(uri)}
            transition={100}
            style={[styles.avatar, {width : size, height : size, borderRadius : rounded}, style]}
        />
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({
    avatar :  {
        borderCurve : "continuous",
        borderColor : theme.colors.darkLight
    }
})