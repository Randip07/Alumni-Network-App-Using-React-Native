import { FlatList, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, Touchable, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import themeMode from "@/constants/themeMode";
import Icon from "@/assets/icons";
import { hp, wp } from "@/helpers/common";
import Avatar from "@/components/Avatar";
import SearchCard from "@/components/SearchCard";
import { supabase } from "@/lib/supabase";
import Loading from "@/components/Loading";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Entypo } from "@expo/vector-icons";
import ButtonII from "@/components/ButtonII";

const search = () => {
   const scheme = useColorScheme();
   const isDarkMode = scheme === "dark";
   const { user: curruser } = useAuth();
   const mode = themeMode[scheme] || themeMode.light;
   const [searchText, setSearchText] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [loading, setLoading] = useState(false);

   const searchProfiles = async (value) => {
      setSearchText(value);

      if (value.length == 0 || value == "") {
         setSearchResult([]);
         return 0;
      }
      try {
         if (value.length > 0 || value != "") {
            setLoading(true);
            const { data, error } = await supabase
               .from("users")
               .select("id, name, image, bio, faculty")
               .or(`name.ilike.%${value}%,course.ilike.%${value}%,batch.ilike.%${value}%,department.ilike.%${value}%,faculty.ilike.%${value}%`)
               .order('name', { ascending: true });;

            // setSearchResult((prev) => {
            //    if (prev.length == 0) {
            //       return [...prev, ...data];
            //    }
            //    return data;
            // });
            setSearchResult((prev) => {
               const filteredData = data.filter((item) => item.id !== curruser.id);

               if (prev.length === 0) {
                  return [...prev, ...filteredData];
               }
               return filteredData;
            });

            setLoading(false);
         }
      } catch (err) {
         return;
      }
   };

   return (
      <ScreenWrapper bg={mode.colors.bgColor}>
         <View style={[styles.container, { borderWidth: isDarkMode ? 1 : 0.4 }]}>
            <Icon name="search" size={26} strokeWidth={1.6} />
            <TextInput
               style={[styles.textInput, { color: mode.colors.text }]}
               placeholderTextColor={theme.colors.textLight}
               placeholder="Search profiles"
               value={searchText}
               onChangeText={(value) => searchProfiles(value)}
            />
            {searchText.length > 0 && (
               <TouchableOpacity
                  onPress={() => {
                     setSearchText("");
                     setSearchResult([]);
                  }}
               >
                  <Entypo name="circle-with-cross" size={24} color={theme.colors.rose} />
               </TouchableOpacity>
            )}
         </View>

         {/* <SearchCard /> */}
         {loading && (
            <View style={styles.loading}>
               <Loading size={hp(6)} />
            </View>
         )}

         {searchText.length > 0 && searchResult.length > 0 && !loading && (
            <FlatList
               data={searchResult}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.listStyle}
               keyExtractor={(item) => item.id.toString()}
               renderItem={({ item }) => <SearchCard item={item} />}
               onEndReachedThreshold={0}
            />
         )}

         <Pressable onPress={() => Keyboard.dismiss()}>
            {searchText.length == 0 && (
               <View style={{gap : 15}}>
                  <View style={[styles.infoCard, isDarkMode ? { backgroundColor: mode.colors.textDark } : { backgroundColor: theme.colors.bgColor }]}>
                     <Icon name="user" size={60} strokeWidth={1.6} color={theme.colors.textLight} />
                     <Text style={[styles.text, { color: mode.colors.text, fontSize: 18 }]}>Find your Friends, Alumni, Faculty</Text>
                     <Text style={[styles.text, { color: mode.colors.text, fontSize: 15 }]}>by Name, Batch or Department</Text>
                  </View>
                  <Text style ={{color : mode.colors.text, paddingHorizontal : wp(6)}}>Shortcuts</Text>
                  <ButtonII title="Search Faculty" onPress={() => searchProfiles("faculty")}  />
                  <ButtonII title="Search 2022-26 Batch" onPress={() => searchProfiles("2022-26")}  />
                  <ButtonII title="Search CSE Department Students or Alumni or Faculty" onPress={() => searchProfiles("CSE")}  />
               </View>
            )}

            {searchResult.length == 0 && searchText.length > 0 && !loading && (
               <View style={{ marginTop: hp(20), alignItems: "center" }}>
                  <Icon name="search" size={60} strokeWidth={1.6} color={theme.colors.textLight} />
                  <Text style={[styles.text, { color: mode.colors.text }]}>No results found !!</Text>
                  <Text style={[styles.text, { color: mode.colors.text }]}>Try searching for something else</Text>
               </View>
            )}
         </Pressable>
      </ScreenWrapper>
   );
};

export default search;

const styles = StyleSheet.create({
   loading: {
      flex: 1,
      alignItems: "center",
      marginTop: hp(5),
   },
   listStyle: {
      paddingTop: 10,
      paddingBottom: hp(10),
   },
   text: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
   },
   textInput: {
      flex: 1,
      fontSize: hp(2),
      height: "100%",
   },
   container: {
      flexDirection: "row",
      height: hp(5),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0.4,
      borderColor: theme.colors.text,
      borderRadius: theme.radius.xxl,
      marginHorizontal: wp(4),
      borderCurve: "continuous",
      paddingHorizontal: 18,
      gap: 12,
   },

   infoCard: {
      marginTop: hp(3),
      alignItems: "center",
      paddingVertical: hp(8),
      marginHorizontal: wp(6),
      borderRadius: theme.radius.xxl * 1.5,
   },
});
