import { css } from "styled-components";
import styled from "styled-components/native";
import FatherIcon from "react-native-vector-icons/Feather";

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border-radius: 10px;
  margin-bottom: 10px;
  border-width: 2px;
  border-color: #232129;

  flex-direction: row;
  align-items: center;

  margin-right: 16px;

  ${props => props.isErrored && css`border-color: #c53030`}

  ${props => props.isFocused && css`border-color: #ff9000`}
`;

export const Icon = styled(FatherIcon)`
  margin-right: 16px;
  
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #fff;
  font-size: 16px;
  font-family: "RobotoSlab_400Regular";
`;
