import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface User {
  id: string
  name: string
  email: string
  avatar_url: string
}

interface AuthState {
  token: string;
  userPresenter: User;
}

interface SingInCredentials {
  email: string;
  password: string;
}

interface AuthContextState {
  userPresenter: User;
  signIn(credentials: SingInCredentials): Promise<void>;
  signOut(): void;
  updateUser(userPresenter: User): Promise<void>
  loading: boolean;

}

interface AuthProviderState {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextState>(
  {} as AuthContextState
);

export function AuthProvider({ children }: AuthProviderState) {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation()


  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, userPresenter] = await AsyncStorage.multiGet([
        "@GoBarber:token",
        "@GoBarber:user",
      ]);

      if (token[1] && userPresenter[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`
        setData({ token: token[1], userPresenter: JSON.parse(userPresenter[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }: SingInCredentials) => {

    const response = await api.post("/", { email, password });

    const { token, userPresenter } = response.data;

    await AsyncStorage.multiSet([
      ["@GoBarber:token", token],
      ["@GoBarber:user", JSON.stringify(userPresenter)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token, userPresenter });

  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(["@GoBarber:token", "@GoBarber:user"]);

    setData({} as AuthState);

    navigation.navigate('Signin')
  }, []);

  const updateUser = useCallback(async (userPresenter: User) => {
    await AsyncStorage.setItem("@GoBarber:user", JSON.stringify(userPresenter))

    setData({
      token: data.token,
      userPresenter
    });
  },
    [data.userPresenter, data.token],
  );

  return (
    <AuthContext.Provider value={{ userPresenter: data.userPresenter, signIn, signOut, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
