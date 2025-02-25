import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  imports: [ReactiveFormsModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss'
})
export class CustomInputComponent {
  @Input()
  successCondition: boolean = false

  @Input()
  controlValidators: any[] = []

  @Output()
  valueChange = new EventEmitter<string>();

  control: FormControl = new FormControl('', [...this.controlValidators])

  @Input()
  inputType: string = 'text'

  @Input()
  placeholder: string = 'placeholder'

  @Input()
  controlLabel: string = ''

  @Input()
  controlName: string = ''

  @Input()
  formGroupName?: any

  @Input()
  validationText: string = 'First Name is required and must be at least two characters long'

  get value(): string {
    return this.control.value
  }

  set value(val: string) {
    this.control.setValue(val)
    this.valueChange.emit(val)
  }


}
