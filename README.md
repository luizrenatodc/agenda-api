# API de agendamento

API REST para consultar horários livres e reservar atendimentos sem conflito entre clientes.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js_24-339933?logo=nodedotjs&logoColor=white)

## O problema

Clínicas, salões e estúdios perdem tempo marcando horário por telefone, e a agenda de papel permite dois clientes no mesmo horário. O coração de qualquer sistema de agendamento é responder duas perguntas com segurança: o que está livre e se esta reserva pode entrar.

## O que ela faz

- Lista os horários livres de um profissional, considerando expediente e duração do serviço.
- Impede reservas sobrepostas para o mesmo profissional.
- Permite o mesmo horário para profissionais diferentes.
- Cancela reservas e devolve o horário para a agenda.

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/horarios?profissional=ana&dia=2030-01-07&minutos=30` | Lista os horários livres |
| `POST` | `/reservas` | Cria uma reserva (`409` se houver conflito) |
| `DELETE` | `/reservas/:id` | Cancela uma reserva |

## Como funciona

Dois intervalos se sobrepõem quando cada um começa antes do fim do outro:

```text
inicioA < fimB  e  inicioB < fimA
```

Com essa regra, horários encostados (10h às 11h e 11h às 11h30) não geram conflito. A mesma função serve tanto para listar os horários livres quanto para validar uma reserva, então as duas respostas nunca divergem.

## Decisões técnicas

| Decisão | Motivo |
| --- | --- |
| Regras separadas do HTTP | `agenda.ts` é testado sem subir servidor. |
| Validação também na reserva | A lista de horários pode estar desatualizada quando o cliente confirma. |
| Sem dependências | O foco do projeto é a regra de negócio. |

## Como rodar

Requer Node.js 24 ou superior.

```bash
npm test
npm start
```

```bash
curl "localhost:3000/horarios?profissional=ana&dia=2030-01-07&minutos=30"
curl -X POST localhost:3000/reservas -d '{"profissional":"ana","cliente":"João","inicio":"2030-01-07T10:00:00","minutos":60}'
```

## Próximos passos

- Persistir em PostgreSQL, com restrição de exclusão para garantir o bloqueio também no banco.
- Tratar fuso horário de forma explícita.
- Enviar lembrete antes do atendimento.

## Sobre este projeto

Projeto de demonstração, com dados e empresas fictícios, criado para mostrar a abordagem técnica de forma simples.

## Autor

**Luiz Renato Carvalho**, Engenheiro de Software e IA · [luizrenato.dev](https://www.luizrenato.dev) · [LinkedIn](https://linkedin.com/in/luizrenatodc)
