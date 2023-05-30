# Repository README.md footer update

Script to update the `README.md` footer from a Github repository.

This project is for a very personal use because, I have multiple projects, and in the principal ones at least, I would like to have updated my contact information or references to other projects but, maybe it inspire you to do something similar or use this script.

If you like it and finally you use it, I appreciate a ⭐️ to motivate me to continues share my projects 👨‍💻.

## Commands

```sh
Usage: node ./dist/main.js [options]

Options:
  --use-local                                 force to use local markdown file (footer.md, into /src)
  --use-local=your-custom.md                  (optional) force to use your custom markdown file
                                              (that file should be into /src). If this parameter is
                                              not set, will excecute the
                                              function into src/footer-generator.ts
  --repo=<REPO_NAME>                          repository name
  --use-regex=<REGEX>                         Regex to find the cursor to start removing content
```

## How it works?

First, you need to create a Personal Access Token on Github. Then, you need to duplicate the file `.env.example` and rename to `.env`. Now, edit the content to setup your config.

```bash
GITHUB_ACCESS_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GITHUB_USERNAME=dimaslz # it is my username
```

By Github API (by [Octokit](https://github.com/octokit/rest.js/)), the script downloads the `README.md` content of the repository and override the current content adding a footer content that you create.

### Base usage

By default will excecute the code into `footer-generator.ts` to build the footer content.

yarn: `$ yarn update --repo=<REPO_NAME> --use-regex=<REGEX>`

npm: `$ npm run update --repo=<REPO_NAME> --use-regex=<REGEX>`

Example in my use case: `$ yarn update --repo=vite-svelte-ts --use-regex="## Author[^]+$"`

**Result should like:**

```bash
████████████████████████████████████████ | 100% - Done! 🎉

Readme updated with the last changes.
        Visit changes here: https://github.com/dimaslz/<REPO_NAME>/commit/__COMMIT_SHA__
        Visit repository here: https://github.com/<GITHUB_OWNER>/<REPO_NAME>/README.md
✨  Done in 2.80s.
```

### Use a template

In the root of the repo, there is a `footer.md` file. That content will be added to the end of the `README.md` file of the repo.

To update the repository with the footer from the file `footer.md`, run the following command:

yarn: `$ yarn update --use-local --repo=<REPO_NAME> --use-regex=<REGEX>`

npm: `$ npm run update --use-local --repo=<REPO_NAME> --use-regex=<REGEX>`

Example in my use case: `$ yarn update --use-local --repo=vite-svelte-ts --use-regex="## Author[^]+$"`

**Result should like:**

```bash
████████████████████████████████████████ | 100% - Done! 🎉

Readme updated with the last changes.
        Visit changes here: https://github.com/dimaslz/<REPO_NAME>/commit/__COMMIT_SHA__
        Visit repository here: https://github.com/<GITHUB_OWNER>/<REPO_NAME>/README.md
✨  Done in 2.80s.
```

> Run with `--use-local=your-markdown-file.md` to use your custom file. The path start into `/src`

### Using a custom script to build your own footer

In this project, there is a file `footer-generator.ts` which is a method that is executed to build your own footer content. Now it has my script, remove and use your self one.

```ts
const FooterGenerator = async (readme: string): Promise<string> => {

  // your code here

export default FooterGenerator;
```

> In my case, the code in in TS, but you can use a pure JS file if you want.

**IMPORTANT:** The script will remove all content from `--use-regex="..."` to the end of file. After, it will create the new footer for the README.md. If the regex does not find the math, will add the content to the end of `README.md`.

```text

## Author

```json
{
  "name": "Dimas López Zurita",
  "role": "Senior Software Engineer",
  "alias": "dimaslz",
  "linkedin": "https://www.linkedin.com/in/dimaslopezzurita",
  "github": "https://github.com/dimaslz",
  "twitter": "https://twitter.com/dimaslz",
  "tags": "software, open source, react, learning, SAAS, react native"
}
```.

## My other projects

* [https://ng-heroicons.dimaslz.dev/](https://ng-heroicons.dimaslz.dev): An Angular components library to use Heroicons.com in your Angular projects.
* [https://randomdata.loremapi.io/](https://randomdata.loremapi.io/): A tool to create mock Api responses with your custom schema.
* [https://svg-icon-2-fw-component.dimaslz.dev](https://svg-icon-2-fw-component.dimaslz.dev): A tool to create a framework icon component from a SVG
* [https://loremapi.io](https://loremapi.io): Mock and document your Api's
* [https://cv.dimaslz.dev](https://cv.dimaslz.dev): My online CV
* [https://api.dimaslz.dev](https://api.dimaslz.dev): My professional info by API
* [https://dimaslz.dev](https://dimaslz.dev): Dev landing
* [https://dimaslz.com](https://dimaslz.com): Profesional landing profile
```

Once the new content is created, will push the changes directly to the default branch with a commit message like: `chore: update readme [1685439535921]`

## Author

```json
{
  "name": "Dimas López Zurita",
  "role": "Senior Software Engineer",
  "alias": "dimaslz",
  "linkedin": "https://www.linkedin.com/in/dimaslopezzurita",
  "github": "https://github.com/dimaslz",
  "twitter": "https://twitter.com/dimaslz",
  "tags": "software, open source, react, learning, SAAS, react native"
}
```

## My other projects

* [https://ng-heroicons.dimaslz.dev/](https://ng-heroicons.dimaslz.dev): An Angular components library to use Heroicons.com in your Angular projects.
* [https://randomdata.loremapi.io/](https://randomdata.loremapi.io/): A tool to create mock Api responses with your custom schema.
* [https://svg-icon-2-fw-component.dimaslz.dev](https://svg-icon-2-fw-component.dimaslz.dev): A tool to create a framework icon component from a SVG
* [https://loremapi.io](https://loremapi.io): Mock and document your Api's
* [https://cv.dimaslz.dev](https://cv.dimaslz.dev): My online CV
* [https://api.dimaslz.dev](https://api.dimaslz.dev): My professional info by API
* [https://dimaslz.dev](https://dimaslz.dev): Dev landing
* [https://dimaslz.com](https://dimaslz.com): Profesional landing profile