// Core dependencies
const fs = require('fs')
const path = require('path')
const url = require('url')

// NPM dependencies
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const express = require('express')
const nunjucks = require('nunjucks')
const sessionInCookie = require('client-sessions')
const sessionInMemory = require('express-session')

// Run before other code to make sure variables from .env are available
dotenv.config()

// Local dependencies
const middleware = [
  require('./lib/middleware/authentication/authentication.js')(),
  require('./lib/middleware/extensions/extensions.js'),
]
const config = require('./app/config.js')
const documentationRoutes = require('./docs/documentation_routes.js')
const prototypeAdminRoutes = require('./lib/prototype-admin-routes.js')
const packageJson = require('./package.json')
const routes = require('./app/routes.js')
const utils = require('./lib/utils.js')
const extensions = require('./lib/extensions/extensions.js')

// Variables for v6 backwards compatibility
// Set false by default, then turn on if we find /app/v6/routes.js
var useV6 = false
var v6App
var v6Routes

if (fs.existsSync('./app/v6/routes.js')) {
  v6Routes = require('./app/v6/routes.js')
  useV6 = true
}

const app = express()
const documentationApp = express()

if (useV6) {
  console.log('/app/v6/routes.js detected - using v6 compatibility mode')
  v6App = express()
}

// Set up configuration variables
var releaseVersion = packageJson.version
var env = utils.getNodeEnv()
var useAutoStoreData =
  process.env.USE_AUTO_STORE_DATA || config.useAutoStoreData
var useCookieSessionStore =
  process.env.USE_COOKIE_SESSION_STORE || config.useCookieSessionStore
var useHttps = process.env.USE_HTTPS || config.useHttps

useHttps = useHttps.toLowerCase()

var useDocumentation = config.useDocumentation === 'true'

// Promo mode redirects the root to /docs - so our landing page is docs when published on heroku
var promoMode = process.env.PROMO_MODE || 'false'
promoMode = promoMode.toLowerCase()

// Disable promo mode if docs aren't enabled
if (!useDocumentation) promoMode = 'false'

// Force HTTPS on production. Do this before using basicAuth to avoid
// asking for username/password twice (for `http`, then `https`).
var isSecure = env === 'production' && useHttps === 'true'
if (isSecure) {
  app.use(utils.forceHttps)
  app.set('trust proxy', 1) // needed for secure cookies on heroku
}

// Add variables that are available in all views
app.locals.asset_path = '/public/'
app.locals.useAutoStoreData = useAutoStoreData === 'true'
app.locals.useCookieSessionStore = useCookieSessionStore === 'true'
app.locals.promoMode = promoMode
app.locals.releaseVersion = 'v' + releaseVersion
app.locals.serviceName = config.serviceName
app.locals.appTitle = config.appTitle
app.locals.prototypeNotice = config.prototypeNotice
app.locals.offences = config.offenceData
app.locals.testData = [
  {
    date: 2222,
    fee_earner: 'name',
    travel: 20,
    waiting: 20,
    attendances: null,
    preperation: null,
    advocacy: 6,
  },
  {
    date: 2222,
    fee_earner: 'name',
    travel: 20,
    waiting: 20,
    attendances: 20,
    preperation: 20,
    advocacy: 6,
  },
  {
    date: 1222,
    fee_earner: 'name',
    travel: 20,
    waiting: 20,
    attendances: 20,
    preperation: 20,
    advocacy: 6,
  },
]
app.locals.sampleCourtData = [
  {"Court":"ACTON", "Code":"C2723"},
  {"Court":"BALHAM HIGH ROAD", "Code":"C6686"},
  {"Court":"BALHAM HIGH ROAD YOUTH", "Code":"C6013A"},
  {"Court":"BARKING", "Code":"C2814"},
  {"Court":"BARNET", "Code":"C2725"},
  {"Court":"BELMARSH (GREENWICH PSA)", "Code":"C2643B"},
  {"Court":"BEXLEY", "Code":"C2728"},
  {"Court":"BOW STREET", "Code":"C2641"},
  {"Court":"BRENT (WILLESDEN)", "Code":"C2762"},
  {"Court":"BRENTFORD", "Code":"C2769A"},
  {"Court":"BROMLEY", "Code":"C2727"},
  {"Court":"CAMBERWELL GREEN", "Code":"C2656"},
  {"Court":"CITY OF LONDON (JUSTICE ROOMS)", "Code":"C2631"},
  {"Court":"CLERKENWELL (COURT CLOSED)", "Code":"C2642"},
  {"Court":"CROYDON", "Code":"C2732"},
  {"Court":"EALING", "Code":"C2734"},
  {"Court":"FELTHAM", "Code":"C2769B"},
  {"Court":"GREENWICH", "Code":"C2643"},
  {"Court":"GREENWICH & LEWISHAM", "Code":"C6643"},
  {"Court":"GREENWICH & LEWISHAM YOUTH", "Code":"C6013C"},
  {"Court":"GREENWICH, LEWISHAM & SOUTHWARK YOUTH", "Code":"C6656"},
  {"Court":"HAMPSTEAD", "Code":"C2740"},
  {"Court":"HARROW", "Code":"C2760"},
  {"Court":"HAVERING", "Code":"C1837"},
  {"Court":"HENDON", "Code":"C2741"},
  {"Court":"HIGHBURY CORNER(EAST CENTRAL)", "Code":"C2663"},
  {"Court":"HIGHGATE (HARINGEY)", "Code":"C2742"},
  {"Court":"HILLINGDON", "Code":"C2766"},
  {"Court":"HORSEFERRY ROAD", "Code":"C2660"},
  {"Court":"INNER LONDON JUVENILE COURTS", "Code":"C6013"},
  {"Court":"KINGSTON", "Code":"C2812"},
  {"Court":"LAMBETH & WANDSWORTH YOUTH COURTS", "Code":"C6649"},
  {"Court":"MARLBOROUGH STREET", "Code":"C2644"},
  {"Court":"MARYLEBONE", "Code":"C2646"},
  {"Court":"NORTH AND NORTH EAST LONDON YOUTH COURTS", "Code":"C6650"}
  ]
app.locals.hearingOutcome = [
  { "code": "CP01", "description": "Arrest warrant issued/adjourned indefinitely" },
  { "code": "СР02", "description": "Change of solicitor" },
  { "code": "СРОЗ", "description": "Representation order withdrawn" },
  { "code": "CP04", "description": "Trial: acquitted" },
  { "code": "CP05", "description": "Trial: mixed verdicts" },
  { "code": "СР06", "description": "Trial: convicted" },
  { "code": "СР07", "description": "Discontinued (before any pleas entered)" },
  { "code": "CP08", "description": "Discontinued (after pleas entered)" },
  { "code": "СР09", "description": "Guilty plea to all charges put - not listed for trial" },
  { "code": "CP10", "description": "Guilty plea to all charges put after case listed for trial" },
  { "code": "CP11", "description": "Guilty plea to substitute charges put - after case listed for trial" },
  { "code": "CP12", "description": "Mix of guilty plea(s) and discontinuance - Not listed for trial" },
  { "code": "CP13", "description": "Mix of guilty pleas and discontinuance - listed for trial" },
  { "code": "CP16", "description": "Committal: discharged" },
  { "code": "CP17", "description": "Extradition" },
  { "code": "CP18", "description": "Case remitted from Crown to magistrates' court for sentencing" },
  { "code": "CP19", "description": "Deferred sentence" },
  { "code": "СР20", "description": "Granted anti-social behaviour order / sexual offences order / other order" },
  { "code": "CP21", "description": "Part-granted anti-social behaviour order/ sexual offences order / other order" },
  { "code": "CP22", "description": "Refused anti-social behaviour order/ sexual offences order / other order" },
  { "code": "CP23", "description": "Varied anti-social behaviour order/ sexual offences order / other order" },
  { "code": "CP24", "description": "Discharged anti-social behaviour order/ sexual offences order / other order" }
]

app.locals.matterType =  [
  { "code": 1, "description": "Offences against the person" },
  { "code": 2, "description": "Homicide and related grave offences" },
  { "code": 3, "description": "Sexual offences and associated offences against children" },
  { "code": 4, "description": "Robbery" },
  { "code": 5, "description": "Burglary" },
  { "code": 6, "description": "Criminal damage" },
  { "code": 7, "description": "Theft (including taking vehicle without consent)" },
  { "code": 8, "description": "Fraud and forgery and other offences of dishonesty not otherwise categorised" },
  { "code": 9, "description": "Public order offences" },
  { "code": 10, "description": "Drug offences" },
  { "code": 11, "description": "Driving and motor vehicle offences (other than those covered by codes 1, 6 & 7)" },
  { "code": 12, "description": "Other offences" },
  { "code": 13, "description": "Terrorism" },
  { "code": 14, "description": "Anti-social behaviour orders (for applications made prior to 23rd March 2015)" },
  { "code": 15, "description": "Sexual offender orders" },
  { "code": 16, "description": "Other prescribed proceedings" }
]
// extensionConfig sets up variables used to add the scripts and stylesheets to each page.
app.locals.extensionConfig = extensions.getAppConfig()

// use cookie middleware for reading authentication cookie
app.use(cookieParser())

// Session uses service name to avoid clashes with other prototypes
const sessionName =
  'govuk-prototype-kit-' +
  Buffer.from(config.serviceName, 'utf8').toString('hex')
const sessionHours = promoMode === 'true' ? 20 : 4
const sessionOptions = {
  secret: sessionName,
  cookie: {
    maxAge: 1000 * 60 * 60 * sessionHours,
    secure: isSecure,
  },
}

// Support session data in cookie or memory
if (useCookieSessionStore === 'true') {
  app.use(
    sessionInCookie(
      Object.assign(sessionOptions, {
        cookieName: sessionName,
        proxy: true,
        requestKey: 'session',
      }),
    ),
  )
} else {
  app.use(
    sessionInMemory(
      Object.assign(sessionOptions, {
        name: sessionName,
        resave: false,
        saveUninitialized: false,
      }),
    ),
  )
}

// Authentication middleware must be loaded before other middleware such as
// static assets to prevent unauthorised access
middleware.forEach((func) => app.use(func))

// Set up App
var appViews = extensions.getAppViews([
  path.join(__dirname, '/app/views/'),
  path.join(__dirname, '/lib/'),
])

var nunjucksConfig = {
  autoescape: true,
  noCache: true,
  watch: false, // We are now setting this to `false` (it's by default false anyway) as having it set to `true` for production was making the tests hang
}

if (env === 'development') {
  nunjucksConfig.watch = true
}

nunjucksConfig.express = app

var nunjucksAppEnv = nunjucks.configure(appViews, nunjucksConfig)

// Add Nunjucks filters
utils.addNunjucksFilters(nunjucksAppEnv)

// Set views engine
app.set('view engine', 'html')

// Middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, '/public')))

// Serve govuk-frontend in from node_modules (so not to break pre-extensions prototype kits)
app.use(
  '/node_modules/govuk-frontend',
  express.static(path.join(__dirname, '/node_modules/govuk-frontend')),
)

// Set up documentation app
if (useDocumentation) {
  var documentationViews = [
    path.join(__dirname, '/node_modules/govuk-frontend/'),
    path.join(__dirname, '/node_modules/govuk-frontend/components'),
    path.join(__dirname, '/docs/views/'),
    path.join(__dirname, '/lib/'),
  ]

  nunjucksConfig.express = documentationApp
  var nunjucksDocumentationEnv = nunjucks.configure(
    documentationViews,
    nunjucksConfig,
  )
  // Nunjucks filters
  utils.addNunjucksFilters(nunjucksDocumentationEnv)

  // Set views engine
  documentationApp.set('view engine', 'html')
}

// Support for parsing data in POSTs
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

// Set up v6 app for backwards compatibility
if (useV6) {
  var v6Views = [
    path.join(__dirname, '/node_modules/govuk_template_jinja/views/layouts'),
    path.join(__dirname, '/app/v6/views/'),
    path.join(__dirname, '/lib/v6'), // for old unbranded template
  ]
  nunjucksConfig.express = v6App
  var nunjucksV6Env = nunjucks.configure(v6Views, nunjucksConfig)

  // Nunjucks filters
  utils.addNunjucksFilters(nunjucksV6Env)

  // Set views engine
  v6App.set('view engine', 'html')

  // Backward compatibility with GOV.UK Elements
  app.use(
    '/public/v6/',
    express.static(
      path.join(__dirname, '/node_modules/govuk_template_jinja/assets'),
    ),
  )
  app.use(
    '/public/v6/',
    express.static(
      path.join(__dirname, '/node_modules/govuk_frontend_toolkit'),
    ),
  )
  app.use(
    '/public/v6/javascripts/govuk/',
    express.static(
      path.join(
        __dirname,
        '/node_modules/govuk_frontend_toolkit/javascripts/govuk/',
      ),
    ),
  )
}

// Automatically store all data users enter
if (useAutoStoreData === 'true') {
  app.use(utils.autoStoreData)
  utils.addCheckedFunction(nunjucksAppEnv)
  if (useDocumentation) {
    utils.addCheckedFunction(nunjucksDocumentationEnv)
  }
  if (useV6) {
    utils.addCheckedFunction(nunjucksV6Env)
  }
}

// Load prototype admin routes
app.use('/prototype-admin', prototypeAdminRoutes)

// Redirect root to /docs when in promo mode.
if (promoMode === 'true') {
  console.log('Prototype Kit running in promo mode')

  app.get('/', function (req, res) {
    res.redirect('/docs')
  })

  // Allow search engines to index the Prototype Kit promo site
  app.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    res.send('User-agent: *\nAllow: /')
  })
} else {
  // Prevent search indexing
  app.use(function (req, res, next) {
    // Setting headers stops pages being indexed even if indexed pages link to them.
    res.setHeader('X-Robots-Tag', 'noindex')
    next()
  })

  app.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    res.send('User-agent: *\nDisallow: /')
  })
}

// Load routes (found in app/routes.js)
if (typeof routes !== 'function') {
  console.log(routes.bind)
  console.log(
    'Warning: the use of bind in routes is deprecated - please check the Prototype Kit documentation for writing routes.',
  )
  routes.bind(app)
} else {
  app.use('/', routes)
}

if (useDocumentation) {
  // Clone app locals to documentation app locals
  // Use Object.assign to ensure app.locals is cloned to prevent additions from
  // updating the original app.locals
  documentationApp.locals = Object.assign({}, app.locals)
  documentationApp.locals.serviceName = 'Prototype Kit'

  // Create separate router for docs
  app.use('/docs', documentationApp)

  // Docs under the /docs namespace
  documentationApp.use('/', documentationRoutes)
}

if (useV6) {
  // Clone app locals to v6 app locals
  v6App.locals = Object.assign({}, app.locals)
  v6App.locals.asset_path = '/public/v6/'

  // Create separate router for v6
  app.use('/', v6App)

  // Docs under the /docs namespace
  v6App.use('/', v6Routes)
}

// Strip .html and .htm if provided
app.get(/\.html?$/i, function (req, res) {
  var path = req.path
  var parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

// Auto render any view that exists

// App folder routes get priority
app.get(/^([^.]+)$/, function (req, res, next) {
  utils.matchRoutes(req, res, next)
})

if (useDocumentation) {
  // Documentation  routes
  documentationApp.get(/^([^.]+)$/, function (req, res, next) {
    if (!utils.matchMdRoutes(req, res)) {
      utils.matchRoutes(req, res, next)
    }
  })
}

if (useV6) {
  // App folder routes get priority
  v6App.get(/^([^.]+)$/, function (req, res, next) {
    utils.matchRoutes(req, res, next)
  })
}

// Redirect all POSTs to GETs - this allows users to use POST for autoStoreData
app.post(/^\/([^.]+)$/, function (req, res) {
  res.redirect(
    url.format({
      pathname: '/' + req.params[0],
      query: req.query,
    }),
  )
})

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error(`Page not found: ${req.path}`)
  err.status = 404
  next(err)
})

// Display error
app.use(function (err, req, res, next) {
  console.error(err.message)
  res.status(err.status || 500)
  res.send(err.message)
})

console.log('\nGOV.UK Prototype Kit v' + releaseVersion)
console.log(
  '\nNOTICE: the kit is for building prototypes, do not use it for production services.',
)

module.exports = app
