const express = require('express')
const router = express.Router()

/** Service */
const ConfinementService = require('../services/confinementService');

// @route  GET api/confinement/
// @desc   Get confinement
// @access Authenticated
router.get('/', ConfinementService.getAll);

// @route  GET api/confinement/
// @desc   Get confinement
// @params confinementId
// @access Authenticated
router.get('/:confinementId', ConfinementService.get);

// @route  POST api/confinement/
// @desc   Register confinement
// @params userId
// @access Authenticated
router.post('/:userId', ConfinementService.create);

// @route  PUT api/confinement/
// @desc   Update confinement
// @params confinementId
// @access Authenticated
router.put('/:confinementId', ConfinementService.update);

// @route  DELETE api/confinement/
// @desc   Remove confinement
// @params confinementId
// @access Authenticated
router.delete('/:confinementId', ConfinementService.remove);

// @route  GET api/confinement/by-user/
// @desc   Get confinement by user
// @params userId
// @access Authenticated
router.get('/by-user/:userId', ConfinementService.getByUser);

// @route  GET api/confinement/treatment/
// @desc   Get confinement
// @params confinementId
// @access Authenticated
router.get('/treatment/:confinementId', ConfinementService.treatment);

module.exports = router