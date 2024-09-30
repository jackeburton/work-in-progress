type ReviewCardsProps = {
    reviewSections: ReviewSection[]
    deleteReviewSection: (index: number) => void
    backgroundColour: string
}

function ReviewCards({ reviewSections, deleteReviewSection, backgroundColour }: ReviewCardsProps) {
    return (
        <div>
            {reviewSections.map((content, index) => (
                <div
                    style={{ backgroundColor: backgroundColour, boxShadow: '10px 10px 5px', marginBottom: '20px' }}
                    key={index}
                >
                    <div style={{ height: '40px' }}></div>
                    <div
                        style={{
                            padding: '0px 30px 0px',
                            textIndent: '30px',
                            backgroundImage: `repeating-linear-gradient(${backgroundColour}, ${backgroundColour} 16.15px, #9198e5 17.15px, #9198e5 18.15px)`,
                        }}
                    >
                        <div style={{ fontStyle: 'italic' }}>"{content.quote}"</div>
                        <div style={{ height: '20px' }}></div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{content.content}</div>
                    </div>
                    <button onClick={() => deleteReviewSection(index)}>Remove</button>
                </div>
            ))}
        </div>
    )
}

export default ReviewCards
