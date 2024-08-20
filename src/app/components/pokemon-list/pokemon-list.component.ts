import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

interface Pokemon {
  name: string;
  imageUrl: string;
  type: string[];
  order: number;
}

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  filteredPokemonList: Pokemon[] = [];
  searchTerm: string = '';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemonList().subscribe((response: any) => {
      this.pokemonList = response.results;
      this.filteredPokemonList = [...this.pokemonList];
      this.pokemonList.forEach((pokemon) => {
        this.getPokemonDetails(pokemon);
      });
    });
  }
  

  getPokemonDetails(pokemon: Pokemon) {
    // Ottieni i dettagli di ciascun Pokémon utilizzando il nome
    this.pokemonService.getPokemonDetail(pokemon.name).subscribe((details: any) => {
      // Usa l'ID del Pokémon dai dettagli per generare l'URL dell'immagine e l'ordine corretto
      pokemon.imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png`;
      pokemon.type = details.types.map((t: any) => t.type.name);
      pokemon.order = details.id;  // Usa l'ID del Pokémon come ordine
    });
  }

  padOrder(order: number): string {
    return order.toString().padStart(4, '0');
  }

  searchPokemon() {
    console.log('Search term:', this.searchTerm);  // Debug: log della ricerca
    this.filteredPokemonList = this.pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log('Filtered list:', this.filteredPokemonList);  // Debug: log della lista filtrata
  }
  
}