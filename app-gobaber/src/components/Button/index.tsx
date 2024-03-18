import React from "react";
import { View } from "react-native";

import { Container, ButtonText } from "./style";
import { RectButtonProps } from "react-native-gesture-handler";

interface ButtonProps extends RectButtonProps {
  children: string;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <Container {...props}>
      <ButtonText>{children}</ButtonText>
    </Container>
  );
}
