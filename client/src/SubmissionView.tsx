import { Review, SubmissionWithReviews } from './types/UserInfo'

type SubmissionsProps = { submissionsWithReviews: SubmissionWithReviews[] | null }
function SubmissionsView({ submissionsWithReviews }: SubmissionsProps) {
    console.log(submissionsWithReviews)
    if (submissionsWithReviews === null) {
        ;<div>you have no submissions with reivews</div>
    } else {
        return (
            <div>
                {submissionsWithReviews.map((submissionWithReviews: SubmissionWithReviews) => {
                    return (
                        <div key={submissionWithReviews.submission.id}>
                            <div>{submissionWithReviews.submission.content}</div>
                            {submissionWithReviews.reviews ? (
                                <Reviews reviews={submissionWithReviews.reviews}></Reviews>
                            ) : (
                                <div>no reviews yet</div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default SubmissionsView

type ReviewsProps = { reviews: Review[] }

function Reviews({ reviews }: ReviewsProps) {
    return (
        <div>
            {reviews.map((review: Review) => (
                <div key={review.id}>{review.content}</div>
            ))}
        </div>
    )
}
