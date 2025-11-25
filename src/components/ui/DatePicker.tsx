import { View,Text } from "react-native";
import { useState } from "react";
import DatePicker,{getFormatedDate,getToday} from "react-native-modern-datepicker";
import { Label } from "@react-navigation/elements";

type Props = {
    label?:string;
}


const DateSelector = ({label}: Props) => {
    getToday();
    getFormatedDate(new Date(),"YYYY/MM/DD h:m")

    const startDate = getFormatedDate(new Date(), "YYYY/MM/DD h:m")

    const [selectDate, setSelectDate] = useState("");
    return (
        <View>
            {!!label &&
            <Text>{label}</Text>}
            <DatePicker
                options={{
                backgroundColor: '#090C08',
                textHeaderColor: '#FFA25B',
                textDefaultColor: '#F6E7C1',
                selectedTextColor: '#fff',
                mainColor: '#F4722B',
                textSecondaryColor: '#D6C7A1',
                borderColor: 'rgba(122, 146, 165, 0.1)',
            }}
            isGregorian={true}
            mode= "calendar"
            minimumDate={startDate}
            selected={selectDate}
    style={{ borderRadius: 10 }}
    />
        </View>

    );
};

export default DateSelector;