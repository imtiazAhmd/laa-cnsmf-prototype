/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/

module.exports = {

  // Insert values here
  firm_details: [
    {
      firm_name : "Seagull Ltd",
      account_number: "12345678910",
      address_line_1: 'Albany house',
      address_line_2: "86 petty france",
      town: "London",
      postcode: "SW1H 9EA",
      solicitor_name: "Zayn Malik",
      solicitor_reference: "SS/69646",
      contact_name: "Samantha Jane",
      contact_email: "samantha.jane@seagull.co.uk"
    }
  ]

}
