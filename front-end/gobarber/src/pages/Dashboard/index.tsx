import { Calendar, Container, Content, Header, HeaderContent, Profile, Schedule, NextAppointments, Section, Appointment } from "./style";
import logoImg from '../../assets/LogoImg.svg'
import { FiClock, FiPower, FiSettings } from "react-icons/fi";
import { useAuth } from "../../hook/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import DayPicker, { DayModifiers } from "react-day-picker";
import 'react-day-picker/src/style.css';
import { api } from "../../services/api";
import { isToday, format, parseISO, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from "react-router-dom";

interface MonthAvailabityItem {
  day: number
  available: boolean
}

interface Appointment {
  id: string
  date: string
  hourFormatted: string
  user: {
    name: string
    avatar_url: string
  }
}

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabityItem[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const { signOut, userPresenter: user } = useAuth()

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {

    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, [])

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  if (!currentMonth) {
    throw new Error('Current Month not informed')
  }

  useEffect(() => {
    api.get(`/provaiders/${user.id}/month-availability`, {
      params: {
        year: currentMonth?.getFullYear(),
        month: currentMonth?.getMonth() + 1
      }
    }).then(response => {
      setMonthAvailability(response.data)
    })
  }, [currentMonth, user.id])

  useEffect(() => {
    api.get<Appointment[]>('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then(response => {
      const appointmentsFormatted = response.data.map(appointment => {
        return {
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm')
        }
      })

      // Usando sort() no array para trazer o horario em ordem crescente
      appointmentsFormatted.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      setAppointments(appointmentsFormatted)
    })
  }, [selectedDate])

  const disableDays = useMemo(() => {
    const dates = monthAvailability.filter(monthday => monthday.available === false).map(monthDay => {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()

      return new Date(year, month, monthDay.day)
    })

    return dates
  }, [currentMonth, monthAvailability])

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR })
  }, [selectedDate])

  const selectedWeekyDayAsText = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR })
  }, [selectedDate])

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() <= 12
    })
  }, [appointments])

  const afterAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12
    })
  }, [appointments])

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment => isAfter(parseISO(appointment.date), new Date()))
  }, [appointments])

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Logo GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo</span>
              <strong>{user.name}</strong>
            </div>

            <Link to='/profile'>
              <FiSettings />
            </Link>
          </Profile>
          <button onClick={signOut} type="button">
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekyDayAsText}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointments>
              <strong>Agendamento a Seguir</strong>
              <div>
                <img src={nextAppointment?.user.avatar_url} alt={nextAppointment?.user.name} />
                <strong>{nextAppointment?.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointments>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste período</p>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  <strong>{appointment.hourFormatted}</strong>
                </span>
                <div>
                  <img src={appointment.user.avatar_url} alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}

          </Section>
          <Section>
            <strong>Tarde</strong>

            {afterAppointments.length === 0 && (
              <p>Nenhum agendamento neste período</p>
            )}

            {afterAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  <strong>{appointment.hourFormatted}</strong>
                </span>
                <div>
                  <img src={appointment.user.avatar_url} alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]} />
        </Calendar>
      </Content>
    </Container>
  );
}
