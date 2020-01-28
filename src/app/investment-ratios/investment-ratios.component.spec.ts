import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentRatiosComponent } from './investment-ratios.component';

describe('InvestmentRatiosComponent', () => {
  let component: InvestmentRatiosComponent;
  let fixture: ComponentFixture<InvestmentRatiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentRatiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentRatiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
