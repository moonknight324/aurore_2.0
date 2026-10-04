import { parseEnv } from './parseEnv';

describe('parseEnv', () => {
  it('returns defaults when vars are missing', () => {
    expect(parseEnv({})).toEqual({ apiUrl: 'http://localhost:4000/api/v1', useMocks: false });
  });

  it('reads provided values', () => {
    expect(
      parseEnv({ VITE_API_URL: 'https://api.example.com/api/v1', VITE_USE_MOCKS: 'true' }),
    ).toEqual({
      apiUrl: 'https://api.example.com/api/v1',
      useMocks: true,
    });
  });

  it('strips trailing slashes from the API URL', () => {
    expect(parseEnv({ VITE_API_URL: 'https://api.example.com/api/v1//' }).apiUrl).toBe(
      'https://api.example.com/api/v1',
    );
  });

  it('falls back to the default when the API URL is blank', () => {
    expect(parseEnv({ VITE_API_URL: '   ' }).apiUrl).toBe('http://localhost:4000/api/v1');
  });

  it('treats VITE_USE_MOCKS case-insensitively and anything but "true" as false', () => {
    expect(parseEnv({ VITE_USE_MOCKS: 'TRUE' }).useMocks).toBe(true);
    expect(parseEnv({ VITE_USE_MOCKS: 'yes' }).useMocks).toBe(false);
  });
});
