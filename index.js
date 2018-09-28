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
      .then(function($) {
        const reviews = $('.review-entry')
        console.log(reviews)
        /** 
                    CUSTOMER SERVICE	
                    QUALITY OF WORK	
                    FRIENDLINESS	
                    PRICING	
                    OVERALL EXPERIENCE	
                    RECOMMEND DEALER
                **/
        // Employees worked with, and their ratings
        // other employees wored with
        // was helpful count
        // Date (most recent?)
      })
      .catch(function(err) {
        // Crawling failed or Cheerio choked...
      })
  }
}

main(argv)
