import { Dimensions, TouchableOpacity, View } from "react-native";
import AuthContainer from "../ui/AuthContainer";
import DateSelector from "../ui/DateSelector";
import TextField from "../ui/TextField";
import { useState } from "react";
import RoomCard from "../ui/RoomCard";

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
            <RoomCard
            label="Apartamento"
            icon={{
                lib:"FontAwesome5",
                name:"bed",
            }}
            description={{
                title:"Caracteristicas do quarto",
                text: "1 cama de casal..",
                price: 180
            }}
        />
        </AuthContainer>
    )};

export default RenderExplorer