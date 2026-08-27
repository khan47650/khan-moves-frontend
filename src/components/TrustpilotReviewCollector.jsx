import { useEffect } from "react";

export default function TrustpilotReviewCollector() {
    useEffect(() => {
        if (window.Trustpilot) {
            const trustbox = document.getElementById("trustpilot-review-collector");

            if (trustbox) {
                window.Trustpilot.loadFromElement(trustbox, true);
            }
        }
    }, []);

    return (
        <div id="trustpilot-review-collector" className="trustpilot-widget" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="6a8e7cfc312dbcc386ebd19c" data-style-height="52px" data-style-width="100%" data-token="0a7857b3-bceb-4519-b90b-53649f9a0128">
            <a href="https://www.trustpilot.com/review/khanmoves.com" target="_blank" rel="noopener noreferrer">
                Trustpilot
            </a>
        </div>
    );
}