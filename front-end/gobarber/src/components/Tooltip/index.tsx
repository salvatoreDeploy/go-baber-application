import React, { ReactNode } from "react";
import { Container } from "./styles";

interface TooltipProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ title, className, children }: TooltipProps) {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
}
