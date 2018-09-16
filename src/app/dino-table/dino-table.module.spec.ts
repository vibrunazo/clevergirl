import { DinoTableModule } from './dino-table.module';

describe('DinoTableModule', () => {
  let dinoTableModule: DinoTableModule;

  beforeEach(() => {
    dinoTableModule = new DinoTableModule();
  });

  it('should create an instance', () => {
    expect(dinoTableModule).toBeTruthy();
  });
});
