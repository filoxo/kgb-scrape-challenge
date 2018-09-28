import cheerio from 'cheerio'
import test from 'ava'
import { extractDataFromMarkup, calculatePositivityScores } from './index'

test('test function that extracts data from review markup', async t => {
  const TEST_MARKUP = `<div class="review-entry col-xs-12 text-left pad-none pad-top-lg  border-bottom-teal-lt">
<a name="r4988625"></a>
<div class="col-xs-12 col-sm-3 pad-left-none text-center review-date margin-bottom-md">
    <div class="italic col-xs-6 col-sm-12 pad-none margin-none font-20">September 26, 2018</div>
    <div class="col-xs-6 col-sm-12 pad-none dealership-rating">
        <div class="rating-static visible-xs pad-none margin-none rating-50 pull-right"></div>
        <div class="rating-static hidden-xs rating-50 margin-center"></div>
        <div class="col-xs-12 hidden-xs pad-none uppercase font-12 bolder margin-top-sm letter-spacing-1 dr-grey">SERVICE VISIT</div>
    </div>
</div>=
<div class="col-xs-12 col-sm-9 pad-none review-wrapper">
    <!-- REVIEW TITLE, USER-->
    <div class="margin-bottom-sm line-height-150">
        <h3 class="no-format inline italic-bolder font-20 dark-grey">"Rating of McKraig"</h3>
        <span class="italic font-18 black notranslate">- Lawrence</span>
    </div>

    <!-- REVIEW BODY -->

    <div class="tr margin-top-md">
        <div class="td text-left valign-top ">
            <p class="font-16 review-content margin-bottom-none line-height-25">The people were friendly. On the spot to take care of me the minute I can into the department. The service was completed quickly. They made sure I was taken care of in the waiting room. </p>
            <a id="4988625" class="read-more-toggle pointer orange-lt uppercase bolder font-14 line-height-25 letter-spacing-1 block margin-bottom-md">Read More</a>
        </div>
    </div>

    <!-- REVIEW RATINGS - ALL -->
    <div class="pull-left pad-left-md pad-right-md bg-grey-lt margin-bottom-md review-ratings-all review-hide">
        <!-- REVIEW RATING - CUSTOMER SERVICE -->
        <div class="table width-100 pad-left-none pad-right-none margin-bottom-md">
            <div class="tr">
                <div class="bold font-12 uppercase lt-grey letter-spacing-1 td">Customer Service</div>
                <div class="rating-static-indv rating-50 margin-top-none td"></div>
            </div>

            <!-- REVIEW RATING - QUALITY OF WORK -->
            <div class="tr margin-bottom-md">
                <div class="bold font-12 uppercase lt-grey letter-spacing-1 td">Quality of Work</div>
                <div class="rating-static-indv rating-50 margin-top-none td"></div>
            </div>

            <!-- REVIEW RATING - FRIENDLINESS -->
            <div class="tr margin-bottom-md">
                <div class="bold font-12 uppercase lt-grey letter-spacing-1 td">Friendliness</div>
                <div class="rating-static-indv rating-50 margin-top-none td"></div>
            </div>

            <!-- REVIEW RATING - PRICING -->
            <div class="tr margin-bottom-md">
                <div class="bold font-12 uppercase lt-grey letter-spacing-1 td">Pricing</div>
                <div class="rating-static-indv rating-50 margin-top-none td"></div>
            </div>

            <!-- REVIEW RATING - EXPERIENCE -->
            <div class="tr margin-bottom-md">
                <div class="td bold font-12 uppercase lt-grey letter-spacing-1">Overall Experience</div>
                <div class="rating-static-indv rating-50 margin-top-none td"></div>
            </div>

            <!-- REVIEW RATING - RECOMMEND DEALER -->
            <div class="tr">
                <div class="td bold font-12 uppercase lt-grey letter-spacing-1">Recommend Dealer</div>
                <div class="td uppercase boldest font-12">
                    Yes
                </div>
            </div>
        </div>

    </div>

    <!-- EMPLOYEE SECTION -->
    <div class="clear-fix  margin-top-sm">
        <div class="bold font-12 col-xs-12 lt-grey pad-left-none employees-wrapper">
            <div class="letter-spacing-1 uppercase bolder black">Employees Worked With </div>

            <div class="col-xs-12 col-sm-6 col-md-4 pad-left-none pad-top-sm pad-bottom-sm review-employee">
                <div class="table">
                    <div class="td square-image employee-image" style="background-image: url(https://cdn-user.dealerrater.com/images/91fda03d9e5b.jpg)"></div>

                    <div class="td valign-bottom pad-left-md pad-top-none pad-bottom-none">
                        <a class="notranslate pull-left line-height-1 letter-spacing-1 bold tagged-emp font-12 teal uppercase   emp-467062" data-emp-id="467062" href="/sales/Mariela-Hernandez-review-467062/">
                                         Mariela Hernandez
                                     </a>
                        <div class="col-xs-12 pad-none margin-none pad-top-sm">

                            <div class="relative employee-rating-badge-sm">
                                <div class="col-xs-12 pad-none">
                                    <span class="pull-left font-14 boldest lt-grey line-height-1 pad-right-sm margin-right-sm border-right">5.0</span>
                                    <div class="rating-static rating-50 margin-top-none pull-left"></div>
                                </div>

                                <div class="employee-rating-tooltip bg-white border-all absolute">
                                    Employee Rating is a new feature allowing consumers to rate their experience with individual dealership employees.
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>

    <!-- SOCIAL MEDIA AND REVIEW ACTIONS -->
    <div class="col-xs-12 pad-none review-hide margin-top-lg">
        <div class="pull-left">
            <a href="https://twitter.com/intent/tweet?url=http://www.dealerrater.com/consumer/social/4988625&amp;via=dealerrater&amp;text=Check+out+the+latest+review+on+McKaig+Chevrolet+Buick+-+A+Dealer+For+The+People" onclick="window.open('https://twitter.com/intent/tweet?url=http://www.dealerrater.com/dealer/review/4988625.aspx&amp;via=dealerrater&amp;text=Check+out+the+latest+review+on+McKaig+Chevrolet+Buick+-+A+Dealer+For+The+People', 'sharer', 'toolbar=0,status=0,width=750,height=500');return false;" target="_blank" rel="nofollow" title="Twitter"><img class="align-bottom" height="20" src="https://www.dealerrater.com/ncdn/s/123.20180920.1/Graphics/icons/icon_twitter_sm.png"></a>
            <a href="http://www.facebook.com/share.php?u=http://www.dealerrater.com/consumer/social/4988625" onclick="window.open('http://www.facebook.com/share.php?u=http://www.dealerrater.com/dealer/review/4988625.aspx', 'sharer', 'toolbar=0,status=0,width=750,height=500');return false;" target="_blank" rel="nofollow" title="Facebook"><img class="align-bottom" height="20" src="https://www.dealerrater.com/ncdn/s/123.20180920.1/Graphics/icons/icon_facebook_sm.png"></a>
        </div>
        <div class="pull-left margin-left-md">
            <a href="#" onclick="javascript:window.reportReview(4988625); return false;" class="bold font-12 uppercase letter-spacing-1 orange-lt">Report</a> |
            <a href="#" onclick="window.open('/dealer/respond.aspx?dealerId=23685&amp;commentId=4988625', 'report', 'toolbar=no,scrollbars=yes,location=no,width=575,height=465,resizable=yes'); return false;" class="bold font-12 uppercase letter-spacing-1 orange-lt">Respond</a> |
            <a href="#" onclick="window.open('/dealer/print.aspx?dealerId=23685&amp;commentId=4988625', 'report', 'toolbar=no,scrollbars=yes,location=no,width=575,height=465,resizable=yes'); return false;" class="bold font-12 uppercase letter-spacing-1 orange-lt">Print</a>
        </div>
    </div>

    <!-- PUBLIC MESSAGES -->

    <!-- WAS HELPFUL SECTION -->
    <div class="col-xs-12 margin-bottom-lg">
        <div class="pull-right">
            <a href="#" class="helpful-button" onclick="javascript:MarkReviewHelpful(4988625, this); return false;">
                <img class="pull-left margin-right-sm" src="https://www.dealerrater.com/ncdn/s/123.20180920.1/Graphics/icons/icon-thumbsup.png"> Helpful <span class="helpful-count display-none" id="helpful_count_4988625">0</span></a>
        </div>
    </div>
</div>

</div>`

  const data = await extractDataFromMarkup(cheerio.load(TEST_MARKUP))

  t.deepEqual(data, [
    {
      date: 'September 26, 2018',
      helpfulVotes: 0,
      numEmployeesWorkedWith: 1,
      ratings: [50, 50, 50, 50, 50],
      user: 'Lawrence',
    },
  ])
})
test('reviews are aggregated into single score', t => {
  const input = [
    {
      date: 'September 26, 2018',
      helpfulVotes: 0,
      numEmployeesWorkedWith: 1,
      ratings: [50, 50, 50, 50, 50],
      user: 'Lawrence',
    },
    {
      date: 'September 26, 2018',
      helpfulVotes: 0,
      numEmployeesWorkedWith: 2,
      ratings: [50, 50, 50, 50, 50],
      user: 'velva.mccann',
    },
    {
      date: 'September 25, 2018',
      helpfulVotes: 0,
      numEmployeesWorkedWith: 1,
      ratings: [50, 50, 50, 50, 50],
      user: 'Preuninger 37',
    },
  ]

  const expected = {
    Lawrence: 251,
    'velva.mccann': 252,
    'Preuninger 37': 251,
  }
  const output = calculatePositivityScores(input)
  t.deepEqual(output, expected)
})
test.todo('test function that returns top accounts')
