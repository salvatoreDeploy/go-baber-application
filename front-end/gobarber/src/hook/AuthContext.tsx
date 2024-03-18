import React, { createContext, useCallback, useContext, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

interface User {
  id: string
  avatar_url: string
  name: string
  email: string
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
  updateUser(userPresenter: User): void
}

interface AuthProviderState {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextState>(
  {} as AuthContextState
);

export function AuthProvider({ children }: AuthProviderState) {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@GoBarber:token");
    const userPresenter = localStorage.getItem("@GoBarber:user");

    if (token && userPresenter) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, userPresenter: JSON.parse(userPresenter) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SingInCredentials) => {
    //console.log("SignIn");

    const response = await api.post("/", { email, password });

    const { token, userPresenter } = response.data;

    localStorage.setItem("@GoBarber:token", token);
    localStorage.setItem("@GoBarber:user", JSON.stringify(userPresenter));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, userPresenter });

  }, []);

  const signOut = useCallback(() => {

    try {

      // Limpar os dados do local storage
      localStorage.removeItem("@GoBarber:token");
      localStorage.removeItem("@GoBarber:user");

      // Verificar se os dados foram removidos corretamente
      if (!localStorage.getItem("@GoBarber:token") && !localStorage.getItem("@GoBarber:user")) {
        // Redirecionar para a página inicial
        window.location.href = '/';

        setData({} as AuthState);

      } else {
        // Em caso de falha ao limpar os dados, exibir uma mensagem de erro ou registrar o problema
        console.error('Falha ao limpar os dados do localStorage');
        // Ou exiba uma mensagem de erro para o usuário
        // alert('Erro ao sair. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Ou exiba uma mensagem de erro para o usuário
      // alert('Erro ao sair. Por favor, tente novamente.');
    }

  }, []);

  const updateUser = useCallback((userPresenter: User) => {

    setData({
      token: data.token,
      userPresenter
    });

    localStorage.setItem("@GoBarber:user", JSON.stringify(userPresenter));
  },
    [data.userPresenter, data.token],
  );

  return (
    <AuthContext.Provider value={{ userPresenter: data.userPresenter, signIn, signOut, updateUser }}>
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
