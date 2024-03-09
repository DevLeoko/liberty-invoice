/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				blue: {
					500: '#004ee7',
					600: '#003cb3',
					700: '#00349a',
				},

				gray: {
					150: '#eff0f2',
				},
			},
			screens: {
				xs: '475px',
				xxs: '370px',
			},
		},
	},
	plugins: [],
	safelist: [
		'bg-red-500',
		'bg-green-500',
		'bg-blue-500',
		'bg-yellow-500',
		'bg-gray-700',
		'border-red-500',
		'border-green-500',
		'border-blue-500',
		'border-yellow-500',
		'border-gray-700',
		'text-red-500',
		'text-green-500',
		'text-blue-500',
		'text-yellow-500',
		'text-gray-700',
	],
}
