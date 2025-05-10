import { View, Text } from "react-native";
import React from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { formatDate } from "@/helpers/common";
import { theme } from "@/constants/theme";

const MessageItem = ({ message, currentUser }) => {
   const emojiRegex = /^([\p{Emoji}\u200d\uFE0F]+)$/u;

   if (currentUser?.id == message?.userId) {
      return (
         <View className="flex-row justify-end mb-3 mr-3">
            <View style={{ width: wp(80) }}>
               <View className="flex-row self-end p-3 rounded-l-2xl" style = {{backgroundColor : theme.colors.primary}}>
                  <Text style={emojiRegex.test(message?.text) && message?.text.length <= 2 ? { fontSize: hp(8) } : { fontSize: hp(1.9) }} className="mr-3 text-white">
                     {message?.text}
                  </Text>
                  <Text style={{ fontSize: hp(1) }} className="self-end text-neutral-100">
                     {formatDate(new Date(message?.createdAt.seconds * 1000))}
                  </Text>
               </View>
            </View>
         </View>
      );
   } else {
      return (
         <View style={{ width: wp(80) }} className="mb-3 ml-3">
            <View style={{ width: wp(80) }}>
               <View className="flex-row self-start p-3 px-4 rounded-r-2xl bg-indigo-100">
                  <Text style={emojiRegex.test(message?.text) && message?.text.length <= 2 ? { fontSize: hp(8) } : { fontSize: hp(1.9) }}>{message?.text}</Text>
                  <Text style={{ fontSize: hp(1) }} className="self-end text-neutral-500 ml-3">
                     {formatDate(new Date(message?.createdAt.seconds * 1000))}
                  </Text>
               </View>
            </View>
         </View>
      );
   }
};

export default MessageItem;
