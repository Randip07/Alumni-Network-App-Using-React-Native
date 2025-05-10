import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchNotificationDetails } from "@/services/notificationService";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import NotificationItem from "@/components/NotificationItem";
import Header from "@/components/Header";

const Notifications = () => {
   const [notifications, setNotifications] = useState([]);
   const { user } = useAuth();
   const router = useRouter();

   useEffect(() => {
      getNotifications();
   }, []);

   const getNotifications = async () => {
      let res = await fetchNotificationDetails(user?.id);

      if(res.success) setNotifications(res.data)
   };

   return (
      <ScreenWrapper>
         <View style = {styles.container}>
          <Header title = "Notifications"/>
          {
              notifications.length == 0 && (
                <View style = {styles.noData}>
                  <Text style = {styles.noDataText}>No notifications</Text>
                </View>
              )
            }
          <ScrollView
          showsVerticalScrollIndicator = {false}
          contentContainerStyle = {styles.listStyle}>

            {
              notifications.map(item=>{
                return (
                  <NotificationItem
                  item = {item}
                  key = {item.id}
                  router = {router}
                  />
                )
              })
            }

            
          </ScrollView>
         
         </View>

      </ScreenWrapper>
   );
};

export default Notifications;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: wp(4),
   },
   listStyle: {
      paddingVertical: 20,
      gap: 10,
   },
   noData: {
    marginTop : hp(30)
   },

   noDataText : {
      fontSize: hp(1.8),
      fontWeight: theme.fonts.medium,
      color: theme.colors.text,
      textAlign: "center",
   }
});
