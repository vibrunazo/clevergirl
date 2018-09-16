import { TuringModule } from './turing.module';

describe('TuringModule', () => {
  let turingModule: TuringModule;

  beforeEach(() => {
    turingModule = new TuringModule();
  });

  it('should create an instance', () => {
    expect(turingModule).toBeTruthy();
  });
});
