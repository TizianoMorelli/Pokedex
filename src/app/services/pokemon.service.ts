import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  
  getAllPokemonNames() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://pokeapi.co/api/v2/'; // Definisci 'apiUrl'

  constructor(private http: HttpClient) {}

  // Metodo per ottenere la lista dei Pokémon
  getPokemonList(): Observable<any> {
    return this.http.get(`${this.apiUrl}pokemon?limit=151`);
  }

  // Metodo per ottenere i dettagli di un Pokémon specifico
  getPokemonDetail(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}pokemon/${name}`);
  }

  getPokemonSpeciesDetail(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}pokemon-species/${id}`);
  }

  getAbilityDetail(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}ability/${id}`);
  }

  getPokemonDetailById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon/${id}`);
  }
  
}
