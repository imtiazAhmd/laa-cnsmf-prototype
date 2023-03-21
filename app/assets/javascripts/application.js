/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
  window.MOJFrontend.initAll()

  let errorMessage = 'Hello'
})

// Disable journey if something else is selected as claim type
function disableJourneyIfOther(event) {
  let value = event.target.value
  const continueButton = document.getElementById('claim_type_continue')
  if (value === 'other') {
    continueButton.disabled = true
  }
}

document
  .querySelectorAll("input[name='claim_type[selected]']")
  .forEach((input) => {
    input.addEventListener('change', disableJourneyIfOther)
  })
