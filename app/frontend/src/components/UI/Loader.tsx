import "@/styles/loader.css"

const Loader = () => {
    return (
        <div className="flex min-h-[70vh] items-center justify-center">
            <div className="book">
                <div className="inner">
                    <div className="left"></div>
                    <div className="middle"></div>
                    <div className="right"></div>
                </div>
                <ul>
                    {Array.from({ length: 10 }, (_, i) => <li key={i}></li>)}
                </ul>
            </div>
        </div>
    );
};

export default Loader;