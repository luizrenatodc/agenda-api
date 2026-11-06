// Regras de agenda: horários livres e reserva sem conflito.
export type Reserva = { id: number; profissional: string; cliente: string; inicio: Date; minutos: number };
export type Expediente = { abre: number; fecha: number; passo: number }; // em minutos do dia

export const conflita = (a: Date, am: number, b: Date, bm: number) =>
  a.getTime() < b.getTime() + bm * 60000 && b.getTime() < a.getTime() + am * 60000;

export class Agenda {
  reservas: Reserva[] = [];
  proximo = 1;
  expediente: Expediente;
  constructor(expediente: Expediente = { abre: 540, fecha: 1080, passo: 30 }) {
    this.expediente = expediente;
  }

  livres(profissional: string, dia: string, minutos: number): string[] {
    const { abre, fecha, passo } = this.expediente;
    const saida: string[] = [];
    for (let m = abre; m + minutos <= fecha; m += passo) {
      const hora = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      if (!this.ocupado(profissional, new Date(`${dia}T${hora}:00`), minutos)) saida.push(hora);
    }
    return saida;
  }

  reservar(profissional: string, cliente: string, inicio: Date, minutos: number): Reserva {
    if (Number.isNaN(inicio.getTime()) || minutos <= 0) throw new Error("dados inválidos");
    if (this.ocupado(profissional, inicio, minutos)) throw new Error("horário ocupado");
    const r = { id: this.proximo++, profissional, cliente, inicio, minutos };
    this.reservas.push(r);
    return r;
  }

  cancelar(id: number) {
    const antes = this.reservas.length;
    this.reservas = this.reservas.filter((r) => r.id !== id);
    return this.reservas.length < antes;
  }

  ocupado(profissional: string, inicio: Date, minutos: number) {
    return this.reservas.some((r) => r.profissional === profissional && conflita(r.inicio, r.minutos, inicio, minutos));
  }
}
