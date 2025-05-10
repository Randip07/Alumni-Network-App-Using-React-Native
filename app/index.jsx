import { Button, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { LoadingII } from '@/components/Loading';
import { hp, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';

const index = () => {
  const isDarkMode = useColorScheme() === "dark"

  const router = useRouter();
  return (
    <ScreenWrapper bg= { isDarkMode ? "black" : theme.lightMode.bgColor}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LoadingII/>
      </View>
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({})