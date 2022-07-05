const { Command, Option } = require('commander');
const program = new Command();
const axios = require('axios');

program
    .name('gisty')
    .description('CLI interface to Github Gists')
    .version('0.0.1');

program
    .addOption(new Option('-g, --github-token <string>', 'github_token').env('GITHUB_TOKEN'));

program.command('gisty')
    .description('CLI interface to Github Gists')
    .argument('<username>', 'user to get gists for')
    .option('--all -a', 'display all gists (defaults to just the gists created since you last ran the command)')
    .option('-o --output <json|list>', 'how to display the output', 'list')
    .option('--per-page <int>', 'how to display the output', 30)
    .action(async (username, options) => {
        // console.info(options);process.exit(1);
        const tmp = await axios
            .get(
                'https://api.github.com/users/' + username + '/gists',
                {
                    headers: {
                        'Accept': 'application/vnd.github+json',
                        'Authorization': 'token ' + process.env.GITHUB_TOKEN,
                    },
                    params: { per_page: options.perPage }
                });

        console.log("Tmp done");
        // axios
        //     .get(
        //         'https://api.github.com/users/' + username + '/gists',
        //         {
        //             headers: {
        //                 'Accept': 'application/vnd.github+json',
        //                 'Authorization': 'token ' + process.env.GITHUB_TOKEN,
        //             },
        //             params: { per_page: options.perPage }
        //         })
        //     // TODO handle pagination
        //     .then(res => {
        //         // console.info(res);process.exit(1);
        //         const cachedData = res.data;
        //
        //         if ('list' === options.output) {
        //             const data = cachedData.map(d => d.description || '<No description>' + ' - ' +  d.updated_at + "\n  " + d.html_url);
        //             console.log(data);
        //         } else {
        //             console.log(cachedData);
        //         }
        //
        //         if (res.data.length === parseInt(options.perPage, 10)) {
        //             console.log("... There are more page options")
        //         }
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
    });

program.parse();
