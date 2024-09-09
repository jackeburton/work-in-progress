import { Submission } from './types/UserInfo'

type ReviewViewProps = { submissionsToReview: Submission[] }
function ReviewView({ submissionsToReview }: ReviewViewProps) {
    return (
        <div>
            {submissionsToReview.map((submission) => (
                <div key={submission.id}>{submission.content}</div>
            ))}
        </div>
    )
}
export default ReviewView
