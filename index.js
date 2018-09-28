#!/usr/bin/env node

const rp = require('request-promise')
const cheerio = require('cheerio')
const groupBy = require('lodash.groupby')

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

const options = pgNum => ({
  uri: `https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For-The-People-dealer-reviews-23685/page${pgNum}/?filter=ONLY_POSITIVE#link`,
  transform: body => cheerio.load(body),
})

async function main(argv) {
  const { pages, top } = argv
  const pageRequests = []
  for (let i = 1; i <= pages; i++) {
    pageRequests.push(
      rp(options(i))
        .then(extractDataFromMarkup)
        .catch(function(err) {
          // Crawling failed or Cheerio choked...
        })
    )
  }
  const reviews = await Promise.all(pageRequests).then(flatten)
  // Aggregate and process results
  calculatePositivityScores(reviews)
}

const flatten = values => [].concat.apply([], values)

const extractDataFromMarkup = $ => {
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
        .find('.review-wrapper > div:nth-child(1) span')
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

const calculatePositivityScores = reviewsSrc => {
  const userReviews = groupBy(reviewsSrc, 'user')
  const positivityScores = Object.entries(userReviews).reduce(
    (result, [user, reviews]) => {
      const score = reviews.reduce(
        (acc, { ratings, numEmployeesWorkedWith, helpfulVotes }) => {
          const ratingsSum = ratings.reduce((a, b) => a + b, 0)
          return acc + ratingsSum + numEmployeesWorkedWith + helpfulVotes
        },
        0
      )
      return result.concat([{ user, score }])
    },
    []
  )
  return positivityScores
}

main(argv)

module.exports = {
  extractDataFromMarkup,
  calculatePositivityScores,
}
