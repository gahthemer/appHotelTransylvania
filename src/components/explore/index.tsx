import { Dimensions, TouchableOpacity, View } from "react-native";
import AuthContainer from "../ui/AuthContainer";
import DateSelector from "../ui/DateSelector";
import TextField from "../ui/TextField";
import { useState } from "react";

const RenderExplorer = () => {
    const {width,height} = Dimensions.get("window");
    const [checkin,setCheckin] = useState("");
    const [checkOut,setCheckOut] = useState("");
    const[openCalendar,setcalendar] = useState<"checkin" | "checkout">();

    return(
        <AuthContainer>
            { /* children */ }
            <View>
                <TouchableOpacity onPress={()=> setcalendar("checkin")}>
                <TextField 
                label="Check-in"
                icon={{lib:"FontAwesome5",name:"calendar-alt"}}
                placeholder="Selecione a data"
                value={checkin}
                />
                </TouchableOpacity>
                {openCalendar === "checkin" && (
                <DateSelector
                onSelectDate={(date) =>{
                    setCheckin(date);
                }}
                />
            )}

            <TouchableOpacity onPress={()=> setcalendar("checkout")}>
                <TextField 
                label="Check-out"
                icon={{lib:"FontAwesome5",name:"calendar-alt"}}
                placeholder="Selecione a data"
                value={checkOut}
                />
                </TouchableOpacity>
                {openCalendar === "checkout" && (
                <DateSelector
                onSelectDate={(date) =>{
                    setCheckOut(date);
                }}
            />
            )}
            </View>
        </AuthContainer>
    );
};

export default RenderExplorer