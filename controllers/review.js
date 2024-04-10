const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Resource = require('../models/Resources');
const Review = require('../models/Review');



//@desc     Get Reviews
// @route   GET /api/v1/reviews
//@route    GET /api/v1/resources/:resourceId/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res, next) => {
    if(req.params.resourceId){
      const reviews = await Review.find({ resource: req.params.resourceId });
       return res.status(200).json({
         success: true,
         count: reviews.length,
         data: reviews
       });
 
     } else {
      res.status(200).json(res.advancedResults)
    }
 
 });


 //@desc     Get single Reviews
// @route   GET /api/v1/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'resource',
    select: 'title'
  });

  if(!review){
    return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review
  })
 });

 //@desc    Add Reviews
// @route   POST /api/v1/resources/:resourceId/reviews
// @access  Private
const addReview = asyncHandler(async (req, res, next) => {
     req.body.resource = req.params.resourceId;
     req.body.user = req.user.id;

     const resource = await Resource.findById(req.params.resourceId);

     if(!resource){
        return next(new ErrorResponse(`No resource with the id of ${req.params.resourceId}`, 404))
     }

     const review = await Review.create(req.body);
  
    res.status(201).json({
      success: true,
      data: review
    })
   });


//@desc     Update Reviews
// @route   PUT /api/v1/reviews/:id 
// @access  Private
const updateReview = asyncHandler(async (req, res, next) => {
   
    let review = await Review.findById(req.params.id);

    if(!review){
       return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404))
    }

    // Make sure review belongs to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not authorized to update review`, 401))

    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
 
   res.status(201).json({
     success: true,
     data: review
   });
   
   // Recalculate and update the resource's average rating
    await Review.getAverageRating(review.resource);
  });


  //@desc   Delete review
// @route   Delete /api/v1/reviews/:id 
// @access  Private
const deleteReview = asyncHandler(async (req, res, next) => {
   
    const review = await Review.findById(req.params.id);

    if(!review){
       return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404))
    }

    // Make sure review belongs to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not authorized to update review`, 401))

    }

    await review.deleteOne({ _id: req.params.id});
 
   res.status(200).json({})
  });


  module.exports = { getReviews, getReview, addReview, updateReview, deleteReview };