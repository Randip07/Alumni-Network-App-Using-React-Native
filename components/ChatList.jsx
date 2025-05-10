import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import { useRouter } from 'expo-router'
import ScreenWrapper from './ScreenWrapper'
import { hp, wp } from '@/helpers/common'


const ChatList = ({users, currUser}) => {
    const router = useRouter();
  return (
      <View style = {styles.container}>
        <FlatList
            data={ users }
            keyExtractor={item => Math.random()}
            contentContainerStyle = {styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
                <ChatItem item = {item} index = {index} noBorder = {index+1 == users.length}
                router = {router}
                currUser={currUser}
                />
            )}
        />
    </View>
  )
}

export default ChatList

const styles = StyleSheet.create({
  container : {
    flex : 1,
    paddingHorizontal : wp(4),
  },
  list : {
    gap : hp(2),
  }
})