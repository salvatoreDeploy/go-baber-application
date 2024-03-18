import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn } from "../screens/signin";
import { SignUp } from "../screens/signup";
import { Profile } from "../screens/profile";

const Auth = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#312e38" },
      }}
    >
      <Auth.Screen name="Signin" component={SignIn} />
      <Auth.Screen name="Signup" component={SignUp} />
    </Auth.Navigator>
  );
}
