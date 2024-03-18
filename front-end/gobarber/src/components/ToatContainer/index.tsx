import { Container } from "./styles";
import { ToastMessage } from "../../hook/ToastContext";
import { Toast } from "../Toast";
import { useTransition } from "@react-spring/web";

interface ToastContainerProps {
  messages: ToastMessage[];
}

export function ToastContainer({ messages }: ToastContainerProps) {
  const messagesWithTransitions = useTransition(messages, {
    from: { right: "-120%", opacity: 0, transform: "rotateZ(0deg)" },
    enter: { right: "0%", opacity: 1, transform: "rotateZ(360deg)" },
    leave: { right: "-120%", opacity: 0, transform: "rotateZ(0deg)" },
  });

  return (
    <Container>
      {messagesWithTransitions((props, item) => (
        <Toast style={props} message={item} />
      ))}
    </Container>
  );
}
