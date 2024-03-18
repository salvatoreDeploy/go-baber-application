import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProviderList,
  ProvidersListTitle,
  ProviderContainer,
  ProviderAvatar,
  ProviderAvatarDefault,
  ProviderMeta,
  ProviderMetaText,
  ProviderInfo,
  ProviderName
} from "./styles";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import { ListRenderItem } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export interface Provider {
  id: string
  name: string
  avatar_url: string
}

export function Dashboard() {
  const [provaiders, setProvaiders] = useState<Provider[]>([])
  const { userPresenter, signOut } = useAuth();
  const { navigate } = useNavigation()

  useEffect(() => {
    api.get('provaiders/').then((response) => {

      if (response.status === 400) {
        signOut()
      }

      setProvaiders(response.data)
    })
  }, [])

  const navigateToProfile = useCallback(() => {
    navigate('Profile')
  }, [])

  const handleToCreateAppointment = useCallback((providerId: string) => {
    navigate('CreateAppointment', { providerId });
  }, [navigate])

  const item: ListRenderItem<Provider> = ({ item: provider }) => (

    <GestureHandlerRootView>
      <ProviderContainer onPress={() => handleToCreateAppointment(provider.id)}>

        {provider.avatar_url ? <ProviderAvatar source={{ uri: provider.avatar_url }} /> :
          <ProviderAvatarDefault>
            <Icon name="user" size={44} color="#f4ede8" />
          </ProviderAvatarDefault>}

        <ProviderInfo>
          <ProviderName>{provider.name}</ProviderName>

          <ProviderMeta>
            <Icon name="calendar" size={14} color="#ff9000" />
            <ProviderMetaText>Segunda à Sexta</ProviderMetaText>
          </ProviderMeta>

          <ProviderMeta>
            <Icon name="clock" size={14} color="#ff9000" />
            <ProviderMetaText>8hrs as 18hrs</ProviderMetaText>
          </ProviderMeta>
        </ProviderInfo>
      </ProviderContainer>
    </GestureHandlerRootView>
  );

  return (
    <Container >
      <Header>
        <HeaderTitle>
          Bem vindo, {"\n"}
          <UserName>{userPresenter.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: userPresenter.avatar_url }} />
        </ProfileButton>
      </Header>

      <ProviderList<any>
        data={provaiders}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        keyExtractor={(provider: { id: any; }) => provider.id}
        renderItem={item} />
    </Container >
  );
}
