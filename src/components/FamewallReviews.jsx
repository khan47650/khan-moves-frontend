import { useEffect } from "react";

const FamewallReviews = () => {
    useEffect(() => {
        if (
            document.querySelector(
                'script[src="https://embed.famewall.io/newFrame.js"]'
            )
        ) {
            return;
        }

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://embed.famewall.io/newFrame.js";
        script.defer = true;

        document.body.appendChild(script);
    }, []);

    return (
        <div className="w-full overflow-hidden">
            <div
                className="famewall-embed w-full"
                data-src="www-fbdq"
                data-format="carousel"
                style={{
                    width: "100%",
                    display: "block",
                }}
            />
        </div>
    );
};

export default FamewallReviews;