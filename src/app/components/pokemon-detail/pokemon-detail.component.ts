import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any; // Dichiara la variabile pokemon
  flavorText: string = ''; // Aggiungi una variabile per il flavor text

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name'); // Ottieni il nome dal parametro della rotta
    if (name) {
      this.pokemonService.getPokemonDetail(name).subscribe({
        next: (response) => {
          this.pokemon = response; // Assegna la risposta a pokemon
          this.getPokemonSpeciesDetails(response.id); // Ottieni i dettagli della specie del Pokémon
        },
        error: (err) => {
          console.error('Errore nella richiesta del Pokémon:', err);
          this.pokemon = null; // Gestisci l'errore, ad esempio impostando pokemon a null
        }
      });
    }
  }
  

  // Funzione per ottenere i dettagli della specie del Pokémon
  getPokemonSpeciesDetails(id: number): void {
    this.pokemonService.getPokemonSpeciesDetail(id).subscribe({
      next: (response) => {
        const flavorTextEntry = response.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'it' // Cambia 'it' con 'en' per l'inglese
        );
  
        if (flavorTextEntry) {
          this.flavorText = flavorTextEntry.flavor_text;
        } else {
          this.flavorText = 'No flavor text available'; // Imposta un testo predefinito se non trovato
        }
      },
      error: (err) => {
        console.error('Errore nella richiesta dei dettagli della specie del Pokémon:', err);
      }
    });
  }
  

  padOrder(order: number): string {
    return order.toString().padStart(4, '0');
  }
}
