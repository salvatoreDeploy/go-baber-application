import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dashboard } from "../screens/dashboard";
import { Profile } from "../screens/profile";
import { AppointmentCreated } from "../screens/appointmentCreated";
import { CreateAppointment } from "../screens/createAppointment";
import { SignIn } from "../screens/signin";

const App = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#312e38" },
      }}
    >
      <App.Screen name="Dashboard" component={Dashboard} />
      <App.Screen name="AppointmentCreated" component={AppointmentCreated} />
      <App.Screen name="CreateAppointment" component={CreateAppointment} />
      <App.Screen name="Profile" component={Profile} />
    </App.Navigator>
  );
}
