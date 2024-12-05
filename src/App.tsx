import { useState, useEffect } from "react";
import { FaTwitter, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import "./App.css";

interface Quote {
    content: string; // The text of the quote
    author: string; // The author of the quote
}

const getRandomColor = (): string => {
    const red = Math.floor(Math.random() * 128);
    const green = Math.floor(Math.random() * 128);
    const blue = Math.floor(Math.random() * 128);

    return `rgb(${red}, ${green}, ${blue})`;
};

const transition = "all 1s";

function App() {
    const [loading, setLoading] = useState<boolean>(true) // State to track loading status.
    const [quote, setQuote] = useState<Quote | null>(null); // State for the current quote.
    const [randomColor, setRandomColor] = useState<string>(getRandomColor());

    // Fetch a random quote from the Quotable API.
    const fetchRandomQuote = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://api.quotable.io/random");
            if (!response.ok) {
                throw new Error("Failed to fetch quote");
            }
            const data: Quote = await response.json();
            setQuote(data);
        } catch (error) {
            console.error("Error fetching the quote:", error);
            setQuote({ content: "Oops! Unable to fetch a quote.", author: "Error"});
        } finally {
            setLoading(false);
        }
    };

    // Fetch a new random quote and update color.
    const changeQuote = async () => {
        setRandomColor(getRandomColor());
        await fetchRandomQuote();
    };

    // Fetch the first quote on component mount.
    useEffect(() => {
        fetchRandomQuote();
    }, []);

    return (
        <div
            className="background"
            style={{ backgroundColor: randomColor, transition }}
        >
            <div id="quote-box">
                <div
                    className="quote-content"
                    style={{ color: randomColor, transition }}
                >
                    <h2 id="text">
                        <FaQuoteLeft size="30" style={{ marginRight: "10px" }} />
                        {loading ? "Loading..." : quote?.content} {/* Display loading text if no quote */}
                        <FaQuoteRight size="30" style={{ marginLeft: "10px" }} />
                    </h2>
                    <h4 id="author">~ {loading ? "Fetching..." : quote?.author || "Unknown"}</h4>
                </div>
                <div className="buttons">
                    <a
                        href={`https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=${quote?.content} - ${quote?.author}`}
                        id="tweet-quote"
                        style={{
                            backgroundColor: randomColor,
                            marginRight: "10px",
                            transition,
                        }}
                    >
                        <FaTwitter color="white" />
                    </a>
                    <button
                        id="new-quote"
                        onClick={changeQuote}
                        style={{ backgroundColor: randomColor, transition }}
                    >
                        New Quote
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;