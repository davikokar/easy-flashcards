import { APP_VERSION } from '../src/utils/appInfo';

describe('APP_VERSION', () => {
  it('is the dotted version from package.json', () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
