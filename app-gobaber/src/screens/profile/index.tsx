import React, { useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Container, Title, UserAvatarButton, UserAvatar, ActionsContainer, BackButton, LogoutButton, CameraIcon, IconContainer } from "./style";
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import getValidationError from "../../utils/getValidationError";
import api from "../../services/api";
import { useAuth } from "../../hooks/AuthContext";
import Icon from "react-native-vector-icons/Feather";
import { MediaTypeOptions, launchCameraAsync, launchImageLibraryAsync, requestCameraPermissionsAsync, requestMediaLibraryPermissionsAsync, } from 'expo-image-picker'

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

export function Profile() {
  const { goBack } = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation()

  const { userPresenter, signOut, updateUser } = useAuth()

  const handleSignUp = useCallback(async (data: ProfileFormData) => {

    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required("Nome é obrigatório"),
        email: Yup.string()
          .required("E-mail é obrigatório")
          .email("Digite um e-mail válido"),
        old_password: Yup.string().optional(),
        password: Yup.string().test({
          name: 'password',
          test: function (value) {
            const oldPassword = this.parent.old_password;
            return !!oldPassword ? !!value : true;
          },
          message: 'Campo obrigatório!'
        }),
        password_confirmation: Yup.string().test({
          name: 'password_confirmation',
          test: function (value) {
            const oldPassword = this.parent.old_password;
            const password = this.parent.password;
            return (!oldPassword || !!password) && (value === password);
          },
          message: 'Confirmação incorreta!'
        })
      });

      await schema.validate(data, { abortEarly: false });

      const {
        name,
        email,
        old_password,
        password,
        password_confirmation,
      } = data;

      const formData = {
        name,
        email,
        ...(data.old_password
          ? {
            old_password,
            password,
            password_confirmation,
          }
          : {}),
      };

      const response = await api.put("profile/", formData);

      updateUser(response.data)

      Alert.alert(
        "Perfil atualizado com sucesso"
      );

      goBack();
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationError(err);
        formRef.current?.setErrors(errors);

        return;
      }
      Alert.alert(
        "Erro na atualização do perfil",
        "Ocorreu um erro ao atualizar seu perfil, tente novamente"
      );
    }
  }, [navigation]);

  const handleBackPage = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleLogoutUser = useCallback(async () => {
    signOut()
  }, [signOut])

  const handleUpdateAvatar = useCallback(async () => {

    const { status } = await requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('É necessária permissão para acessar a biblioteca de mídia!');

      return
    }

    let permissionResult = await requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permissão para acessar a câmera é necessária!");
      return;
    }

    Alert.alert(
      "Selecione",
      "Informe onde voce deseja buscar a imagem",
      [
        {
          text: "Galeria",
          onPress: () => pickImageFromGalery()
        },
        {
          text: "Camera",
          onPress: () => pickImageFromCamera()
        }
      ],
    )
  }, [])

  const pickImageFromGalery = async () => {
    const result = await launchImageLibraryAsync(
      {
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      }
    )

    const data = new FormData()

    if (!result.canceled) {
      const phtoFile = {
        name: result.assets[0].fileName,
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType
      } as any

      data.append('avatar', phtoFile)

      api.patch('users/uploadavatar', data, {
        headers: {
          'Content-type': 'multipart/form-data'
        },
      }).then((response) => {
        updateUser(response.data)
      })
    }

  }

  const pickImageFromCamera = async () => {
    const result = await launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
  }

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
            <ActionsContainer>
              <BackButton onPress={handleBackPage}>
                <Icon name="chevron-left" size={24} color="#999591" />
              </BackButton>

              <LogoutButton onPress={handleLogoutUser}>
                <Icon name="power" size={24} color="#999591" />
              </LogoutButton>
            </ActionsContainer>

            <UserAvatarButton>
              <UserAvatar source={{ uri: userPresenter.avatar_url }} />
              <IconContainer onPress={handleUpdateAvatar}>
                <CameraIcon >
                  <Icon name="camera" size={25} />
                </CameraIcon>
              </IconContainer>
            </UserAvatarButton>

            <View>
              <Title>Meu Perfil</Title>
            </View>
            <Form initialData={userPresenter} ref={formRef} onSubmit={handleSignUp}>
              <Input name="name" placeholder="Nome" icon="user" />
              <Input name="email" placeholder="E-mail" icon="mail" />
              <View style={{ marginTop: 16 }}>
                <Input
                  secureTextEntry={true}
                  textContentType="oneTimeCode"
                  name="old_password"
                  placeholder="Senha atual"
                  icon="lock"
                />
                <Input
                  secureTextEntry={true}
                  textContentType="none"
                  name="password"
                  placeholder="Nova senha"
                  icon="lock"
                />
                <Input
                  secureTextEntry={true}
                  textContentType="none"
                  name="password_confirmation"
                  placeholder="Confirmar senha"
                  icon="lock"
                />
              </View>
              <Button style={{ marginTop: 16 }}
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Atualizar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView >
    </>
  );
}

