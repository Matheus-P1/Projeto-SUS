import { Injectable } from '@angular/core';

export interface RegistroPressao {
  maxima: string;
  minima: string;
  data: string;
}
export interface RegistroGlicose {
  valor: string;
  data: string;
}
export interface RegistroIMC {
  valor: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiarioSaudeService {

  private registrosPressao: RegistroPressao[] = [];
  private registrosGlicose: RegistroGlicose[] = [];
  private registrosIMC: RegistroIMC[] = [];

  constructor() {
    this.registrosPressao.push({ maxima: '14', minima: '8', data: '2025-11-17' });
  }

  getRegistrosPressao(): RegistroPressao[] {
    return this.registrosPressao;
  }
  getRegistrosGlicose(): RegistroGlicose[] {
    return this.registrosGlicose;
  }
  getRegistrosIMC(): RegistroIMC[] {
    return this.registrosIMC;
  }

  addRegistroPressao(dados: RegistroPressao) {
    this.registrosPressao.push(dados);
    console.log('Serviço: Novo registro de PRESSÃO adicionado!', dados);
  }
  addRegistroGlicose(dados: RegistroGlicose) {
    this.registrosGlicose.push(dados);
    console.log('Serviço: Novo registro de GLICOSE adicionado!', dados);
  }
  addRegistroIMC(dados: RegistroIMC) {
    this.registrosIMC.push(dados);
    console.log('Serviço: Novo registro de IMC adicionado!', dados);
  }

}