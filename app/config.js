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
    { value: 'Murder/Manslaughter', text: 'Murder/Manslaughter' },
    { value: 'Driving Offences', text: 'Driving Offences' },
    { value: 'Burglary & Robbery', text: 'Burglary & Robbery' },
    { value: 'Firearms Offences', text: 'Firearms Offences' },
    {
      value: 'Other offences against the person',
      text: 'Other offences against the person',
    },
    {
      value: 'Exploitation / human trafficking offences',
      text: 'Exploitation / human trafficking offences',
    },
    { value: 'Public Order Offences', text: 'Public Order Offences' },
    { value: 'Regulatory Offences', text: 'Regulatory Offences' },
    { value: 'Standard Cases', text: 'Standard Cases' },
    { value: 'Terrorism', text: 'Terrorism' },
    { value: 'Serious Violence', text: 'Serious Violence' },
    { value: 'Sexual Offences (children)', text: 'Sexual Offences (children)' },
    { value: 'Sexual Offences (adult)', text: 'Sexual Offences (adult)' },
    { value: 'Dishonesty', text: 'Dishonesty' },
    { value: 'Property Damage Offences', text: 'Property Damage Offences' },
    {
      value: 'Offences Against the Public Interest',
      text: 'Offences Against the Public Interest',
    },
    { value: 'Drugs Offences', text: 'Drugs Offences' },
  ],
}
