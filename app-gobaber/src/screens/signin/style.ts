import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Feather";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { Platform } from "react-native";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px 30px ${Platform.OS === "android" ? 50 : 40}px;
`;
export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: "RobotoSlab_500Medium";
  margin: 64px 0 24px;
`;

export const Icon = styled(Ionicons)`
  margin-right: 16px;
`;

export const ForgotPassword = styled.TouchableOpacity`
  margin-top: 24px;
`;

export const ForgorPasswordText = styled.Text`
  color: #f4ede8;
  font-size: 14px;
  font-family: "RobotoSlab_400Regular";
`;

export const CreateAccountButton = styled.TouchableOpacity`
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

export const CreateAccountButtonText = styled.Text`
  color: #ff9000;
  font-size: 18px;
  font-family: "RobotoSlab_400Regular";
`;
