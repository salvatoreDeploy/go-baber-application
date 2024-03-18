# Usuario:

## RF - Requisitos Funcionais

[X] - Deve ser possivel o usuario Recuperar Senha informando seu email;
[X] - Deve ser possivel o usuario receber um e-mail com instruções para recupaerar a senha;
[X] - Deve ser possivel o usuario resetar sua senha;

[] - Deve haver um painel para o prestador;
[] - Dever ser possivel listar o agendamento para o dia especifico;
[] - Deve ser possivel receber as notificações sempre que houver um agendamento novo;
[] - Dever ser possivel visualizar notificações não lida;

[X] - Deve ser possivel atualizar os dados do seu perfil;

## RN - Regra de Negocios

[X] - Não deve ser possivel o usuario poder utilizar o link enviado de recuparar a senha, após 2 horas;
[X] - Não deve ser possivel o usuario poder resetar a senha sem confirmar a mesma;
[X] - Não deve ser possivel o usuario alterar seu email para um email ja utilizado;
[X] - Não deve ser possivel o usuario altera sua senha sem informa a antiga senha;
[] - Não deve ser possivel que o agendamento dure mais de 1 hora
[] - Não deve ser possivel que exista agendamaentos antes das 08:00 da manhão e após 17:00;
[] - Não deve ser possivel que exista agendamentos duplicados;
[] - Não deve ser possivel que exista agendamentos em horarios passados;
[] - Não deve ser possivel que exista agendamentos consigo mesmo;
[] - Não deve ser possivel que exista notificações sem status sendo lidas ou não lidas;

## RNF - Requisitos não Funcionais

[X] - Utilizar Mailtrap para testar e-mail em ambiente de desenvolvimento;
[] - Utilizar o Amazon SES para envio em produção;
[] - O envio de e-mails deve acontecer em segundo plano (background job);
[] - Listagem de Prestradores será usado armazenamento de cache;
[] - Listagem de Agendamentos será usado armazenamento de cache
[] - Notificações do prestador devem ser armazenadas no MongoDB;
[] - A notificação do prestador devem ser enviadas em tempo real utilizando Socket.IO;

# Agendamentos:

## RF - Requisitos Funcionais

[] - O Usuario deve ser possivel listar todos prestadores de serviço;
[] - O Usuario deve ser possivel os dias de um mês com pelo menos um dia disponivel de um prestador;
[] - O Usuario deve ser possivel listar horarios disponiveis de um prestador especifico;
[] - O Usuario deve ser possivel realizar um novo agendamento com um prestador;

## RN - Regra de Negocios

[] - Cada Agendamento deve durar 60 minutos exatamente;
[] - Os agendamentos devem estar dentro do horario 8hs as 18hs (sendo primeiro as 8 horas e o ultimo as 17hrs);
[] - O usuario não pode relizar um agendamento num horario ocupado;
[] - O usuario não pode agendar em um horario que ja passou;
[] - O usuario não pode agendar um horario consigo mesmo;

## RNF - Requisitos não Funcionais

[] - A Listagem de prestadores deve ser feita em cache
