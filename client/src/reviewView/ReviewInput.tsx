type ReviewInputProps = {
    highlight: string
    reviewContent: string
    handleReviewUpdate: (content: string) => void
    submitReview: () => void
    backgroundColour: string
}

function ReviewInput({
    highlight,
    reviewContent,
    handleReviewUpdate,
    submitReview,
    backgroundColour,
}: ReviewInputProps) {
    return (
        <div style={{ backgroundColor: backgroundColour, boxShadow: '10px 10px 5px' }}>
            <div style={{ height: '40px' }}></div>
            <div
                style={{
                    padding: '0px 30px 0px',
                    textIndent: '30px',
                    backgroundImage: `repeating-linear-gradient(${backgroundColour}, ${backgroundColour} 16.15px, #9198e5 17.15px, #9198e5 18.15px)`,
                }}
            >
                <div style={{ fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>"{highlight}"</div>
                <textarea value={reviewContent} onChange={(e) => handleReviewUpdate(e.target.value)} />
                <button onClick={() => submitReview()}>Submit review</button>
            </div>
        </div>
    )
}

export default ReviewInput
