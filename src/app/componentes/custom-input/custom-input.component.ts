import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor, OnInit {
  public showPassword = false;
  public isPasswordType: boolean = false;
  @Input() label: string = 'Campo';
  @Input() placeholder: string = 'Digite aqui...';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string | null = null;
  @Input() maxlength: number | null = null;
  @Input() iconName: string | null = null;

  public value: any = null;
  public isFocused: boolean = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.isPasswordType = this.type === 'password';
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  onFocus() {
    this.isFocused = true;
  }

  get inputType(): string {
    if (this.isPasswordType) {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  get passwordToggleIcon(): string {
    return this.showPassword ? 'eye-outline' : 'eye-off-outline';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
