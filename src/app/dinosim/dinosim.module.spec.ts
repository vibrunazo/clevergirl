import { DinosimModule } from './dinosim.module';

describe('DinosimModule', () => {
  let dinosimModule: DinosimModule;

  beforeEach(() => {
    dinosimModule = new DinosimModule();
  });

  it('should create an instance', () => {
    expect(dinosimModule).toBeTruthy();
  });
});
