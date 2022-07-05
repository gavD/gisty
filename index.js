const { Command, Option } = require('commander');
const program = new Command();
const axios = require('axios');
const fs = require('fs');


function getSince(username) {
    const path = '.cache/' + username;
    if (fs.existsSync(path)) {
        const since = fs.readFileSync(path, {encoding:'utf8', flag:'r'});
        // console.log({
        //     since,
        //     foo: Date.parse(since),
        //     out: new Date(Date.parse(since) + 1).toISOString()
        // });
        //slightly bump it
        return new Date(Date.parse(since) + 1).toISOString();

    }
    return null;
}

function cacheResultsToDisk(allResults, username) {
    // what is the highest number
    if (allResults.length > 0) {
        // assumption - the first result returned is the most recent one.
        // This is what I have observed in all tests.
        const mostRecentUpdate = allResults[0].created_at;
        fs.writeFileSync('.cache/' + username, mostRecentUpdate, 'utf8');
    }
}

function displayResults(allResults, output) {
    if ('list' === output) {
        const data = allResults.map(d => (d.description || '<No description>') + ' - ' +  d.updated_at + "\n  " + d.html_url);
        console.log(data.join("\n"));
    } else {
        console.log(allResults);
    }
}

program
    .name('gisty')
    .description('CLI interface to Github Gists')
    .version('0.0.1')
    .addOption(new Option('-g, --github-token <string>', 'github_token').env('GITHUB_TOKEN'))
    .argument('<username>', 'user to get gists for')
    .option('-a --all', 'display all gists (defaults to just the gists created since you last ran the command)')
    .option('-o --output <json|list>', 'how to display the output', 'list')
    .option('-d --debug', 'Debug mode - the program will tell you what it is doing')
    .action(async (username, options) => {
        const results = [];

        const since = getSince(username);


        // process.exit(1);
        if (options.debug) {
            console.debug({since});
        }

        async function getNextPageOfResults(page) {
            if (options.debug) {
                console.log("Get page " + page + "...");
            }
            const response = await axios
                .get(
                    'https://api.github.com/users/' + username + '/gists',
                    {
                        headers: {
                            'Accept': 'application/vnd.github+json',
                            'Authorization': 'token ' + process.env.GITHUB_TOKEN,
                        },
                        params: {
                            page: page,
                            since: since
                        }
                    });
            // add the data to our results
            results.push(response.data);

            // are there any more pages?
            if (response.data.length === parseInt(options.perPage, 10)) {
                if (options.debug) {
                    console.log("  ... There are more page options, get another page...")
                }
                await getNextPageOfResults(page + 1);
            } else {
                if (options.debug) {
                    console.log("  ... There are no more page options");
                    console.log("  ... found " + results.length + " pages of results");
                }

                const allResults = [].concat.apply([], results);
                displayResults(allResults, options.output);
                cacheResultsToDisk(allResults, username);
            }
        }

        await getNextPageOfResults(1);
    });

program.parse();
