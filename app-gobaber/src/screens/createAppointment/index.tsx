import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProviderList,
  ProviderContainer,
  ProviderAvatar,
  ProviderAvatarDefault,
  ProviderName,
  CalendarContainer,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText

} from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { useAuth } from "../../hooks/AuthContext";
import api from "../../services/api";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Alert, ListRenderItem, Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns'
import { Button } from "../../components/Button";
import { ProfileButton } from "../dashboard/styles";

interface RouteParam {
  providerId: string
}

export interface Provider {
  id: string
  name: string
  avatar_url: string
}

interface AvailabilityItem {
  hour: number
  available: boolean
}

export function CreateAppointment() {
  const [provaiders, setProvaiders] = useState<Provider[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [availability, setAvailability] = useState<AvailabilityItem[]>([])
  const [selectedHour, setSelecatedHour] = useState(0)

  const { userPresenter } = useAuth()

  const route = useRoute()

  const { providerId } = route.params as RouteParam
  const [selectedProvider, setSelectedProvider] = useState(providerId)

  const { goBack, navigate } = useNavigation()

  useEffect(() => {
    api.get('provaiders/').then((response) => {
      setProvaiders(response.data)
    })
  }, [])

  useEffect(() => {
    api.get(`provaiders/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then((response) => {
      setAvailability(response.data)
    })
  }, [selectedDate, selectedProvider])

  const morningAvailability = useMemo(() => {
    return availability.filter(({ hour }) => hour < 12).map(({ hour, available }) => {
      return {
        hour,
        available,
        hourFormated: format(new Date().setHours(hour), 'HH:00')
      }
    })
  }, [availability])

  const afterAvailability = useMemo(() => {
    return availability.filter(({ hour }) => hour >= 12).map(({ hour, available }) => {
      return {
        hour,
        available,
        hourFormated: format(new Date().setHours(hour), 'HH:00')
      }
    })
  }, [availability])

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const handleSelectProvider = useCallback((id: string) => {
    setSelectedProvider(id)
  }, [setSelectedProvider])

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state)
  }, [])

  const handleDateChanged = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }

    // Date

    if (date) {
      setSelectedDate(date)
    }

  }, [])

  const handleSelectHour = useCallback((hour: number) => {
    setSelecatedHour(hour)
  }, [])

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)

      date.setHours(selectedHour)
      date.setMinutes(0)

      await api.post('/appointments/createappointments', {
        provider_id: selectedProvider,
        date
      })

      navigate('AppointmentCreated', { date: date.getTime() })

    } catch (err) {
      Alert.alert('Erro ao criar agendamento', 'Ocorreu um erro ao tentar criar um agendamento, tente novamente')
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider])

  const navigateToProfile = useCallback(() => {
    navigate('Profile')
  }, [])

  const item: ListRenderItem<Provider> = ({ item: provider }) => (

    <GestureHandlerRootView>
      <ProviderContainer selected={provider.id === selectedProvider} onPress={() => { handleSelectProvider(provider.id) }}>
        {provider.avatar_url ? <ProviderAvatar source={{ uri: provider.avatar_url }} /> :
          <ProviderAvatarDefault>
            <Icon name="user" size={18} color="#f4ede8" />
          </ProviderAvatarDefault>}
        <ProviderName selected={provider.id === selectedProvider}>{provider.name}</ProviderName>
      </ProviderContainer>
    </GestureHandlerRootView>
  );

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: userPresenter.avatar_url }} />
        </ProfileButton>
        
      </Header>

      <Content>
        <ProviderList<any>
          horizontal
          data={provaiders}
          keyExtractor={(provider: { id: any; }) => provider.id}
          renderItem={item} />

        <CalendarContainer>
          <Title>Escolha a data</Title>

          <GestureHandlerRootView>
            <OpenDatePickerButton onPress={handleToggleDatePicker}>
              <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
            </OpenDatePickerButton>
          </GestureHandlerRootView>

          {showDatePicker && <DateTimePicker
            mode='date'
            display="inline"
            value={selectedDate}
            onChange={handleDateChanged}
            themeVariant="dark"
            accentColor={selectedDate ? '#FF9000' : '#3E3B47'}
            locale="pt-BR" />}
        </CalendarContainer>

        <Schedule>
          <Title>Escolha o horario</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ hourFormated, available, hour }) => (
                <GestureHandlerRootView key={hourFormated}>
                  <Hour enabled={available} selected={selectedHour === hour} onPress={() => handleSelectHour(hour)} available={available} >
                    <HourText selected={selectedHour === hour}>{hourFormated}</HourText>
                  </Hour>
                </GestureHandlerRootView>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {afterAvailability.map(({ hourFormated, available, hour }) => (
                <GestureHandlerRootView key={hourFormated}>
                  <Hour enabled={available} selected={selectedHour === hour} onPress={() => handleSelectHour(hour)} available={available} >
                    <HourText selected={selectedHour === hour}>{hourFormated}</HourText>
                  </Hour>
                </GestureHandlerRootView>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <GestureHandlerRootView>
          <CreateAppointmentButton onPress={handleCreateAppointment}>
            <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
          </CreateAppointmentButton>
        </GestureHandlerRootView>
      </Content>
    </Container>
  );
}
