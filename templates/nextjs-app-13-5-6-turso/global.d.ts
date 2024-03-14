declare namespace Azion {
  export const env: {
    get: (key: string) => string | null;
  };
}