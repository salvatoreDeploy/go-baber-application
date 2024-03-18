import { Container, Content, Background, AnimatedContainer } from "./styles";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../../assets/LogoImg.svg";
import { FiArrowLeft, FiMail, FiUser, FiLock } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import getValidationError from "../../utils/getValidationError";
import { api } from "../../services/api";
import { useToast } from "../../hook/ToastContext";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useCallback, useRef } from "react";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

export function SignUp() {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  //console.log(formRef);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      //console.log(data);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome é Obrigatorio"),
          email: Yup.string()
            .required("E-mail é obrigatorio")
            .email("Digite um e-mail válido"),
          password: Yup.string().min(6, "Minimo 6 digitos"),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post("users/createuser", data);

        navigate("/");

        addToast({
          type: "success",
          title: "Cadastro Realizado com sucesso",
          description: "Você ja pode realziar seu logon no GoBarber",
        });
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationError(err);
          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: "error",
          title: "Erro no cadastro",
          description:
            "Ocorreu um erro ao fazer o cadastro, cheque as informações",
        });
      }
    },
    [addToast, navigate]
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimatedContainer>
          <img src={LogoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button>Cadastrar</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para Logon
          </Link>
        </AnimatedContainer>
      </Content>
    </Container>
  );
}
