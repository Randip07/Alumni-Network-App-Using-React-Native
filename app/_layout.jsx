import { LogBox, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import "../global.css";
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getUserData } from '@/services/userServices';
import "react-native-url-polyfill/auto";

// LogBox.ignoreAllLogs(["Warning: TNodeChildrenRenderer", "Warning: MemoizedTNodeRenderer", "Warning: TRenderEngineProvider"])
const _layout = () => {
  return(
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}


const MainLayout = () => {
  const isDarkMode = useColorScheme() === "dark";
  const {setAuth, setUserData} = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {

      if(session){
        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace("/home");
      }else{
        setAuth(null);
        router.dismissAll();
        router.replace("/welcome");
      }

    })
  }, [])

  const updateUserData = async (user) => {
    let res = await getUserData(user?.id);
    if(res.success){
      setUserData(res?.data);
    }
  }

  return (
    <Stack 
    screenOptions={ 
       { headerShown : false}
    }>
      <Stack.Screen
      name='postDetails'
      options={{
        presentation : "modal",
        contentStyle: {
          backgroundColor: isDarkMode ? "black" : "white",  // background for screen area
        },
      }}

      />
      <Stack.Screen
      name='chatRoom'
      />
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})