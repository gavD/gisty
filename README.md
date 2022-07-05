Gisty
==

Gisty is a tool for retrieving a user's gists from Github.

Developed in 2 hours.

System requirements
==

A relatively recent version of NodeJS.

Installation
==

Install dependencies with npm:

```bash
npm install
```

Usage
==

Get help with:

```bash
node index.js -h
```

The in-tool help is the best place to start:

```
Usage: gisty [options] <username>

CLI interface to Github Gists

Arguments:
  username                     user to get gists for

Options:
  -V, --version                output the version number
  -g, --github-token <string>  github_token (env: GITHUB_TOKEN)
  -a --all                     display all gists (defaults to just the gists created since you last ran the command)
  -o --output <json|list>      how to display the output (default: "list")
  -d --debug                   Debug mode - the program will tell you what it is doing
  -h, --help                   display help for command
```

About the cache
--

When you run Gisty, it will show you any gists created since you last ran the tool. You can clear the cache by deleting `.cache/<username>`, which will again return you all the results for the user in question.

Output formats
--

Two are available - json and list. List is simple and human readable. Json is machine readable and contains a lot more data.

Development
==

Linting
--

```bash
npx eslint index.js
```

Tool Rationale
==

Bash would be reasonably straightforward, but string handling in Bash is a nightmare so I decided to use a programming language.

I selected NodeJS simply because it was installed on my laptop. The same could be accomplished with any language. Node's downside is it's "everything and the kitchen sink" packaging approach. Something like Rust could build a tighter, single-binary executable.

If I wanted to go super-overkill, I could dockerise the whole thing. That said, I'd generally prefer an executable over Docker for such a small, sharp tool. I'd have to know the use case to select the most appropriate tooling.

I made the design decision to paginate through all available gists. Otherwise, you'd only get the 30 most recent by default.

I allowed the tool to output either JSON (raw results from Github) or list for a simpler response.

I added a `-d` switch for debug so you can see what the tool is doing in terms of pagination et cetera.

If I had more time...
==

I would add unit tests. The functions in the global namespace of index.js should be in a module
