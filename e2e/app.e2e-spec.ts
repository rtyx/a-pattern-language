import { APatternLanguagePage } from './app.po';

describe('a-pattern-language App', () => {
  let page: APatternLanguagePage;

  beforeEach(() => {
    page = new APatternLanguagePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
