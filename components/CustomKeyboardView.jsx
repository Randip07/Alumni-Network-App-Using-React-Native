import { View, Text, Platform , ScrollView, KeyboardAvoidingView, useColorScheme} from 'react-native'
import React from 'react'

const CustomKeyboardView = ({children , inChat =false}) => {
    const ios = Platform.OS == 'ios';
    const isDarkMode = useColorScheme() === "dark"

    let kevConfig = {}
    let scrollviewConfig = {}

    if(inChat){
      scrollviewConfig = {contentContainerStyle : {flex: 1}}
    }


  return (
    <KeyboardAvoidingView
        behavior={ios ? 'padding' : 'height'}
        style={{flex: 1 , backgroundColor: isDarkMode ? "black" : "white"}}
       {...kevConfig}
    >
        <ScrollView
        style = {{flex : 1}}
         bounces = {false}
         showsVerticalScrollIndicator = {false}
         {...scrollviewConfig}
         keyboardShouldPersistTaps = "always"
        >
            {children}
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CustomKeyboardView