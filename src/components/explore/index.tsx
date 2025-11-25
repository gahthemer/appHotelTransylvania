import { View } from "react-native";
import AuthContainer from "../ui/AuthContainer";
import DateSelector from "../ui/DatePicker";

const RenderExplore = () => {
    return (
        <AuthContainer>
            <View>
                <DateSelector/>
            </View>
        </AuthContainer>
    );
};
export default RenderExplore;