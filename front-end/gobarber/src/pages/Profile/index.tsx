import { AvatarInput, Container, Content } from "./styles"
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiUser, FiLock, FiCamera, FiHome } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import getValidationError from "../../utils/getValidationError";
import { api } from "../../services/api";
import { useToast } from "../../hook/ToastContext";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ChangeEvent, useCallback, useRef } from "react";
import { useAuth } from "../../hook/AuthContext";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

export function Profile() {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { userPresenter: user, updateUser } = useAuth()

  //console.log(formRef);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      //console.log(data);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome é Obrigatorio"),
          email: Yup.string()
            .required("E-mail é obrigatorio")
            .email("Digite um e-mail válido"),
          old_password: Yup.string().optional(),
          password: Yup.string().when('old_password', {
            is: (value: string) => !!value.length,
            then: Yup.string().required('Campo obrigatorio!'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string().when('old_password', {
            is: (value: string) => !!value.length,
            then: Yup.string().required('Campo obrigatorio!'),
            otherwise: Yup.string()
          }).oneOf([Yup.ref('password'), null], 'Confirmação incorreta!')
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(data.old_password
            ? {
              old_password,
              password,
              password_confirmation,
            }
            : {}),
        };

        const response = await api.put('profile/', formData)

        updateUser(response.data)

        navigate("/dashboard");

        addToast({
          type: "success",
          title: "Atualização realizada com sucesso",
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
    [addToast, navigate, updateUser]
  );

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {

    if (e.target.files) {
      /* console.log(e.target.files[0]) */

      const data = new FormData()

      data.append('avatar', e.target.files[0])

      api.patch('/users/uploadavatar', data).then((response) => {
        updateUser(response.data)

        addToast({
          type: 'success',
          title: 'Avatar Atualizado'
        })
      })
    }
  }, [addToast, updateUser])

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiHome />
          </Link>
        </div>
      </header>

      <Content>
        <Form ref={formRef} initialData={{ name: user.name, email: user.email }} onSubmit={handleSubmit}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>

          </AvatarInput>

          <h1>Meu perfil</h1>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            constainerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha Atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova Senha"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar Senha"
          />
          <Button>Confirmar</Button>
        </Form>
      </Content>
    </Container>
  );
}
