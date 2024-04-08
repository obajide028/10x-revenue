const express = require('express');
const Resource = require('../models/Resources');
const { getResources, getResource, createResource, updateResource, deleteResource, uploadPhoto } = require('../controllers/resources');
const { protect, authorize } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');
const router = express.Router();


// Include other resource routers
 const reviewRouter = require('./review');

 // Re-route into other routers
router.use('/:resourceId/reviews', reviewRouter);


router
   .route('/')
   .get(advancedResult(Resource),  getResources)
   .post(protect, authorize('admin'), createResource);


router
    .route('/:id')
    .get(getResource)
    .put(protect, authorize('admin'), updateResource)
    .delete(protect, authorize('admin'), deleteResource);
    
module.exports = router;