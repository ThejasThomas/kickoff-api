export const mapTurfReview = (
  review: any,
  userName: string
) => ({
  _id: review._id.toString(),
  comment: review.comment,
  createdAt: review.createdAt,
  userName,
});
