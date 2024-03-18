import { Container, Content, Background, AnimatedContainer } from "./styles";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../../assets/LogoImg.svg";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useAuth } from "../../hook/AuthContext";
import { useToast } from "../../hook/ToastContext";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useCallback, useRef, useContext } from "react";
import { FormHandles } from "@unform/core";
import getValidationError from "../../utils/getValidationError";

interface SignInFomData {
  email: string;
  password: string;
}

export function SignIn() {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  //console.log(auth);
  //console.log(formRef);
  //console.log(user);

  const handleSubmit = useCallback(
    async (data: SignInFomData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail é obrigatorio")
            .email("Digite um e-mail válido"),
          password: Yup.string().required("Senha obrigatoria"),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn({
          email: data.email,
          password: data.password,
        });

        navigate("/dashboard");
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationError(err);
          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: "error",
          title: "Erro na autenticação",
          description: "Ocorreu um erro ao fazer login, cheque as credenciais",
        });
      }
    },
    [signIn, navigate]
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={LogoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Login</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit">Entrar</Button>
            <Link to='/forgot'>Esqueci minha senha </Link>
          </Form>
          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
}
