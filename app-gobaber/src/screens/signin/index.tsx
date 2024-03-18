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
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";

import {
  Container,
  Title,
  Icon,
  ForgotPassword,
  ForgorPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from "./style";

import logoImg from "../../assets/Logo.png";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import getValidationError from "../../utils/getValidationError";

import { useAuth } from "../../hooks/AuthContext";

interface SignInFomData {
  email: string;
  password: string;
}

export function SignIn() {
  const { navigate } = useNavigation();
  const { signIn, userPresenter } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const handleSingIn = useCallback(
    async (data: SignInFomData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail é obrigatorio")
            .email("Digite um e-mail válido"),
          password: Yup.string().required("Senha obrigatoria"),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn({
          email: data.email,
          password: data.password,
        });


      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationError(err);
          formRef.current?.setErrors(errors)

          return;
        }

        Alert.alert(
          "Erro na autenticação",
          "Ocorreu um erro ao fazer login, cheque as credenciais"
        );
      }

    },
    [signIn]
  );

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
              <Title>Faça seu Login</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSingIn}>

              <Input
                keyboardType="email-address"
                name="email"
                placeholder="E-mail"
                icon="mail" />
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
                Entrar
              </Button>
            </Form>
            <ForgotPassword>
              <ForgorPasswordText>Esqueci Minha Senha</ForgorPasswordText>
            </ForgotPassword>
          </Container>
          <CreateAccountButton onPress={() => navigate("Signup")}>
            <Icon name="log-in" size={20} color="#ff9000" />
            <CreateAccountButtonText>Criar uma Conta</CreateAccountButtonText>
          </CreateAccountButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
