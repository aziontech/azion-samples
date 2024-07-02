import { astroExpressiveCode, ExpressiveCodeTheme } from 'astro-expressive-code';
import { theme } from './syntax-highlighting-theme.js';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

// Allow creation of a pre-configured Expressive Code integration that matches the Astro Docs theme
export const astroDocsExpressiveCode = () =>
	astroExpressiveCode({
		theme: new ExpressiveCodeTheme(theme),
		styleOverrides: {
			codeBackground: '#151515',
			borderColor: 'var(--color-gray-90)',
			scrollbarThumbColor: 'hsl(269deg 20% 90% / 0.25)',
			scrollbarThumbHoverColor: 'hsl(269deg 20% 90% / 0.5)',
			codeFontFamily: 'var(--font-mono)'
		},
		plugins: [pluginLineNumbers()],
		defaultProps: {
			showLineNumbers: true,
			overridesByLang: {
				'js,ts,html': {
					showLineNumbers: true,
				},
			},
		}
	});