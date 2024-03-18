import styled, { css } from "styled-components/native";
import Ionicons from "@expo/vector-icons/Feather";
import { Platform } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";

interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px ${Platform.OS === "android" ? 50 : 40}px;
`;
export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: "RobotoSlab_500Medium";
  margin: 64px 0 24px;
`;

/* export const Icon = styled(Ionicons) <ContainerProps>`
  margin-right: 16px;
  ${props => props.isFocused && css`border-color: #ff9000`}
`; */

export const BackToSignIn = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background: #312e38;
  border-top-width: 1px;
  border-color: #232129;
  padding: 16px 0 ${16 + getBottomSpace()}px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const BackToSignInText = styled.Text`
  color: #f4ede8;
  font-size: 18px;
  font-family: "RobotoSlab_400Regular";
`;
