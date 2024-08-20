import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})

export class PokemonDetailComponent implements OnInit {
  pokemon: any;
  flavorText: string = '';
  italianAbilityNames: string[] = [];
  previousPokemonName: string = '';
  nextPokemonName: string = '';
  previousPokemonId: number = 0;
  nextPokemonId: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const name = params['name'];
      if (name) {
        this.pokemonService.getPokemonDetail(name).subscribe({
          next: (response) => {
            this.pokemon = response;
            this.getPokemonSpeciesDetails(response.id);
            this.loadAbilityNamesInItalian(response.abilities);

            // Aggiorna i Pokémon precedente e successivo
            this.previousPokemonId = this.pokemon.id - 1;
            this.nextPokemonId = this.pokemon.id + 1;

            this.loadPreviousPokemonName(this.previousPokemonId);
            this.loadNextPokemonName(this.nextPokemonId);
          },
          error: (err) => {
            console.error('Errore nella richiesta del Pokémon:', err);
            this.pokemon = null;
          }
        });
      }
    });
  }

  getPokemonSpeciesDetails(id: number): void {
    this.pokemonService.getPokemonSpeciesDetail(id).subscribe({
      next: (response) => {
        const flavorTextEntry = response.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'it'
        );
        if (flavorTextEntry) {
          this.flavorText = flavorTextEntry.flavor_text;
        } else {
          this.flavorText = 'No flavor text available';
        }
      },
      error: (err) => {
        console.error('Errore nella richiesta dei dettagli della specie del Pokémon:', err);
      }
    });
  }

  loadAbilityNamesInItalian(abilities: any[]): void {
    if (!abilities || abilities.length === 0) {
      this.italianAbilityNames = [];
      return;
    }

    const abilityDetailsRequests = abilities.map((ability: any) =>
      this.pokemonService.getAbilityDetail(ability.ability.url.split('/').filter(Boolean).pop())
    );

    forkJoin(abilityDetailsRequests).subscribe({
      next: (responses) => {
        this.italianAbilityNames = responses.flatMap((response: any) =>
          response.names
            .filter((name: any) => name.language.name === 'it')
            .map((name: any) => name.name)
        );
      },
      error: (err) => {
        console.error('Errore nella richiesta dei dettagli delle abilità:', err);
        this.italianAbilityNames = [];
      }
    });
  }

  loadPreviousPokemonName(id: number): void {
    if (id > 0) {
      this.pokemonService.getPokemonDetailById(id).subscribe({
        next: (response) => {
          this.previousPokemonName = response.name;
          console.log('Nome Pokémon precedente:', this.previousPokemonName); // Verifica il valore
        },
        error: (err) => {
          console.error('Errore nel caricamento del Pokémon precedente:', err);
        }
      });
    }
  }
  
  loadNextPokemonName(id: number): void {
    this.pokemonService.getPokemonDetailById(id).subscribe({
      next: (response) => {
        this.nextPokemonName = response.name;
        console.log('Nome Pokémon successivo:', this.nextPokemonName); // Verifica il valore
      },
      error: (err) => {
        console.error('Errore nel caricamento del Pokémon successivo:', err);
      }
    });
  }
  

  // Funzione per ottenere il nome del Pokémon successivo
  nextPokemon(): void {
    const nextId = this.pokemon.id + 1;
    this.pokemonService.getPokemonDetailById(nextId).subscribe({
      next: (response) => {
        this.router.navigate(['/pokemon', response.name]);
      },
      error: (err) => {
        console.error('Errore nella richiesta del Pokémon successivo:', err);
      }
    });
  }

  // Funzione per ottenere il nome del Pokémon precedente
  previousPokemon(): void {
    const prevId = this.pokemon.id - 1;
    if (prevId > 0) {
      this.pokemonService.getPokemonDetailById(prevId).subscribe({
        next: (response) => {
          this.router.navigate(['/pokemon', response.name]);
        },
        error: (err) => {
          console.error('Errore nella richiesta del Pokémon precedente:', err);
        }
      });
    }
  }

  padOrder(order: number): string {
    return order.toString().padStart(4, '0');
  }
}

