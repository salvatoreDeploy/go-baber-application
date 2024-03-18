import React, { useCallback, useEffect, useRef, useState } from "react";
import { TextInputProps } from "react-native";
import { Container, TextInput, Icon } from "./style";
import { useField } from "@unform/core";

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReferenece {
  value: string;
}

export function Input({ name, icon, ...props }: InputProps) {
  const inputElementRef = useRef<any>(null);
  const { registerField, defaultValue = "", fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReferenece>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handledInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const handledInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: "value",
      setValue: (ref: any, value) => {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = "";
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? "#ff9000" : "#666360"}
      />
      <TextInput
        ref={inputElementRef}
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        onFocus={handledInputFocus}
        onBlur={handledInputBlur}
        {...props}
      />
    </Container>
  );
}
