import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { ListComponentService } from '../service/list-component.service';
import { PersonRequestViewModel } from '../../model/PersonRequestViewModel';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss'],
})
export class AddPersonComponent implements OnInit {
  personForm!: FormGroup;
  gender: any[] = [
    {
      name: 'Masculino',
      value: 'M',
    },
    {
      name: 'Feminino',
      value: 'F',
    },
    {
      name: 'Masculino Transgênero',
      value: 'MT',
    },
    {
      name: 'Feminino Transgênero',
      value: 'FT',
    },
    {
      name: 'Não-Binário',
      value: 'NB',
    },
  ];
  searching: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddPersonComponent>,
    private _formBuilder: FormBuilder,
    private _service: ListComponentService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCep();
    this.function()
  }

  createForm(): void {
    this.personForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      gender: [null, [Validators.required]],
      zipCode: ['', [Validators.required]],
      city: [null, [Validators.required]],
      neighborhood: [null, [Validators.required]],
      state: [null, [Validators.required]],
    });
  }

  getCep() {
    this.searching = true;
    this.personForm
      .get('zipCode')
      ?.valueChanges.pipe(debounceTime(200))
      .subscribe((formValue) => {
        this._service.getCep(formValue).subscribe((res) => {
          this.personForm.patchValue({
            city: res.localidade,
            neighborhood: res.bairro,
            state: res.uf,
          });
          this.searching = false;
        });
      });
  }

  createPerson() {
    let request: PersonRequestViewModel = {
      name: this.personForm.get('name')?.value,
      gender: this.personForm.get('gender')?.value,
      city: this.personForm.get('city')?.value,
      neighborhood: this.personForm.get('neighborhood')?.value,
      state: this.personForm.get('state')?.value,
    };
    this.function()
    this._service.postPerson(request).subscribe({
      next: () => {
        this.dialogRef.close()
      }
    })
  }

  function() {
     this.personForm.get('name')?.valueChanges
     .pipe(debounceTime(200)).subscribe(res => {
      let name2 = res.toUpperCase()
      console.log(name2)
    })

  }
}
