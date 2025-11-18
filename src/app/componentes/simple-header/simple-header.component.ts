import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-simple-header',
  templateUrl: './simple-header.component.html',
  styleUrls: ['./simple-header.component.scss'],
  standalone: false,
})
export class SimpleHeaderComponent {
  @Input() titulo: string = 'Título';

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
