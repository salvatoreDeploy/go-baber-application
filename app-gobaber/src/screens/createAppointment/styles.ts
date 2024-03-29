import { RectButton } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import styled from "styled-components/native";

interface ProviderContainerProps {
  selected: boolean;
}

interface ProviderNameProps {
  selected: boolean;
}

interface HourProps {
  available: boolean
  selected: boolean
}

interface HourTextProps {
  selected: boolean
}

export const Container = styled.View`
  /* flex: 1; */
`
export const Header = styled.View`
  padding: 24px;
  padding-top: ${getStatusBarHeight() + 24}px;
  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: 'RobotoSlab_400Regular';
  line-height: 28px;
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const ProviderContainer = styled(RectButton) <ProviderContainerProps>`
  background: ${props => (props.selected ? '#ff9000' : '#3e3b47')};
  border-radius: 10px;
  padding: 10px;
  margin-right: 18px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderAvatarDefault = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #ccc;
  justify-content: center;
  align-items: center;
`

export const ProviderName = styled.Text<ProviderNameProps>`
  color: ${props => (props.selected ? '#232129' : '#f4ede8')};;
  flex: 1;
  margin-left: 20px;
  font-family: 'RobotoSlab_500Medium';
  font-size: 18px;
`;

export const Content = styled.ScrollView``

export const ProviderList = styled.FlatList`
  padding: 32px 24px 16px;
`;

export const CalendarContainer = styled.View`

`;

export const Title = styled.Text`
  font-family: 'RobotoSlab_500Medium';
  color: #f4ede8;
  font-size: 24px;
  margin: 0 24px 24px;
`;

export const OpenDatePickerButton = styled(RectButton)`
  background: #ff9000;
  height: 46px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px;
`;

export const OpenDatePickerButtonText = styled.Text`
  font-family: 'RobotoSlab_500Medium';
  font-size: 16px;
  color: #332119;
`;

export const Schedule = styled.View`
  padding: 24px 0 16px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: 'RobotoSlab_400Regular';
  margin: 0 24px 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 24
  },
  horizontal: true,
  showsHorizontalScrollIndicator: false
})`

`;
export const Hour = styled(RectButton) <HourProps>`
  padding: 12px;
  background: ${props => props.selected ? '#ff9000' : '#3e3b47'};
  border-radius: 10px;
  margin-right: 8px;

  opacity: ${(props) => (props.available ? 1 : 0.3)};
`;

export const HourText = styled.Text<HourTextProps>`
color: ${props => props.selected ? '#232129 ' : '#f4ede8'};
font-family: 'RobotoSlab_400Regular';
font-size: 16px;
`;

export const CreateAppointmentButton = styled(RectButton)`
    background: #ff9000;
    height: 50px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    margin: 0 24px 24px;
`;
export const CreateAppointmentButtonText = styled.Text`
    font-family: 'RobotoSlab_500Medium';
    font-size: 18px;
    color: #332119;
`;