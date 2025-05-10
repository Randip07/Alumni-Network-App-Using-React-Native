import { Alert, Pressable, Share, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { hp, stripHtmlTags, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getSupabaseFileUrl } from "@/services/imageService";
import { Video } from "expo-av";
import { createPostLike, removePostLike } from "@/services/postService";
import Loading from "./Loading";
import themeMode from "@/constants/themeMode";

const PostCard = ({ item, currentUser, router, hasShadow = true , showMoreIcon = true, showDelete = false, onEdit = ()=>{} , onDelete = () => {}}) => {
   const scheme = useColorScheme();
   const isDarkMode = scheme === "dark"
   const mode = themeMode[scheme] || themeMode.light;
    const [imageZoomOut, setImageZoomOut] = useState(false)
    const [shouldPlay, setShouldPlay] = useState(false);
    const [playButtonShow , setPlayButtonShow] = useState(true)
    const [muted, setMuted] = useState(true);
    const [loading, setLoading] = useState(false);

   const shadowStyles = {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 1,
   };

   const textStyle = {
      fontSize: hp(1.75),
      color : mode.colors.text
   };
   const tagsStyles = {
      div: textStyle,
      p: textStyle,
      ol: textStyle,
   };

   const handleImageZoomOut = ()=>{
        if(imageZoomOut){
            setImageZoomOut(false)
        }else{
            setImageZoomOut(true)
        }
   }

   const controllVideo = ()=> {
    if(shouldPlay){
       setShouldPlay(false);
       
    }else{
       setPlayButtonShow(true)
       setShouldPlay(true)
       setTimeout(() => {
          setPlayButtonShow(false)
       }, 1000);
    }
    
 }
   const created_at = moment(item?.created_at).format("MMM D");

   const openPostDetails = async () => {
      router.push({pathname : "postDetails", params : {postId : item?.id}})
   };

   const [likes, setLikes] = useState([]);

   useEffect(() => {
      setLikes(item?.postsLike)
   }, [item])
   
   const liked = likes.filter(like => like?.userId == currentUser?.id)[0] ? true : false;

   const onLike = async ()=>{
      if(liked){
         // remove like
         const updatedLikes = likes.filter(like=> like?.userId != currentUser?.id);

         setLikes([...updatedLikes])
         const res = await removePostLike(item?.id, currentUser?.id);
         if(!res.success){
            Alert.alert("Post", "Something went wrong");
         }
      }else{
         // create Like
         const data = {
            userId : currentUser?.id,
            postId : item?.id
         }
         setLikes([...likes, data])
         const res = await createPostLike(data);
   
         
         if(!res.success){
            Alert.alert("Post", "Something went wrong");
         }
      }
      
   }

   const onShare = async ()=> {
      setLoading(true)
      const content = {message : item?.body != null ? stripHtmlTags(item?.body) : ""}
      
      if(item?.file){
         
         let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
         content.url = url;
         
         
      }
      Share.share(content);

      setLoading(false)
   }

   const handleDeletePost = ()=>{
       Alert.alert("Confirm Delete", "Are you sure you want to delete?", [
                  {
                      text : "Cancel",
                      onPress : ()=> {},
                      style : "cancel"
                  },
                  {
                      text : "Delele",
                      onPress : ()=> onDelete(item),
                      style : "destructive"
                  },
      
              ])
   }
   
   
   return (
      <View style={[styles.container, hasShadow && shadowStyles, isDarkMode ? styles.darkModeBg : styles.lightModeBg]}>
         <View style={styles.header}>
            {/* User info and Post time */}
            <View style={styles.userInfo}>
               <Avatar size={hp(4.5)} uri={item?.user?.image} rounded={theme.radius.xxl} />
               <View style={{ gap: 2 }}>
                  <Text style={[styles.username, {color : isDarkMode ? "white" : "black"}]}>{item?.user?.name}</Text>
                  <Text style={[styles.postTime, {color : isDarkMode ? "white" : "black"}]}>{created_at}</Text>
               </View>
            </View>

            {showMoreIcon && (
               <TouchableOpacity onPress={openPostDetails}>
                  <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={isDarkMode ? theme.darkMode.textColor :theme.colors.text} />
               </TouchableOpacity>
            )}

            {showDelete && currentUser?.id == item.userId && (
               <View style = {styles.actions}>
                  <TouchableOpacity onPress={()=>onEdit(item)}>
                     <Icon name="edit" size = {hp(2.5)} color = {theme.colors.text}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDeletePost}>
                     <Icon name="delete" size = {hp(2.5)} color = {theme.colors.rose}/>
                  </TouchableOpacity>
               </View>
            )}
         </View>

         {/* posts media*/}
         <View style={styles.content}>
            <View style={styles.postBody}>
                {item?.body && <RenderHtml contentWidth={wp(100)} source={{ html: item?.body }} tagsStyles={tagsStyles} />}
            </View>

            <View>
                {/* Images */}
            {
                item?.file && item?.file?.includes("postImages") && (
                    <Pressable onPress={()=> {
                        handleImageZoomOut()
                    }}>
                        <Image 
                    source ={getSupabaseFileUrl(item?.file)}
                    transition={100}
                    style = {styles.postMedia}
                    contentFit={imageZoomOut ? "contain" : "cover"}
                    
                    />
                    </Pressable>

                )
            }

            {/* Videos */}

            {
                item?.file && item?.file?.includes("postVideos") && (
                    <Pressable onPress={()=>{
                        controllVideo()
                    }}>
                        <Video
                        
                        style={[styles.postMedia, {height  : hp(30)}]} 
                        source={getSupabaseFileUrl(item?.file)} 
                        // onTouchEnd = {()=>{
                        //     controllVideo()
                        // }}
                        resizeMode={imageZoomOut ? "contain" : "cover"}
                        isLooping 
                        shouldPlay = {shouldPlay? true : false}
                        isMuted={muted ? true : false} 
                    />
                    </Pressable>
                )
            }

            {item?.file?.includes("postVideos") && (muted ? (
                        <Pressable style={styles.muteIcon} onPress={() => setMuted(false)}>
                           <Icon name="mute" size={20} color="black" />
                        </Pressable>
                     ) : (
                        <Pressable style={styles.muteIcon} onPress={() => setMuted(true)}>
                           <Icon name="unmute" size={20} color="black" />
                        </Pressable>
                     ))}

            {item?.file?.includes("postVideos") &&  (imageZoomOut ? (
                           <Pressable style={styles.pauseIcon} onPress={() => handleImageZoomOut()}>
                              <Icon name="zoomin" size={15} color="black" />
                           </Pressable>
            ) : (
                <Pressable style={styles.pauseIcon} onPress={() => handleImageZoomOut()}>
                   <Icon name="zoomout" size={15} color="black" />
                </Pressable>
 )
            )}
            </View>
         </View>


         {/* Like & Comment */}
         <View style = {styles.footer}>
            <View style = {styles.footerButton}>
                <TouchableOpacity onPress={onLike}>
                    <Icon name="heart" size = {25} color = {liked ? theme.colors.rose : isDarkMode? "white" : theme.colors.dark} fill = {liked ? theme.colors.rose : "transparent"} />
                </TouchableOpacity>
                <Text style = {[styles.count, {color : isDarkMode?"white" : theme.colors.text}]}>
                    {
                        likes?.length
                    }
                </Text>
            </View>

            {showMoreIcon && (
               <View style = {styles.footerButton}>
                  <TouchableOpacity onPress={openPostDetails}>
                     <Icon name="comment" size = {25} color = {isDarkMode ? "white": theme.colors.textDark}/>
                  </TouchableOpacity>
                  <Text style = {[styles.count, {color : isDarkMode?"white" : theme.colors.text}]}>
                     {
                        item?.comments[0]?.count
                     }
                  </Text>
               </View>
            )}
            <View style = {styles.footerButton}>
                {
                  loading ? 
                  <Loading size={hp(2.7)}/>
                  :
                  <TouchableOpacity onPress={onShare}>
                  <Icon name="share" size = {25} color = {isDarkMode ? theme.darkMode.textColor :theme.colors.textDark}/>
              </TouchableOpacity>
                }
            </View>
         </View>
      </View>
   );
};

export default PostCard;

const styles = StyleSheet.create({
   darkModeBg : {
      backgroundColor: theme.darkMode.bgColor
   },
   darkModeText : {
      color: theme.darkMode.textColor
   },

   lightModeBg : {
      backgroundColor: theme.lightMode.bgColor
   },
   container: {
      gap: 10,
      marginBottom: 15,
      // borderRadius: theme.radius.xxl * 1.1,
      // borderCurve: "continuous",
      // padding: 10,
      paddingVertical: 12,
      backgroundColor: "white",
      // borderColor: theme.colors.gray,
      // shadowColor: "#000",
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: wp(4)
   },
   userInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
   },
   username: {
      fontSize: hp(1.7),
      color: theme.colors.textDark,
      fontWeight: theme.fonts.medium,
   },
   postTime: {
      fontSize: hp(1.4),
      color: theme.colors.textLight,
      fontWeight: theme.fonts.medium,
   },
   content: {
      gap: 10,
      // marginBottom: 10,
   },
   postMedia: {
      height: hp(45),
      width: "100%",
      // borderRadius: theme.radius.xl,
      // borderCurve: "continuous",
   },
   postBody: {
      marginLeft: 5,
      paddingHorizontal: wp(4),
   },
   footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      paddingHorizontal: wp(2),
   },
   footerButton: {
      marginLeft: 5,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
   },
   count: {
      color: theme.colors.text,
      fontSize: hp(1.8),
   },
   closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: theme.colors.rose,
    // shadowColor: theme.colors. textLight,
    // shadowOffset: {width: 0, height: 3},
    // shadowOpacity: 0.6,
 },

 muteIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: theme.colors.gray,
 },

 pauseIcon : {
    position: "absolute",
    bottom: 10,
    left: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: theme.colors.gray,
 }
});
