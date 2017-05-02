import { LttoPage } from './app.po';

describe('ltto App', () => {
  let page: LttoPage;

  beforeEach(() => {
    page = new LttoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
