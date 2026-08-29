import { useEffect, useRef } from "react";

const FAMEWALL_SCRIPT =
    "https://embed.famewall.io/newFrame.js";

const FamewallReviews = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const initializeFamewall = () => {
            // Famewall script ko dobara existing embed elements
            // par initialize karne ki koshish
            if (window.Famewall) {
                if (typeof window.Famewall.init === "function") {
                    window.Famewall.init();
                }
            }

            // Agar Famewall global init expose na kare to
            // script ko reload karke widget initialize karwao
            const oldScript = document.querySelector(
                `script[src="${FAMEWALL_SCRIPT}"]`
            );

            if (oldScript) {
                oldScript.remove();
            }

            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `${FAMEWALL_SCRIPT}?t=${Date.now()}`;
            script.defer = true;

            document.body.appendChild(script);
        };

        const existingScript = document.querySelector(
            `script[src^="${FAMEWALL_SCRIPT}"]`
        );

        if (existingScript) {
            // Script already loaded hai, lekin naya
            // Famewall container mount hua hai.
            setTimeout(initializeFamewall, 50);
        } else {
            const script = document.createElement("script");

            script.type = "text/javascript";
            script.src = FAMEWALL_SCRIPT;
            script.defer = true;

            script.onload = () => {
                setTimeout(() => {
                    if (window.Famewall?.init) {
                        window.Famewall.init();
                    }
                }, 50);
            };

            document.body.appendChild(script);
        }

        return () => {
            // Component unmount hone par Famewall ka generated
            // content clean ho jayega because container unmount hota hai.
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full overflow-hidden"
        >
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