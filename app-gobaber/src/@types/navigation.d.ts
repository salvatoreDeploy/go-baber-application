export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Signin: undefined;
      Signup: undefined;
      Profile: undefined;
      AppointmentCreated: { date: number };
      CreateAppointment: { providerId: string };
      Dashboard: undefined
    }
  }
}
