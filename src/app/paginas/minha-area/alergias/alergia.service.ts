import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlergiaService {

  constructor() { }

  private getChaveUsuario(): string {
    const usuarioLogadoId = localStorage.getItem('userId_logado');

    const idFinal = usuarioLogadoId ? usuarioLogadoId : 'visitante';

    return `alergias_${idFinal}`;
  }

  salvarAlergias(alergias: any[]) {
    const chave = this.getChaveUsuario();
    localStorage.setItem(chave, JSON.stringify(alergias));
    console.log(`Dados salvos na gaveta (${chave}):`, alergias);
  }

  carregarAlergias(): any[] {
    const chave = this.getChaveUsuario();
    const dados = localStorage.getItem(chave);

    if (dados) {
      return JSON.parse(dados);
    } else {
      return [];
    }
  }

  limparDadosLocais() {
      const chave = this.getChaveUsuario();
      localStorage.removeItem(chave);
  }
}