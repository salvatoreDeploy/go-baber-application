import styled from "styled-components/native";
import { Platform } from "react-native";

interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.View`
  flex: 1;

  justify-content: center;
  padding: 0 30px ${Platform.OS === "android" ? 50 : 40}px;
`;

export const ActionsContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const BackButton = styled.TouchableOpacity`
  margin-top: 10px;
`;

export const LogoutButton = styled.TouchableOpacity`
  margin-top: 10px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: "RobotoSlab_500Medium";
  margin: 24px 0;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 30px;
  
`;

export const IconContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
`

export const CameraIcon = styled.View`
  background-color: #ff9000; /* Cor de fundo azul */
  border-radius: 30px; /* Raio de borda para criar uma forma arredondada */
  padding: 15px;
  position: relative;
  bottom: 0; 
  margin-right: 90px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;