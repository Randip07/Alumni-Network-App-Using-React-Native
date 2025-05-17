import { supabase } from "@/lib/supabase";

export const createNotification = async (notification) => {
   try {
      const { data, error } = await supabase.from("notifications").insert(notification).select().single();

      if (error) {
         console.log("notification error", error);
         return { success: false, msg: "Something went wrong" };
      }

      return { success: true, data: data };
   } catch (err) {
      console.log("notification error", err);
      return { success: false, msg: "Something went wrong" };
   }
};

export const fetchNotificationDetails = async (receiverId) => {
   try {
      const { data, error } = await supabase
         .from("notifications")
         .select(
         `
         *,
         sender : senderId(id, name, image)
         `
         )
         .eq("receiverId", receiverId)
         .order("created_at", {ascending : false})

      if (error) {
         console.log("fetchNotificationDetails error", error);
         return { success: false, msg: "Could not fetch Notification details" };
      }

      return { success: true, data: data };
   } catch (err) {
      console.log("fetchNotificationDetails error", err);
      return { success: false, msg: "Could not fetch Notification details" };
   }
};