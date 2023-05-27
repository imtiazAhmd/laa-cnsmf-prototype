const express = require('express')
const { systemPassword } = require('./config')
const fetch = require('./data/fetch')
const router = express.Router()
const sessionData = require('./data/session-data-defaults')
const formData = require('./data/form_data')


const formatDate = (date) => {
  date = new Date(date);
  return date.getDate() + '/' + (date.getMonth() + 1).toString().padStart(2, "0") + '/' + date.getFullYear();
}

const formatDateWithMonth = (date) => {
  date = new Date(date);
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  return date.getDate() + ' ' +monthNames[date.getMonth()]+' '+date.getFullYear();
}

function isObjectAlreadyPresent(arr, obj) {
  return arr.some(item => JSON.stringify(item) === JSON.stringify(obj));
}

function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // Return the input if it's not a non-empty string
  }

  const firstLetter = str.charAt(0).toUpperCase(); // Get the first letter and capitalize it
  const remainingLetters = str.slice(1); // Get the remaining letters
  return firstLetter + remainingLetters; // Concatenate the capitalized first letter with the remaining letters
}
async function groupByProcessedDate(data) {
  return new Promise(resolve => {
    const groupedData = [];

    // Iterate over each item in the data
    data.forEach(item => {
      const processedDate = item.processed_date;

      // Check if the processed_date already exists in the groupedData array
      const groupIndex = groupedData.findIndex(group => group.processed_date === processedDate);

      if (groupIndex !== -1) {
        // If the processed_date already exists, push the item to the existing group
        groupedData[groupIndex].items.push(item);
      } else {
        // If the processed_date doesn't exist, create a new group with the item
        groupedData.push({
          processed_date: processedDate,
          items: [item]
        });
      }
    });

    resolve(groupedData);
  });
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

router.post('/provider/claim_type', async (req, res, next) => {
  let selected_claim_type_other = req.session.data['claim_type']['selected']
  selected_claim_type_other === 'other'
    ? res.redirect('./block_journey')
    : res.redirect('./start_claim/new')
})


router.get('/provider/start_claim/:status', async (req, res, next) => {
  req.params.status === 'completed' ? res.render('provider/start_claim', { status: 'completed' }) : res.render('provider/start_claim', { status: 'new' })
})

router.get('/provider/hearing_details', async (req, res, next) => {
  let courtLists = formData['list_of_courts']
  let hearingOutcomeLists = formData['hearing_outcome']
  let matterTypeLists = formData['matter_type']
  res.render('provider/hearing_details', { courtLists: courtLists, hearingOutcomeLists: hearingOutcomeLists, matterTypeLists: matterTypeLists })
})

router.get('/provider/firm_details/:status', async (req, res, next) => {
  let data = sessionData['firm_details'][0]
  req.params.status === 'completed' ? res.render('provider/firm_details', { firmDetails: data }) : res.render('provider/firm_details')
})

router.get('/provider/work_item_lists', async (req, res, next) => {
  let data = req.session.data.claim_items
  let processed_date = Date.parse(data.completion_date.year+'-'+data.completion_date.month+'-'+data.completion_date.day)
  let processed_items = []
  let workItem = {
      claim_types: capitalizeFirstLetter(data.claim_types),
      processed_date: formatDateWithMonth(processed_date),
      time_spent: data.time_spent,
      fee_earner_initial: data.fee_earner_initial
    }

  if(!isObjectAlreadyPresent(formData.work_items, workItem)){
    formData.work_items.push(workItem)
  }
  groupByProcessedDate(formData.work_items)
  .then(groupedData => {
    processed_items = groupedData
    console.log(JSON.stringify(groupedData, null, 2));
    res.render('provider/work_item_lists', { workItems: processed_items })
  })
  .catch(error => {
    console.error('Error:', error);
  })
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
