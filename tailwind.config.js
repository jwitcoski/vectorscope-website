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
				primary: "#1A73E8",
				secondary: "#34A853",
			},
			backgroundColor: {
				page: "#F8F9FA",
			},
		},
	},
	plugins: [],
}

