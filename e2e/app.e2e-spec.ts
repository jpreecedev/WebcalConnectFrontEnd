import { WebcalConnectFrontEndPage } from './app.po';

describe('webcal-connect-front-end App', function() {
  let page: WebcalConnectFrontEndPage;

  beforeEach(() => {
    page = new WebcalConnectFrontEndPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
