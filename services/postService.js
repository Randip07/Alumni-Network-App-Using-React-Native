import { supabase } from "@/lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
   try {
      if (post.file && typeof post.file == "object") {
         let isImage = post?.file?.type == "image";
         let folderName = isImage ? "postImages" : "postVideos";
         let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
         if (fileResult.success) post.file = fileResult.data;
         else {
            return fileResult;
         }
      }

      const { data, error } = await supabase.from("posts").upsert(post).select().single();

      if (error) {
         console.log("createPost error", error);
         return { success: false, msg: "Could not create post" };
      }

      return { success: true, data: data };
   } catch (err) {
      console.log("createPost error", err);
      return { success: false, msg: "Could not create post" };
   }
};

export const createOrUpdateEvent = async (post) => {
   try {
      if (post.file && typeof post.file == "object") {
         let isImage = post?.file?.type == "image";
         let folderName = isImage ? "postImages" : "postVideos";
         let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
         if (fileResult.success) post.file = fileResult.data;
         else {
            return fileResult;
         }
      }

      const { data, error } = await supabase.from("events").upsert(post).select().single();

      if (error) {
         console.log("createEvent error", error);
         return { success: false, msg: "Could not create event 1" };
      }

      return { success: true, data: data };
   } catch (err) {
      console.log("createEvent error", err);
      return { success: false, msg: "Could not create event 2" };
   }
};

export const createOrUpdateEventRequest = async (eventReq) => {
   try {
      const { data, error } = await supabase.from("eventRequest").upsert(eventReq).select().single();
      if (error) {
         console.log("createEventReq error", error);
         return { success: false, msg: "Could not create event Req" };
      }

      return { success: true, data: data };
   } catch (err) {
      console.log("createEventREq error", err);
      return { success: false, msg: "Could not create event req" };
   }
};

export const fetchPosts = async (limit = 10, userId) => {
   try {
      if (userId) {
         const { data, error } = await supabase
            .from("posts")
            .select(
               `
         *,
         user: users (id, name, image),
         postsLike (*),
         comments (count)
         `
            )
            .order("created_at", { ascending: false })
            .eq("userId", userId)
            .limit(limit);

         if (error) {
            console.log("fetchPosts error", error);
            return { success: false, msg: "Could not fetch posts" };
         }

         return { success: true, data: data };
      } else {
         const { data, error } = await supabase
            .from("posts")
            .select(
               `*,
         user: users (id, name, image),
         postsLike (*),
         comments (count)
         `
            )
            .order("created_at", { ascending: false })
            .limit(limit);

         if (error) {
            console.log("fetchPosts error", error);
            return { success: false, msg: "Could not fetch posts" };
         }

         return { success: true, data: data };
      }
   } catch (err) {
      console.log("fetchPosts error", err);
      return { success: false, msg: "Could not fetch posts" };
   }
};

export const fetchEvents = async (limit = 10, eventId) => {
   try {
      if (eventId) {
         const { data, error } = await supabase
            .from("events")
            .select(
               `*,
               requestId : eventRequest(*) 
               `
            ).eq("id", eventId).single()
            
         if (error) {
            console.log("fetchPosts error", error);
            return { success: false, msg: "Could not fetch posts" };
         }

         return { success: true, data: data };
      } else {
         const { data, error } = await supabase.from("events").select(`*,
               requestId : eventRequest(*) 
               `).order("created_at", { ascending: false }).limit(limit);

         if (error) {
            console.log("fetchPosts error", error);
            return { success: false, msg: "Could not fetch posts" };
         }

         return { success: true, data: data };
      }
   } catch (err) {
      console.log("fetchPosts error", err);
      return { success: false, msg: "Could not fetch posts" };
   }
};

export const fetchPostDetails = async (postId) => {
   try {
      const { data, error } = await supabase
         .from("posts")
         .select(
            `
         *,
         user: users (id, name, image),
         postsLike (*),
         comments (*, user : users(id, name , image))
         `
         )
         .eq("id", postId)
         .single();

      if (error) {
         console.log("fetchPostDetails error", error);
         return { success: false, msg: "Could not fetch post details" };
      }

      return { success: true, data: data };
   } catch (err) {
      console.log("fetchPosts error", err);
      return { success: false, msg: "Could not fetch posts" };
   }
};

export const createPostLike = async (postLike) => {
   try {
      const { data, error } = await supabase.from("postsLike").insert(postLike).select().single();

      if (error) {
         console.log("postLike error", error);
         return { success: false, msg: "Could not like the post" };
      }

      return { success: true, data: data };
   } catch (err) {
      console.log("postLike error", err);
      return { success: false, msg: "Could not like the post" };
   }
};

export const removePostLike = async (postId, userId) => {
   try {
      const { error } = await supabase.from("postsLike").delete().eq("postId", postId).eq("userId", userId);

      if (error) {
         console.log("postLike error", error);
         return { success: false, msg: "Could not remove like of the post" };
      }

      return { success: true };
   } catch (err) {
      console.log("postLike error", err);
      return { success: false, msg: "Could not like the post" };
   }
};

export const createComment = async (commentData) => {
   try {
      const { data, error } = await supabase.from("comments").insert(commentData).select().single();

      if (error) {
         console.log("Create comment error", error);
         return { success: false, msg: "Could not create the comment for the post" };
      }

      return { success: true, data: data };
   } catch (err) {
      console.log("Create comment error", err);
      return { success: false, msg: "Could not create the comment for the post" };
   }
};

export const removePostComment = async (commentId) => {
   try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);

      if (error) {
         console.log("Comment delete error", error);
         return { success: false, msg: "Could not delete the comment of the post" };
      }

      return { success: true, data: { commentId } };
   } catch (err) {
      console.log("Comment delete error", err);
      return { success: false, msg: "Could not delete the comment of the post" };
   }
};

export const removePost = async (postId) => {
   try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
         console.log("Post delete error", error);
         return { success: false, msg: "Could not delete the post" };
      }

      return { success: true, data: { postId } };
   } catch (err) {
      console.log("Post delete error", err);
      return { success: false, msg: "Could not delete the post" };
   }
};

