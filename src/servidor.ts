import { createServer } from "node:http";
import { Agenda } from "./agenda.ts";

const agenda = new Agenda();
const json = (res: any, status: number, dados: unknown) => {
  res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(dados));
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (req.method === "GET" && url.pathname === "/horarios") {
    const q = url.searchParams;
    return json(res, 200, agenda.livres(q.get("profissional") ?? "", q.get("dia") ?? "", Number(q.get("minutos") ?? 30)));
  }
  if (req.method === "POST" && url.pathname === "/reservas") {
    let corpo = "";
    for await (const parte of req) corpo += parte;
    try {
      const d = JSON.parse(corpo);
      return json(res, 201, agenda.reservar(d.profissional, d.cliente, new Date(d.inicio), d.minutos));
    } catch (e) {
      return json(res, 409, { erro: (e as Error).message });
    }
  }
  const m = url.pathname.match(/^\/reservas\/(\d+)$/);
  if (req.method === "DELETE" && m) return json(res, agenda.cancelar(Number(m[1])) ? 200 : 404, {});
  json(res, 404, { erro: "rota não encontrada" });
}).listen(Number(process.env.PORT ?? 3000));
