import React, { useCallback, useRef } from "react";
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { Container, Title, BackToSignIn, BackToSignInText } from "./style";
import Icon from "react-native-vector-icons/Feather";

import logoImg from "../../assets/Logo.png";
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import getValidationError from "../../utils/getValidationError";
import api from "../../services/api";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

export function SignUp() {
  const { goBack } = useNavigation();
  const formRef = useRef<FormHandles>(null);

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    //console.log(data);

    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required("Nome é Obrigatorio"),
        email: Yup.string()
          .required("E-mail é obrigatorio")
          .email("Digite um e-mail válido"),
        password: Yup.string().min(6, "Minimo 6 digitos"),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post("/users/createuser", data);

      console.log("try");

      Alert.alert(
        "Cadastro realizado com sucesso",
        "Você ja pode realizar login na apliação"
      );

      goBack();
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationError(err);
        formRef.current?.setErrors(errors);

        console.log("catch");

        return;
      }
      Alert.alert(
        "Erro no cadastro",
        "Ocorreu um erro ao fazer cadastro, tente novamente"
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Crie sua Conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input name="name" placeholder="Nome" icon="user" />
              <Input name="email" placeholder="E-mail" icon="mail" />
              <Input
                secureTextEntry={true}
                name="password"
                placeholder="Password"
                icon="lock"
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn onPress={() => goBack()}>
        <Icon name="arrow-left" size={20} color="#f4ede8" />
        <BackToSignInText>Voltar para o login</BackToSignInText>
      </BackToSignIn>
    </>
  );
}
