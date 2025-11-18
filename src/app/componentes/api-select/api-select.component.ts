import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ApiSelectOption {
  value: any;
  text: string;
}

@Component({
  selector: 'app-api-select',
  templateUrl: './api-select.component.html',
  styleUrls: ['./api-select.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApiSelectComponent),
      multi: true,
    },
  ],
})
export class ApiSelectComponent implements ControlValueAccessor {
  @Input() label: string = 'Selecionar';
  @Input() options: ApiSelectOption[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() placeholder: string = 'Selecione uma opção';

  public value: any = null;
  public disabled: boolean = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

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
  onValueChange(event: any) {
    const newValue = event.detail.value;
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
  }
}
