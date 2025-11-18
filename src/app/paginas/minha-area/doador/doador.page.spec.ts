import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoadorPage } from './doador.page';

describe('DoadorPage', () => {
  let component: DoadorPage;
  let fixture: ComponentFixture<DoadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
