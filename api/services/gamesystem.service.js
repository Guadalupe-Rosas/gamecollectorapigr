'use strict';

var _ = require('lodash');

//var videogameRepository = require('../repositories/videogame.repository');
var gamesystemRepository = require('../repositories/gamesystem.repository');
var messageHelper = require('../helpers/message.helper');

////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

// Error Messages
const GS_SVC_ERR_CREATE_GS_ALREADY_EXISTS_WITH_SAME_NAME = 'Not possible to create gamesystem. There is a gamesystem with the same name in the system';
const GS_SVC_ERR_UPDATE_GS_ALREADY_EXISTS_WITH_SAME_NAME = 'Not possible to update gamesystem. There is a gamesystem with the same name to update in the system';
const GS_SVC_ERR_UPDATE_GS_NOT_FOUND_BY_ID = 'Not possible to update gamesystem. There is NOT a gamesystem with the same id to update'
const GS_SVC_ERR_DELETE_GS_NOT_FOUND_BY_ID = 'Not possible to delete gamesystem. Gamesystem not found';
const GS_SVC_ERR_DELETE_VG_EXISTS_ASSOCIATED = 'Not possible to delete gamesystem. There are videogames associated with the gamesystem';

////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
////////////////////////////////////////////////////////////////////////////////

function getGameSystems(params) {
  return gamesystemRepository.getGameSystems(params);
}

function getGameSystemById(id) {
  return gamesystemRepository.getGameSystemById(id);
}

function getGameSystemByName(name) {
  return gamesystemRepository.getGameSystemByName(name);
}

function createGameSystem(params) {

  // Checks if exists a gamesystem with the same name - Using module.exports to call the function to ease the testing
  var gamesystemFound = module.exports.getGameSystemByName(params.name);
  if (_.isUndefined(gamesystemFound)) {
    return gamesystemRepository.createGameSystem(params);
  } else {
    return messageHelper.buildErrorMessage(GS_SVC_ERR_CREATE_GS_ALREADY_EXISTS_WITH_SAME_NAME);
  }
}

function updateGameSystem(params) {

  var result;
  // Checks if exists a gamesystem with the same id - Using module.exports to call the function to ease the testing
  var gamesystemFoundById = module.exports.getGameSystemById(params.id);
  if (!_.isUndefined(gamesystemFoundById)) {

    // Then checks if exists a gamesystem with the same name. If exists, the id must be the same that the object in params
    var gamesystemFoundByName = module.exports.getGameSystemByName(params.name);

    if (_.isUndefined(gamesystemFoundByName) || gamesystemFoundByName.id === params.id) {
      result = gamesystemRepository.updateGameSystem(params);
    } else {
      result = messageHelper.buildErrorMessage(GS_SVC_ERR_UPDATE_GS_ALREADY_EXISTS_WITH_SAME_NAME);
    }
  } else {
    result = messageHelper.buildErrorMessage(GS_SVC_ERR_UPDATE_GS_NOT_FOUND_BY_ID);
  }

  return result;
}

function deleteGameSystem(id) {

  var result;

  // First obtains the game system
  var myGameSystem = module.exports.getGameSystemById(id);

  if (!_.isUndefined(myGameSystem)) {
    var filterParams = { gamesystem: myGameSystem.name };
    var games = videogameRepository.getVideoGames(filterParams);

    if (!_.isUndefined(games) && games.length > 0) {
      result = messageHelper.buildErrorMessage(GS_SVC_ERR_DELETE_VG_EXISTS_ASSOCIATED);
    } else {
      var resultDeletion = gamesystemRepository.deleteGameSystem(id);
      if (resultDeletion) {
        result = true;
      } else {
        result = messageHelper.buildErrorMessage(GS_SVC_ERR_DELETE_GS_NOT_FOUND_BY_ID);
      }
    }
  } else {
    result = messageHelper.buildErrorMessage(GS_SVC_ERR_DELETE_GS_NOT_FOUND_BY_ID);
  }

  return result;
}

module.exports = {
  getGameSystems,
  getGameSystemById,
  getGameSystemByName,
  createGameSystem,
  updateGameSystem,
  deleteGameSystem,
  GS_SVC_ERR_CREATE_GS_ALREADY_EXISTS_WITH_SAME_NAME,
  GS_SVC_ERR_UPDATE_GS_ALREADY_EXISTS_WITH_SAME_NAME,
  GS_SVC_ERR_UPDATE_GS_NOT_FOUND_BY_ID,
  GS_SVC_ERR_DELETE_GS_NOT_FOUND_BY_ID,
  GS_SVC_ERR_DELETE_VG_EXISTS_ASSOCIATED
}
