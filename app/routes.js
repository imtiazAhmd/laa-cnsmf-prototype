const express = require('express')
const { systemPassword } = require('./config')
const fetch = require('./data/fetch')
const router = express.Router()
const sessionData = require('./data/session-data-defaults')
const other_defendants_list = require('./data/other_defendants');

const formatDate = (date) => {
  date = new Date(date);
  return date.getDate() + '/' + (date.getMonth() + 1).toString().padStart(2, "0") + '/' + date.getFullYear();
}

router.get('/provider/dashboard', async (req, res, next) => {
  // delete req.session.data
  try {
    let response = await fetch(
      'https://n7ykjge71d.execute-api.eu-west-2.amazonaws.com/alpha/applications',
    )
    let data = response.Items || []
    let applications = data.map((item) => {
      return {
        name:
          item.data.client_details.client.first_name +
          ' ' +
          item.data.client_details.client.last_name,
        date: formatDate(item.date),
        reference: Math.random().toString().slice(2, 9),
        status: item.status,
        id: item.id,
        timestamp: item.date || 0,
      }
    })

    applications.sort(({ timestamp: a }, { timestamp: b }) => b - a)
    applications = applications.slice(0, 20)

    res.render('provider/dashboard', { applications })
  } catch (err) {
    return next(err)
  }
})

router.get('/logout', async (req, res, next) => {
  req.session.destroy()
})
// For debug ONLY
router.get('/data', async (req, res, next) => {
  let data = req.session.data
  console.log('---------------DATA--------------')
  console.log(data)
})

router.get('/provider/firm_details', async (req, res, next) => {
  let data = sessionData.firm_details[0]
  res.render('provider/firm_details', { firmDetails: data })
})

router.get('/provider/claim_items', async (req, res, next) => {
  let data = req.session.data
  res.render('provider/claim_items', { data })
})

router.get('/provider/claim_summary', async (req, res, next) => {
  let data = req.session.data
  res.render('provider/claim_summary', { data })
})

// router.post('/provider/defendant_details', async (req, res, next) => {
//   let additional_defendant_exists = req.session.data['main_defendant']['additional_defendant']
//   additional_defendant_exists === 'true' ? res.redirect('/provider/other_defendants') : res.redirect('/provider/claim_details')
// })

// router.get('/provider/other_defendants', async (req, res, next) => {
//   let data = req.session.data
//   res.render('provider/other_defendants', { other_defendants_list: other_defendants_list})
// })

router.get('/provider/confirmation', async (req, res, next) => {
  let data = req.session.data
  console.log(data)
  res.render('provider/confirmation', { data })
})
// for password checking
router.post('/verify-password', function (req, res) {
  let password = req.session.data['password']
  if (password === systemPassword) {
    res.redirect('/provider/dashboard')
  } else {
    // Do nothing
    req.session.resave = false
    //LOGOUT ->
    res.redirect('/')
  }
})
module.exports = router
