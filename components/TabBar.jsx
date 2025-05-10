import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { AntDesign, Feather, FontAwesome5, Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";
import { hp } from "@/helpers/common";

const TabBar = ({ state, descriptors, navigation }) => {
   const isDarkMode = useColorScheme() == "dark"
   const { user, setAuth } = useAuth();
    const icons = {
        home : (props) => <Icon name="home" size={28}  {...props}/>,
        event : (props) => <Fontisto name="date" size={26} style={{...props}} />,
        search : (props) => <Icon name="search" size={28}  {...props}/>,
        chat : (props) => <Icon name="chat" size={28} {...props}/>,
        profile : (props) =><Avatar uri={user?.image} size={hp(4)} rounded={theme.radius.xxl} style={[{borderWidth : 2}, {...props}]}
    />
    }
   return (
      <View style={[styles.tabbar, {backgroundColor : isDarkMode? theme.colors.bottomTabContainerColor : "white"}]}>
         {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
               const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
               });

               if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
               }
            };

            const onLongPress = () => {
               navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
               });
            };

            return (
               <TouchableOpacity
                 key={route.name}
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarButtonTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.tabbarItem}
               >
                {
                    icons[route.name]({
                        color: isFocused ? theme.colors.primary : isDarkMode? "#FAF9F6" :theme.colors.text,
                        borderColor : isFocused ? theme.colors.primary : "transparent",
                        borderWidth : isFocused ? "3" : "0",
                        borderWidth : route.name === "event" && "0",
                        // size : isFocused ? "30" : "",

                    })
                }
                  {/* <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>{label}</Text> */}
               </TouchableOpacity>
            );
         })}
      </View>
   );
};

const styles = StyleSheet.create({
    tabbar : {
        position : "absolute",
        bottom : 25,
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "center",
        marginHorizontal : 20,
        paddingVertical : 20,
        borderRadius : 15,
        borderCurve : "continuous",
        shadowColor : "black",
        shadowOffset : {width : 0, height : 7},
        shadowRadius : 10,
        shadowOpacity : 0.8,

    },
    tabbarItem : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center"
    }
})

export default TabBar;
