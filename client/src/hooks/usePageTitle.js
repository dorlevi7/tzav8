import { useEffect } from "react";

function usePageTitle(title) {
    useEffect(() => {
        document.title = `Tzav8 – ${title}`;
    }, [title]);
}

export default usePageTitle;