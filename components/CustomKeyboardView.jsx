import { View, Text, Platform , ScrollView, KeyboardAvoidingView} from 'react-native'
import React from 'react'

const CustomKeyboardView = ({children , inChat}) => {
    const ios = Platform.OS == 'ios';
    let kevConfig = {}
    let scrollviewConfig = {}

    if(inChat){
      scrollviewConfig = {contentContainerStyle : {flex: 1}}
    }


  return (
    <KeyboardAvoidingView
        behavior={ios ? 'padding' : 'height'}
        style={{flex: 1 , backgroundColor: 'black'}}
       {...kevConfig}

    >
        <ScrollView
         style={{flex: 1}}
         bounces = {false}
         showsVerticalScrollIndicator = {false}
         {...scrollviewConfig}
         keyboardShouldPersistTaps = "handled"
        >
            {children}
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CustomKeyboardView