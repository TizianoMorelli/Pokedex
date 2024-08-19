import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { RouterLink } from '@angular/router';

interface Pokemon {
  name: string;
  imageUrl: string;
  type: string[];
}

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemonList().subscribe((response: any) => {
      this.pokemonList = response.results;
      this.pokemonList.forEach((pokemon, index) => {
        pokemon.imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`;
        this.getPokemonDetails(pokemon, index + 1);
      });
    });
  }

  getPokemonDetails(pokemon: Pokemon, id: number) {
    this.pokemonService.getPokemonDetail(id.toString()).subscribe((details: any) => {
      pokemon.type = details.types.map((t: any) => t.type.name);
    });
  }
  
}