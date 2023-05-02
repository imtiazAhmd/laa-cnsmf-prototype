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

}
