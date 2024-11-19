import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevaClasificacionPage } from './nueva-clasificacion.page';

describe('NuevaClasificacionPage', () => {
  let component: NuevaClasificacionPage;
  let fixture: ComponentFixture<NuevaClasificacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaClasificacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
