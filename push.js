var webPush = require('web-push')
 
const vapidKeys = {
  'publicKey': 'BHf1iutHq1lUAfcjIBcHKSVIQOXgs2ft8TBO7VrnckFm1DU1utBPRzN6N9p200j4riwkcPfGlDY8qjlxNjXdICw',
  'privateKey': 'Pacxn8BMT6sM1Xl5T20WW55isTOM_XApfiIRAqLHIrw'
}

webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

var pushSubscription = {
  'endpoint': '<Endpoint URL>',
  'keys': {
    'p256dh': '<p256dh Key>',
    'auth': '<Auth key>'
  }
}

var payload = 'Salam Olahraga!!!'

var options = {
  gcmAPIKey: '913473732770',
  TTL: 60
}

webPush.sendNotification(
  pushSubscription,
  payload,
  options
)
