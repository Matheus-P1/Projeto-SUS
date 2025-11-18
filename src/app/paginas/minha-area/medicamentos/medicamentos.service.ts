import { Injectable } from '@angular/core';

export interface Medicamento {
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  private STORAGE_KEY = 'meus_medicamentos';
  private medicamentos: Medicamento[] = [];

  constructor() {
    this.carregarDoStorage();
  }

  private carregarDoStorage() {
    const dados = localStorage.getItem(this.STORAGE_KEY);
    if (dados) {
      this.medicamentos = JSON.parse(dados);
    }
  }

  getMedicamentos(): Medicamento[] {
    return this.medicamentos;
  }

  adicionarMedicamento(nome: string) {
    if (nome && !this.medicamentos.some(m => m.nome === nome)) {
      this.medicamentos.push({ nome });
      this.salvarNoStorage();
    }
  }

  removerMedicamento(nome: string) {
    this.medicamentos = this.medicamentos.filter(m => m.nome !== nome);
    this.salvarNoStorage();
  }

  private salvarNoStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.medicamentos));
  }
}