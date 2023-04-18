// Use this file to change prototype configuration.

// Note: prototype config can be overridden using environment variables (eg on heroku)

module.exports = {
  // Service name used in header. Eg: 'Renew your passport'
  serviceName: 'Claim a non-standard magistrate fee',

  // Default port that prototype runs on
  port: '3000',

  // Enable or disable password protection on production
  useAuth: 'true',

  // Automatically stores form data, and send to all views
  useAutoStoreData: 'true',

  // Enable cookie-based session store (persists on restart)
  // Please note 4KB cookie limit per domain, cookies too large will silently be ignored
  useCookieSessionStore: 'false',

  // Enable or disable built-in docs and examples.
  useDocumentation: 'true',

  // Force HTTP to redirect to HTTPS on production
  useHttps: 'true',

  // Enable or disable Browser Sync (local development only)
  useBrowserSync: 'true',

  // Password to stop anyone finding your prototype accidentally and mistaking it for a real service.
  systemPassword: '12345',

  // App title
  appTitle: 'Claim a non-standard magistrate fee',

  // Prototype Notice
  prototypeNotice:
    'It is important for you to understand that this is a Prototype and not in production. It should not be used to apply for Non-standard magistrate fees. This service is only to get a better understanding of the proposed system journey for eForm CRM7.',

  // Sample data
  offenceData: [
    { value: "Offences against the person", text: "Offences against the person" },
    { value: "Homicide and related grave offences", text: "Homicide and related grave offences" },
    { value: "Sexual offences and associated offences against children", text: "Sexual offences and associated offences against children" },
    { value: "Robbery", text: "Robbery" },
    { value: "Burglary", text: "Burglary" },
    { value: "Criminal damage", text: "Criminal damage" },
    { value: "Theft (including taking vehicle without consent)", text: "Theft (including taking vehicle without consent)" },
    { value: "Fraud and forgery and other offences of dishonesty not otherwise categorised", text: "Fraud and forgery and other offences of dishonesty not otherwise categorised" },
    { value: "Public order offences", text: "Public order offences" },
    { value: "Drug offences", text: "Drug offences" },
    { value: "Driving and motor vehicle offences (other than those covered by codes 1, 6 & 7)", text: "Driving and motor vehicle offences (other than those covered by codes 1, 6 & 7)" },
    { value: "Other offences", text: "Other offences" },
    { value: "Terrorism", text: "Terrorism" },
    { value: "Anti-social behaviour orders (for applications made prior to 23rd March 2015)", text: "Anti-social behaviour orders (for applications made prior to 23rd March 2015)" },
    { value: "Sexual offender orders", text: "Sexual offender orders" },
    { value: "Other prescribed proceedings", text: "Other prescribed proceedings" }
  ],
}
