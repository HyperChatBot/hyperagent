import getDate from './get-date'
import getExchangeRate from './get-exchange-rate'
import getInformationFromKnowledge from './get-information-from-knowledge-base'
import getWeather from './get-weather'

export const callingToolsFns = {
  ...getDate.toolFn,
  ...getWeather.toolFn,
  ...getExchangeRate.toolFn,
  ...getInformationFromKnowledge.toolFn
}

export const callingToolsRenders = {
  [getDate.callingToolName]: getDate.Render,
  [getWeather.callingToolName]: getWeather.Render,
  [getExchangeRate.callingToolName]: getExchangeRate.Render,
  [getInformationFromKnowledge.callingToolName]:
    getInformationFromKnowledge.Render
}
