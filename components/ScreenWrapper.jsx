import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';

const ScreenWrapper = ( {children , bg} ) => {

    const isDarkMode = useColorScheme() === "dark"
    const {top} = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 5 : 30;

    
  return (
    <View style={{ flex : 1, paddingTop, backgroundColor: bg}}>
      <StatusBar style={isDarkMode ? "light" : "dark"}/>
      {
        children
      }
    </View>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({})