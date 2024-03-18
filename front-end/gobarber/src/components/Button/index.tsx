import { ButtonHTMLAttributes } from "react";
import { Container } from "./styles";
import { boolean } from "yup";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
};

export function Button({ children, loading, ...rest }: ButtonProps) {
  return (
    <Container type="submit" {...rest}>
      {loading ? 'Carregando...' : children}
    </Container>
  );
}
