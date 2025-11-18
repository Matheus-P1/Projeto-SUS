import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiarioSaudePage } from './diario-saude.page';

describe('DiarioSaudePage', () => {
  let component: DiarioSaudePage;
  let fixture: ComponentFixture<DiarioSaudePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiarioSaudePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
