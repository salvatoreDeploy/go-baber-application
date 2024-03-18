import { Container, Content, Background, AnimatedContainer } from "./styles";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../../assets/LogoImg.svg";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useToast } from "../../hook/ToastContext";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useCallback, useRef, useContext, useState } from "react";
import { FormHandles } from "@unform/core";
import getValidationError from "../../utils/getValidationError";
import { api } from "../../services/api";

interface ForgotPasswordFomData {
  email: string;
}

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFomData) => {
      try {

        setLoading(true)

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail é obrigatorio")
            .email("Digite um e-mail válido"),
        });

        await schema.validate(data, { abortEarly: false });

        // Recuperação de senha

        await api.post('/password/forgot', {
          email: data.email
        })

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description: 'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada'
        })

        /* navigate("/dashboard"); */
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationError(err);
          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: "error",
          title: "Erro na recuperação de senha",
          description: "Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente",
        });
      } finally {
        formRef.current?.setFieldValue('email', '');
        setLoading(false);
      }
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={LogoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Button loading={loading} type="submit">Recuperar Senha</Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar ao Login
          </Link>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
}
