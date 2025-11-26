import { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import DatePicker, { getFormatedDate, getToday } from "react-native-modern-datepicker";

    type Props = {
        onSelectDate: (date:string) => void; 
    };

const DateSelector = ({onSelectDate}: Props) => {
    const{width,height}= Dimensions.get("window");
    const today = getToday();
    const [selectDate, setSelectDate] = useState("");

    return (
        <View>
            <DatePicker
            mode="calendar"
                options={{
                backgroundColor: '#f0f0f0ff',
                textHeaderColor: '#9e62acff',
                textDefaultColor: '#420350ff',
                selectedTextColor: '#fff',
                mainColor: '#9e62acff',
                textSecondaryColor: '#420350ff',
                borderColor: 'rgba(122, 146, 165, 0.1)',
                textFontSize:14,
                textHeaderFontSize:15,
            }}

            style={{borderRadius: 15, width: width * 0.62, height: "auto" }}
            isGregorian={true}
            minimumDate={today}
            selected={selectDate}
            onSelectedChange={(date) => {
                setSelectDate(date);
                onSelectDate(date);
            }}
        />
    </View>

    );
};

export default DateSelector;