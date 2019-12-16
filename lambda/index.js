/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');


const startVoice = "Bienvenido a la skill, encuentra el número desconocido. Intenta averiguar el número entre 1 y 100 que tengo en mente; Di un número:";
const helpVoice = "Tienes que intentar averiguar el número entre 1 y 100 que tengo en mente. Di un número:";

var numberRandom = Math.floor((Math.random() * 100) + 1);
var stringRandom = numberRandom.toString();



const startHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    
    return handlerInput.responseBuilder
      .speak(startVoice)
      .reprompt(startVoice)
      .getResponse();
  },
};

const gameHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'numeroIntent';
  },
  handle(handlerInput) {
    
    const request = handlerInput.requestEnvelope.request;
    const numberPlayer = request.intent.slots.number.value;
    
    return handlerInput.responseBuilder
      .speak(numberGame(numberPlayer))
      .reprompt("Tienes que decir un número para intentar acertar.")
      .getResponse();
  },
};

function numberGame(numberPlayer){
  
  const stringPlayer = numberPlayer.toString(); 
  
  if(stringPlayer == stringRandom){
   return correct();
  }else if(stringPlayer > stringRandom){
    return "Has dicho un número más alto, vuelve a decir otro número.";
  }else if(stringPlayer < stringRandom){
    return "Has dicho un número más bajo, vuelve a decir otro número.";
  }else{
    return "Error";
  }
  
}


function correct(){

  const correctNumber = stringRandom;
  numberRandom = Math.floor((Math.random() * 100) + 1);
  stringRandom = numberRandom.toString();

  return "Has acertado el número "+correctNumber+". Puedes continuar jugando hasta averiguar el nuevo número, si prefieres dejar de jugar, solo tienes decir dejar de jugar.";
}

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    
    return handlerInput.responseBuilder
      .speak(helpVoice)
      .reprompt(startVoice)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak('Cerrando la Skill de averiguar el número desconocido, hasta pronto.')
      .getResponse();
  },
};




const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Ha ocurrido un error.')
      .reprompt('Ha ocurrido un error.')
      .getResponse();
  },
};


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    startHandler,
    gameHandler,
    HelpHandler,
    ExitHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();