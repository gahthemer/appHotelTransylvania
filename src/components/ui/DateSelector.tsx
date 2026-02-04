import { Dimensions, View } from "react-native";
import DatePicker, { getToday } from "react-native-modern-datepicker";
type Props = {
  onSelectDate: (date: string) => void;
};
const DateSelector = ({ onSelectDate }: Props) => {
  const { width, height } = Dimensions.get("window"); //Componente para dimensionar largura e altura (responsividade)
  const today = getToday();
  return (
    <View>
      <DatePicker
        mode="calendar"
        options={{
          backgroundColor: "#f0f0f0ff", //Fundo (background)
          textHeaderColor: "#9e62acff", //Mês
          textDefaultColor: "#420350ff", //Número (data)
          selectedTextColor: "#fff", //Cor do número (data) quando selecionado
          mainColor: "#9e62acff", //Setas laterais e seletor
          textSecondaryColor: "#420350ff", //Dia da semana
          borderColor: "#9e62acff", //Borda
          textFontSize: 14, //Tamanho da fonte (dias da semana e número -> data)
          textHeaderFontSize: 15, //Tamanho da fonte (mês)
        }}
        style={{ borderRadius: 15, width: width * 0.69, height: "auto" }}
        isGregorian={true}
        minimumDate={today}
        onSelectedChange={(date) => {
          onSelectDate(date);
        }}
      />
    </View>
  );
};
export default DateSelector;
