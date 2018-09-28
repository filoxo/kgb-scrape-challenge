# kgb-scrape-challenge

Identifies "overly positive" endorsements using the following criteria:

- Average scores,
- Number of employees worked with, 
- Number of helpful votes,
- and Total count of reviews submitted

## Retrieving results

Install kgb-scrape globally, or run once using `npx kgb-scrape`.

TODO: publish to npm

## Development

Requires Node 10 or greater

- Clone repo
- `yarn link`
- Run `kgb-scrape`*

\* If you encounter permissions errors when running, see [this solution](https://github.com/yarnpkg/yarn/issues/3587#issuecomment-309563718)

- Run `yarn test` to execute test suite