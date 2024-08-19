import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any; // Dichiara la variabile pokemon

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name'); // Ottieni il nome dal parametro della rotta
    if (name) {
      this.pokemonService.getPokemonDetail(name).subscribe({
        next: (response) => {
          this.pokemon = response; // Assegna la risposta a pokemon
        },
        error: (err) => {
          console.error('Errore nella richiesta del Pokémon:', err);
          this.pokemon = null; // Gestisci l'errore, ad esempio impostando pokemon a null
        }
      });
    }
  }
}
