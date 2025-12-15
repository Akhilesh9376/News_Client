import { useEffect } from "react";

export function preventCopy() {
    useEffect(() => {
        const disableContextMenu = (e: MouseEvent) => e.preventDefault();

        const disableCopyKeys = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                ["c", "a", "x", "s", "p"].includes(e.key.toLowerCase())
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", disableContextMenu);
        document.addEventListener("keydown", disableCopyKeys);

        return () => {
            document.removeEventListener("contextmenu", disableContextMenu);
            document.removeEventListener("keydown", disableCopyKeys);
        };
    }, []);

}