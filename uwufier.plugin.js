/**
 * @name uwuifier
 * @author AdiKan
 * @authorId 453136562033786880
 * @version 0.0.1
 * @description Adds a slash command to uwuify the text you send uwu.

 */

module.exports = (() => {
	const config = {
		info: {
			name: "uwuifier",
			authors: [
				{
					name: "AdiKan",
					discord_id: "453136562033786880",
					github_username: "Adeekonn",
				},
			],
			version: "0.0.1",
			description: "Adds a slash command to uwuify the text you send.",
		},
		changelog: [
			{
				title: "v0.0.1",
				items: ["Added /uwuify command for use"],
			},

		],
		main: "uwuifier.plugin.js",
	};
	const RequiredLibs = [{
		window: "ZeresPluginLibrary",
		filename: "0PluginLibrary.plugin.js",
		external: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
		downloadUrl: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
	},
	{
		window: "BunnyLib",
		filename: "1BunnyLib.plugin.js",
		external: "https://github.com/Tharki-God/BetterDiscordPlugins",
		downloadUrl: "https://tharki-god.github.io/BetterDiscordPlugins/1BunnyLib.plugin.js"
	},
	];
	return RequiredLibs.some(m => !window.hasOwnProperty(m.window))
		? handleMissingLibrarys
		: (([Plugin, ZLibrary]) => {
			const {
				Logger,
				DiscordModules: { MessageActions },
			} = ZLibrary;
			const { 
				LibraryUtils,
				ApplicationCommandAPI,
				LibraryRequires: { request },
			} = BunnyLib.build(config);
			return class uwuifier extends Plugin {
				start() {
					this.addCommand();
				}
				addCommand() {
                    ApplicationCommandAPI.register(config.info.name, {
                        name: "uwuify",
                        displayName: "uwuify",
                        displayDescription: "uwuify your text.",
                        description: "uwuify your text.",
                        type: 1,
                        target: 1,
                        execute: async ([text], { channel }) => {
                            try {
                                const uwufied = await this.uwuify(text.value);
                                MessageActions.sendMessage(
                                    channel.id,
                                    {
                                        content: uwufied,
                                        tts: false,
                                        invalidEmojis: [],
                                        validNonShortcutEmojis: [],
                                    },
                                    undefined,
                                    {}
                                );
                            } catch (err) {
                                Logger.err(err);
                                MessageActions.receiveMessage(
                                    channel.id,
                                    LibraryUtils.FakeMessage(
                                        channel.id,
                                        "Couldn't uwuify your message. Please try again later."
                                    )
                                );
                            }
                        },
                        options: [
                            {
                                description: "The text you want uwuify. uwu <3",
                                displayDescription: "The text you want uwuify. uwu <3",
                                displayName: "Text",
                                name: "Text",
                                required: true,
                                type: 3,
                            },
                        ],
                    });
                }

                uwuify(text) {
                    return new Promise((resolve, reject) => {
                        const options = [
                            `https://uwuifier-nattexd.vercel.app/api/uwuify/${encodeURI(
                                text
                            )}`,
                            { json: true },
                        ];
                        request.get(...options, (err, res, body) => {
                            if (err || (res.statusCode < 200 && res.statusCode > 400))
                                return reject("Unknown error occurred.");
                            resolve(JSON.parse(body).message);
                        });
                    });
                }

                onStop() {
                    ApplicationCommandAPI.unregister(config.info.name);
                }
            };
        })(ZLibrary.buildPlugin(config));
})();