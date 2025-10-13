import React, { useState } from "react";
import { useCreateJudgeMeReview } from "../hooks/useJudgeMe";
import Button from "./ui/Button";

export default function WriteReviewForm({ productId, productName, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    body: "",
    reviewer_name: "",
    reviewer_email: "",
    pros: "",
    cons: "",
    recommend: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReviewMutation = useCreateJudgeMeReview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim() || !formData.reviewer_name.trim() || !formData.reviewer_email.trim()) {
      alert("Please fill in all required fields including your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.reviewer_email.trim())) {
      alert("Please enter a valid email address");
      return;
    }

    if (formData.body.trim().length < 10) {
      alert("Please write at least 10 characters for your review");
      return;
    }

    if (!productId) {
      alert("Product ID is missing. Please refresh the page and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine pros, cons, and body into a comprehensive review
      let fullBody = formData.body;
      if (formData.pros.trim()) {
        fullBody += `\n\nPros: ${formData.pros}`;
      }
      if (formData.cons.trim()) {
        fullBody += `\n\nCons: ${formData.cons}`;
      }
      if (formData.recommend) {
        fullBody += `\n\nI would recommend this product to others.`;
      }

      const reviewData = {
        product_id: productId,
        rating: formData.rating,
        title: formData.title,
        body: fullBody,
        reviewer_name: formData.reviewer_name.trim(),
        reviewer_email: formData.reviewer_email.trim()
      };

      console.log('Submitting review data:', reviewData);
      await createReviewMutation.mutateAsync(reviewData);
      
      // Reset form
      setFormData({
        rating: 5,
        title: "",
        body: "",
        reviewer_name: "",
        reviewer_email: "",
        pros: "",
        cons: "",
        recommend: true
      });
      
      onSuccess?.();
    } catch (error) {
      console.error("Failed to submit review:", error);
      let errorMessage = "Failed to submit review. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };


  return (
    <div id="write-review-form" className="bg-white border border-gray-200 rounded-2xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Write a Review</h3>
        {productName && (
          <p className="text-xs md:text-sm text-gray-600">for {productName}</p>
        )}
      </div>



      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
            Overall Rating *
          </label>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`text-2xl md:text-3xl transition-colors ${
                    star <= formData.rating 
                      ? "text-brand-500" 
                      : "text-gray-300 hover:text-brand-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="text-xs md:text-sm text-gray-600">
              {formData.rating === 1 && "Poor - Not satisfied"}
              {formData.rating === 2 && "Fair - Below expectations"}
              {formData.rating === 3 && "Good - Met expectations"}
              {formData.rating === 4 && "Very Good - Exceeded expectations"}
              {formData.rating === 5 && "Excellent - Highly recommend"}
            </div>
          </div>
        </div>

        {/* Reviewer Name */}
        <div>
          <label htmlFor="reviewer_name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="reviewer_name"
            name="reviewer_name"
            value={formData.reviewer_name}
            onChange={handleInputChange}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm md:text-base"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Reviewer Email */}
        <div>
          <label htmlFor="reviewer_email" className="block text-sm font-medium text-gray-700 mb-2">
            Your Email *
          </label>
          <input
            type="email"
            id="reviewer_email"
            name="reviewer_email"
            value={formData.reviewer_email}
            onChange={handleInputChange}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm md:text-base"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm md:text-base"
            placeholder="Summarize your experience"
            required
          />
        </div>

        {/* Review Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-sm md:text-base"
            placeholder="Share your detailed experience with this product. What did you like? How did it taste? Would you buy it again?"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.body.length}/500 characters (minimum 10 required)
          </p>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label htmlFor="pros" className="block text-sm font-medium text-gray-700 mb-2">
              What you liked (Optional)
            </label>
            <textarea
              id="pros"
              name="pros"
              value={formData.pros}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-sm md:text-base"
              placeholder="e.g., Great taste, good value, fast delivery..."
            />
          </div>
          <div>
            <label htmlFor="cons" className="block text-sm font-medium text-gray-700 mb-2">
              What could be improved (Optional)
            </label>
            <textarea
              id="cons"
              name="cons"
              value={formData.cons}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-sm md:text-base"
              placeholder="e.g., Packaging could be better, price is high..."
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-center gap-2 md:gap-3">
          <input
            type="checkbox"
            id="recommend"
            name="recommend"
            checked={formData.recommend}
            onChange={handleInputChange}
            className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 flex-shrink-0"
          />
          <label htmlFor="recommend" className="text-xs md:text-sm font-medium text-gray-700">
            I would recommend this product to others
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            size="btn"
            onClick={onCancel}
            className="w-full md:flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            size="btn"
            className="w-full md:flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
}
