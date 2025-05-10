import { Alert, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createComment, fetchPostDetails, removePost, removePostComment } from "@/services/postService";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import CommentItem from "@/components/CommentItem";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userServices";
import { createNotification } from "@/services/notificationService";
import themeMode from "@/constants/themeMode";
import BackButton from "@/components/BackButton";

const PostDetails = () => {
   const scheme = useColorScheme()
   const isDarkMode = scheme === "dark";
   const mode = themeMode[scheme] || themeMode.light;
   const { postId, commentId } = useLocalSearchParams();
   const { user } = useAuth();
   const router = useRouter();
   const [post, setPost] = useState(null);
   const [startLoading, setStartLoading] = useState(true);
   const inputRef = useRef(null);
   const commentRef = useRef("");
   const [loading, setLoading] = useState(false);
   

   const handleNewComment = async (paylaod) =>{
    
    if(paylaod.new){
        let newComment = {...paylaod.new}
        
        let res = await getUserData(newComment.userId)
        newComment.user = res.success ? res.data  : {}
                
        setPost(prevPost=>{
            return {
                ...prevPost,
                comments : [newComment, ...prevPost.comments]
            }
        })
    }
    
  }

   useEffect(() => {
      let commentChannel = supabase
         .channel("comments")
         .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments", filter: `postId=eq.${postId}` }, handleNewComment)
         .subscribe();

      getPostDetails();

      return () => {
         supabase.removeChannel(commentChannel);
      };
   }, []);

   

   const getPostDetails = async () => {
      let res = await fetchPostDetails(postId);

      if (res.success) {
         setPost(res?.data);
      }

      setTimeout(() => {
         setStartLoading(false);
      }, 300);
   };

   if (startLoading) {
      return (
         <View style={styles.center}>
            <Loading size={hp(7)} />
         </View>
      );
   }

   const onNewComment = async () => {
      setLoading(true);

      if (!commentRef.current) return null;
      let data = {
         userId: user?.id,
         postId: post?.id,
         text: commentRef?.current,
      };

      // console.log(data);
      // create comment
      let res = await createComment(data);
      setLoading(false);

      if (res.success) {
         // send notifications
         if(user?.id != post?.userId){
            let notify = {
               senderId : user?.id,
               receiverId : post?.userId,
               title  : "commented on your post",
               data : JSON.stringify({postId : post?.id, commentId : res?.data.id})
            }

            createNotification(notify);
         }
         inputRef?.current?.clear();
         commentRef.current = "";
      } else {
         Alert.alert("Comment", res.msg);
      }
   };

   if (!post) {
      return (
         <View style={[styles.center, { justifyContent: "flex-start", marginTop: 100 }]}>
            <Text style={styles.notFound}>Post not found!!</Text>
         </View>
      );
   }

   const deleteComment = async (comment) => {
      // delete comment
      const res = await removePostComment(comment?.id);

      if (res.success) {
         setPost((prevPost) => {
            let updatedPost = { ...prevPost };
            updatedPost.comments = updatedPost.comments.filter((c) => c.id != comment?.id);
            return updatedPost;
         });
      } else {
         Alert.alert("Comment", res.msg);
      }
   };

   const onEditPost = async (item)=>{
    router.back()
    router.push({ pathname : "/newPost", params : {...item}})
   }

   const onDeletePost = async (item)=>{
    
    
    let res = await removePost(item.id);
    if(res.success){
        router.back();
    }else{
        Alert.alert("Post", res.msg)
    }

   }

   return (
      <View style={[{ backgroundColor: mode.colors.bgColor , flex:1}]}>
         <StatusBar style="light" />
         <BackButton router={router} size={30}/>
         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            <PostCard 
            item={{ ...post, comments: [{ count: post?.comments?.length }] }} 
            currentUser={user} 
            router={router} 
            hasShadow={false} 
            showMoreIcon={false} 
            onDelete = {onDeletePost}
            onEdit = {onEditPost}
            showDelete = {true}
            />

            {/* Comment */}
            <View style={styles.inputContainer}>
               <Input
                  inputRef={inputRef}
                  onChangeText={(value) => (commentRef.current = value)}
                  placeholder="Type comment...."
                  placeholderTextColor={theme.colors.textLight}
                  containerStyle={{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl }}
               />
               {loading ? (
                  <Loading size={hp(5.5)} />
               ) : (
                  <Pressable style={styles.sendIcon} onPress={onNewComment}>
                     <Icon name="send" color="black" size={hp(3.5)} />
                  </Pressable>
               )}
            </View>

            {/* Comment list */}

            <View style={{ marginVertical: 15, gap: 17 }}>
               {post?.comments?.map((comment) => (
                  <CommentItem
                     key={comment?.id?.toString()}
                     item={comment}
                     onDelete={deleteComment}
                     highlight = {commentId == comment.id ? true : false}
                     canDelete={user?.id == comment?.userId || post?.userId == user?.id ? true : false}
                  />
               ))}

               {post?.comments?.length == 0 && (
                  <View style={{ gap: 5 }}>
                     <Text style={{ color: mode.colors.text, textAlign: "center" }}>No comments yet</Text>
                     <Text style={{ color: mode.colors.text, textAlign: "center" }}>Say something to start conversation</Text>
                  </View>
               )}
            </View>
         </ScrollView>
      </View>
   );
};

export default PostDetails;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "white",
      paddingVertical: wp(7),
   },
   inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
   },
   list: {
      paddingHorizontal: wp(4),
      paddingTop: hp(1),
      paddingBottom: hp(5),
      minheight : "100%",
   },
   sendIcon: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      borderWidth: 0.8,
      borderColor: theme.colors.primary,
      borderRadius: "50%",
      borderCurve: "continuous",
      height: hp(5.5),
      width: hp(5.5),
      paddingRight: 3,
   },

   center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
   },
   notFound: {
      fontSize: hp(2.5),
      color: theme.colors.text,
      fontWeight: theme.fonts.medium,
   },
   loading: {
      height: hp(5.8),
      width: hp(5.8),
      justifyContent: "center",
      alignItems: "center",
      transform: [{ scale: 1.3 }],
   },
});
