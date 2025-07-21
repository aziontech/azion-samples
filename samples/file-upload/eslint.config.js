import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ["**/*.ts"],
  extends: [tseslint.configs.recommended],
});