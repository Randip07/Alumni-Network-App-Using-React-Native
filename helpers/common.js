import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const hp = (percentage) => {
   return (percentage * deviceHeight) / 100;
};

export const wp = (percentage) => {
   return (percentage * deviceWidth) / 100;
};

export const getRoomId = (userId1, userId2) => {
   const sortedIds = [userId1, userId2].sort();
   const roomId = sortedIds.join("_");
   return roomId;
};

export const getUserIdsFromRoomId = (roomId) => {
   const userIds = roomId.split("_");
   return userIds;
 };
 

export const stripHtmlTags = (html) => {
   return html.replace(/<[^>]*>?/gm, "");
};

export const blurhash =
   "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const formatDate = (date) => {
   const day = date.getDate();
   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   const month = monthNames[date.getMonth()];
   const year = date.getFullYear();

   let formattedDate = day + " " + month + " " + year;
   let hours = date.getHours();
   let minutes = date.getMinutes();

   // current date
   let currDate = Date.now();
   currDate = new Date(currDate);
   const currDay = currDate.getDate();
   const currMonth = monthNames[currDate.getMonth()];
   const currYear = date.getFullYear();
   let formattedCurrDate = currDay + " " + currMonth + " " + currYear;

   // Format the time
   let time;

   if (hours < 10 && minutes < 10) {
      time = `0${hours}:0${minutes}`;
   } else if (hours >= 10 && minutes < 10) {
      time = `${hours}:0${minutes}`;
   } else if (hours < 10 && minutes >= 10) {
      time = `0${hours}:${minutes}`;
   } else {
      time = `${hours}:${minutes}`;
   }

   // Yesterday date
   let yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1); // Subtract one day from today
   let yesterdayTimestamp = yesterday.getTime(); // Get the timestamp in millisecond
   yesterdayTimestamp = new Date(yesterdayTimestamp);
   const yesDay = yesterdayTimestamp.getDate();
   const yesMonth = monthNames[yesterdayTimestamp.getMonth()];
   const yesYear = date.getFullYear();
   let formattedYesDate = yesDay + " " + yesMonth + " " + yesYear;

   if (formattedDate == formattedYesDate) {
      return "Yesterday";
   }

   return time;
};
