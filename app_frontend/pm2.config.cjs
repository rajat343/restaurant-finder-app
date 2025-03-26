module.exports = {
	apps: [
		{
			name: "app_frontend", // Name of your app
			script: "npx", // Command to run
			args: "serve -s build -l 5173", // Arguments for the serve command
		},
	],
};
