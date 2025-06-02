import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DiagnosisApiResponse {
  planta_saudavel: boolean;
  nome_doenca_praga: string;
  descricao: string;
  sugestoes_tratamento: string[];
}

export interface AnalysisData {
  id: number;
  imagePath: string;
  diagnosis: DiagnosisApiResponse;
}

const LOCAL_STORAGE_KEY = 'savedAnalysesPlantApp';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService {
  private latestAnalysisSubject = new BehaviorSubject<AnalysisData | null>(null);
  private savedAnalysesSubject = new BehaviorSubject<AnalysisData[]>([]);

  constructor() {
    const analyses = this.loadAnalysesFromLocalStorage();
    this.savedAnalysesSubject.next(analyses);
  }

  setLatestAnalysis(data: Omit<AnalysisData, 'id'>): void {
    const analysisWithId: AnalysisData = { ...data, id: Date.now() };
    this.latestAnalysisSubject.next(analysisWithId);
  }

  getLatestAnalysis(): Observable<AnalysisData | null> {
    return this.latestAnalysisSubject.asObservable();
  }

  getSavedAnalyses(): Observable<AnalysisData[]> {
    return this.savedAnalysesSubject.asObservable();
  }

  saveAnalysis(analysisToSave: AnalysisData): void {
    try {
      const currentAnalyses = [...this.savedAnalysesSubject.getValue()];
      if (!currentAnalyses.find(a => a.id === analysisToSave.id)) {
        currentAnalyses.unshift(analysisToSave);
        this.saveAnalysesToLocalStorage(currentAnalyses);
        this.savedAnalysesSubject.next(currentAnalyses);
        this.latestAnalysisSubject.next(null);
      }
    } catch (e) {
      console.error('Erro ao salvar análise no localStorage:', e);
      // Tratar o erro conforme necessário (ex: toast para o usuário)
    }
  }

  deleteAnalysis(analysisId: number): void {
    try {
      let currentAnalyses = [...this.savedAnalysesSubject.getValue()];
      currentAnalyses = currentAnalyses.filter(a => a.id !== analysisId);
      this.saveAnalysesToLocalStorage(currentAnalyses);
      this.savedAnalysesSubject.next(currentAnalyses);
    } catch (e) {
      console.error('Erro ao deletar análise do localStorage:', e);
      // Tratar o erro
    }
  }

  private saveAnalysesToLocalStorage(analyses: AnalysisData[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(analyses));
    console.log('Análises salvas no localStorage.');
  }

  private loadAnalysesFromLocalStorage(): AnalysisData[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data) as AnalysisData[];
      } catch (e) {
        console.error('Erro ao parsear análises do localStorage:', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return [];
      }
    }
    return [];
  }

  clearAnalysis(): void {
    this.latestAnalysisSubject.next(null);
  }
}
