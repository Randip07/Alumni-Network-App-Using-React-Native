import { supabase } from "@/lib/supabase";

export const getUserData =  async (userId) => {
    try{
        const {data, error} = await supabase.from("users").select().eq("id", userId).single();
        if(error){
            return {success: false , msg: error.message};
        }
        return {success: true , data};
    }catch(err){
        console.log("error", err);
        return {success: false , msg: err.message};
    }

}

export const getAllUserData =  async () => {
    try{
        const {data, error} = await supabase.from("users").select("id, name, image");
        if(error){
            return {success: false , msg: error.message};
        }
        return {success: true , data};
    }catch(err){
        console.log("error", err);
        return {success: false , msg: err.message};
    }

}

export const updateUserData =  async (userId, data) => {
    try{
        const {error} = await supabase.from("users").update(data).eq("id", userId)
        if(error){
            return {success: false , msg: error.message};
        }
        return {success: true , data};
    }catch(err){
        console.log("error", err);
        return {success: false , msg: err.message};
    }

}