/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: 'tw-',
	important: false,
	content: [
		"./*.html",
		"./*.js",
		"./index.html",
		"./index.js",
	],
	theme: {
		extend: {
			colors: {
				primary: "#BFFE66",
				secondary: "#BDB8FF",
			}
		},
	},
	plugins: [],
}

