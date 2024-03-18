import { Container, Content, Background, AnimatedContainer } from "./styles";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../../assets/LogoImg.svg";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useToast } from "../../hook/ToastContext";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useCallback, useRef } from "react";
import { FormHandles } from "@unform/core";
import getValidationError from "../../utils/getValidationError";
import { api } from "../../services/api";

interface ResetPasswordFomData {
  password: string;
  password_confirmation: string;
}

export function ResetPassword() {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  //console.log(auth);
  //console.log(formRef);
  //console.log(user);

  const handleSubmit = useCallback(
    async (data: ResetPasswordFomData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required("Senha obrigatoria"),
          password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Valor da senha não são identicas')
        });

        await schema.validate(data, { abortEarly: false });

        const { password, password_confirmation } = data
        const token = location.search.replace('?token=', '')

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token
        })

        addToast({
          type: 'success',
          title: 'Senha alterada com sucesso',
          description: 'Sua senha foi alterada com sucesso!',
        });

        navigate("/");
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationError(err);
          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: "error",
          title: "Erro ao resetar senha",
          description: "Ocorreu um erro ao resetar sua senha, tente novamente",
        });
      }
    },
    [navigate]
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={LogoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar Senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da Senha"
            />
            <Button type="submit">Alterar Senha</Button>
          </Form>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
}
