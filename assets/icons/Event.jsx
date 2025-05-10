import { View, Text } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";

const Event = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#000000" fill="none" {...props}>
    <Path d="M16 2V6M8 2V6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
    <Path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
    <Path d="M3 10H21" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
    <Path d="M10 18.5002L9.99999 13.8474C9.99999 13.6557 9.86325 13.5002 9.69458 13.5002H9M14 18.4983L15.4855 13.8923C15.4951 13.8626 15.5 13.8315 15.5 13.8002C15.5 13.6346 15.3657 13.5002 15.2 13.5002L13 13.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
</Svg>
);

export default Event;
