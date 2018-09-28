#!/usr/bin/env node

const rp = require('request-promise')
const cheerio = require('cheerio')

const { argv } = require('yargs')
  .usage('kgb-scrape')
  .options({
    pages: {
      alias: 'p',
      default: 5,
      describe: 'Number of pages to scrape',
      type: 'number',
      requiresArg: true,
    },
    top: {
      alias: 't',
      default: 3,
      describe: 'Number of top results to return',
      type: 'number',
      requiresArg: true,
    },
  })
  .help()

const options = {
  uri:
    'https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For-The-People-dealer-reviews-23685/?filter=ONLY_POSITIVE#link',
  transform: body => cheerio.load(body),
}

function main(argv) {
  const { pages, top } = argv
  const reviews = []
  for (let i = 0; i < pages; i++) {
    rp(options)
      .then(extractDataFromMarkup)
      .catch(function(err) {
        // Crawling failed or Cheerio choked...
      })
      .then(function(data) {
        console.log(data)
      })
  }
}

main(argv)

function extractDataFromMarkup($) {
  const reviews = $('.review-entry')
    .map((i, review) => {
      const $review = $(review)
      const date = $review.find('.review-date div:first-child').text()
      const helpfulVotes = parseInt($review.find('.helpful-count').text(), 10)
      const numEmployeesWorkedWith = $review.find('.review-employee').length
      const ratings = $review
        .find('.review-ratings-all [class^="rating-"]')
        .map(function extractRatingFromClassStr(i, elem) {
          const classStr = $(elem).attr('class')
          const ratingStr = /\d\d/g.exec(classStr)[0]
          const rating = parseInt(ratingStr, 10)
          return rating
        })
        .toArray()
      const user = $review
        .find('.review-wrapper div:nth-child(1) span')
        .text()
        .replace('- ', '')

      return {
        date,
        helpfulVotes,
        numEmployeesWorkedWith,
        ratings,
        user,
      }
    })
    .get()
  return Promise.resolve(reviews)
}

module.exports = {
  extractDataFromMarkup,
}
