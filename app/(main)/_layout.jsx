import { LogBox, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '@/components/TabBar'

LogBox.ignoreLogs(["Warning: TNodeChildrenRenderer", "Warning: MemoizedTNodeRenderer", "Warning: TRenderEngineProvider"])
const _layout = () => {
  return (
    <Tabs 
    tabBar={props => <TabBar {...props}/>}
    screenOptions={ { headerShown : false }}>
      <Tabs.Screen
        name = "home"
        options={{
          title : "Feed"
        }}
      />
      <Tabs.Screen
        name = "event"
        options={{
          title : "Events"
        }}
      />
      <Tabs.Screen
        name = "search"
        options={{
          title : "Search"
        }}
      />
      <Tabs.Screen
        name = "chat"
        options={{
          title : "Chat"
        }}
      />
      <Tabs.Screen
        name = "profile"
        options={{
          title : "Profile",
          headerShown : false
        }}
      />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})