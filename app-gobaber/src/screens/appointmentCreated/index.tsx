import React, { useCallback, useMemo } from "react";
import { Container, Title, Description, Button, ButtonText } from "./styles";
import Icon from "react-native-vector-icons/Feather";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale/pt-BR'
interface RouteParams {
  date: number
}

export function AppointmentCreated() {

  const { reset } = useNavigation()
  const { params } = useRoute()

  const routeParams = params as RouteParams

  const formattedDate = useMemo(() => {
    return format(routeParams.date, "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'hrs'", { locale: ptBR })
  }, [])

  const handleConfirmationAppointment = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard'
        }
      ],
      index: 0
    })
  }, [reset])

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>
        Agendamento concluido
      </Title>
      <Description>
        {formattedDate}
      </Description>

      <GestureHandlerRootView>
        <Button onPress={handleConfirmationAppointment}>
          <ButtonText>Confirmar</ButtonText>
        </Button>
      </GestureHandlerRootView>
    </Container>
  );
}
