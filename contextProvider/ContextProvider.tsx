import { prepareDatabase } from "@/db/init";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const MyContext = createContext<null | any>(null);

export const Provider = ({ children }: { children: ReactNode }) => {
    const [isSeeded, setIsSeeded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                if (!isSeeded) {
                    await prepareDatabase();
                    setIsSeeded(true);
                }
            } catch (e) {
                console.error('DB init error => :', e);
            }
        })();
    }, [])



    const values = {
        isSeeded,
        setIsSeeded
    };

    return (
        <MyContext.Provider value={values}>
            {
                children
            }
        </MyContext.Provider>
    )
};

export const useSeed = () => {
    const data = useContext(MyContext);
    if (!data) return "This component is outside of PROVIDER!";
    return data;
};