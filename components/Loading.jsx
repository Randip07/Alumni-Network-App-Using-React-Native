import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { theme } from "@/constants/theme";

const Loading = ({ size }) => {
   return (
      <View style={{ width: size, aspectRatio: 1}}>
         <LottieView source={require("../assets/images/MainScene.json")} autoPlay loop style={{ flex: 1, flexDirection : "column"}} />
      </View>
   );
};
export const LoadingI = ({ size }) => {
   return (
      <View style={{ width: size, aspectRatio: 1 }}>
         <LottieView source={require("../assets/images/loadingAnimation.json")} autoPlay loop style={{ flex: 1 }} />
      </View>
   );
};

export const LoadingII = ({ size = "large" }) => {
   return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
         <ActivityIndicator size={size} color={theme.colors.primary} />
      </View>
   );
};

export const Intro = ({ size }) => {
   return (
      <View style={{ width: size, aspectRatio: 1 }}>
         <LottieView source={require("../assets/images/intro.json")} autoPlay speed={0.5} style={{ flex: 1 }} />
      </View>
   );
};

export default Loading;
