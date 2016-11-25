'use strict'

const request = require('request')
const Alexa = require('alexa-sdk')

exports.handler = (event, context, callback) => {
  let alexa = Alexa.handler(event, context)
  alexa.registerHandlers(handlers)
  alexa.resources = languageStrings
  alexa.execute()
}

let handlers = {
  'ConductorIntent': function () {
    let options = {
      url: 'https://api.nctx.co.uk/api/v1/departures/3300RU0245/realtime'
    }
    request(options, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        let speechOutput = this.t('API_ERROR')
        this.attributes['speechOutput'] = speechOutput
        this.emit(':ask', speechOutput)
      }
      let schedule = JSON.parse(body)
      let speechOutput = this.t('NEXT_BUS') + schedule[0].minutes + ' ' + this.t('MINUTES')
      this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), speechOutput)
    })
  },

  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest')
  },

  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest')
  },

  'SessionEndedRequest': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  }
}

let languageStrings = {
  'en-GB': {
    'translation': {
      'API_ERROR': 'I could not talk to the NCT API.',
      'NEXT_BUS': 'The next bus is in ',
      'MINUTES': 'minutes',
      'SKILL_NAME': 'NCT Conductor',
      'STOP_MESSAGE': 'Goodbye.'
    }
  }
}
