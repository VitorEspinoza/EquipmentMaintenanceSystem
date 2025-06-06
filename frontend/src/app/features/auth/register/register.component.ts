import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AddressService } from '../../../shared/services/address.service';
import { City } from '../models/city';
import { State } from '../models/state';
import { AuthService } from '../services/auth.service';

const MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatOptionModule,
  MatSelectModule,
  MatAutocompleteModule,
];
const FORM_MODULES = [ReactiveFormsModule, FormsModule];
const COMMON_MODULES = [NgIf, CommonModule];
const CORE_MODULES = [RouterModule];
const NGXCONFIG = [NgxMaskDirective, NgxMaskPipe];

@Component({
  selector: 'app-register',
  imports: [...COMMON_MODULES, ...CORE_MODULES, ...MATERIAL_MODULES, ...FORM_MODULES, ...NGXCONFIG],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly addressService = inject(AddressService);

  cities: City[] = [];
  states: State[] = [];
  filteredStates: Observable<State[]> | undefined;
  filteredCities: Observable<City[]> | undefined;

  registerForm!: FormGroup;

  stateValidator = (control: AbstractControl): ValidationErrors | null => {
    const stateValue = control.value;
    const isValidState = this.states.some(state => state.nome === stateValue);
    return isValidState ? null : { invalidState: true };
  };

  cityValidator = (control: AbstractControl): ValidationErrors | null => {
    const cityValue = control.value;
    const isValidCity = this.cities.some(city => city.nome === cityValue);
    return isValidCity ? null : { invalidCity: true };
  };

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.pattern(/^.{11}$/)]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      zipcode: ['', [Validators.required, Validators.pattern(/^.{8}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^.{10,11}$/)]],
      street: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.pattern('^[0-9]{1,6}$')]],
      neighbourhood: ['', [Validators.required]],
      city: ['', [Validators.required, this.cityValidator]],
      state: ['', [Validators.required, this.stateValidator]],
      complement: [''],
    });

    let zipCodeFlag = false;

    this.registerForm
      .get('zipcode')
      ?.valueChanges.pipe(
        switchMap(value => {
          if (value && value.length === 8) {
            return this.addressService
              .searchAddressByZipcode(value)
              .pipe(catchError(() => of('Erro ao acessar api Viacep!')));
          }
          return of(null);
        })
      )
      .subscribe({
        next: (endereco: { logradouro: string; bairro: string; localidade: string; estado: string }) => {
          if (endereco) {
            this.registerForm.patchValue({
              street: endereco.logradouro,
              neighbourhood: endereco.bairro,
              city: endereco.localidade,
              state: endereco.estado,
            });

            this.registerForm.get('state')?.setValue(endereco.estado, { emitEvent: false });
            this.registerForm.get('city')?.setValue(endereco.localidade, { emitEvent: false });
            this.registerForm.get('city')?.updateValueAndValidity();
            zipCodeFlag = true;
          }
        },
        error: (message: string) => {
          console.error(message);
        },
      });

    this.addressService.searchStates().subscribe((data: State[]) => {
      this.states = data.sort((a, b) => a.nome.localeCompare(b.nome));
      this.registerForm.get('state')!.setValue(this.registerForm.get('state')!.value || '');
    });

    this.filteredStates = this.registerForm.get('state')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value || ''))
    );

    this.registerForm
      .get('state')
      ?.valueChanges.pipe(
        switchMap(stateName => {
          if (stateName) {
            const state = this.states.find(s => s.nome.toLowerCase() === stateName.toLowerCase());
            if (state) {
              console.log(state);
              return this.addressService
                .searchCitiesByState(state.id)
                .pipe(catchError(() => of('Erro ao acessar cidades da api IBGE!')));
            }
          }
          return of(null);
        })
      )
      .subscribe((data: City[] | null) => {
        if (data) {
          this.cities = data.sort((a, b) => a.nome.localeCompare(b.nome));
          this.filteredCities = this.registerForm.get('city')?.valueChanges.pipe(
            startWith(''),
            map(value => this._filterCities(value || ''))
          );
        } else {
          this.cities = [];
          this.filteredCities = of([]);
        }

        if (!zipCodeFlag) {
          this.registerForm.get('city')?.setValue(null);
        }

        this.registerForm.get('city')?.updateValueAndValidity();
        zipCodeFlag = false;
      });
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => state.nome.toLowerCase().includes(filterValue));
  }

  private _filterCities(value: string): City[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city => city.nome.toLowerCase().includes(filterValue));
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const raw = this.registerForm.value;

    const payload = {
      cpf: raw.cpf,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      address: {
        zipcode: raw.zipcode,
        street: raw.street,
        number: raw.number,
        neighbourhood: raw.neighbourhood,
        city: raw.city,
        state: raw.state,
        complement: raw.complement,
      },
    };

    this.authService.register(payload).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
