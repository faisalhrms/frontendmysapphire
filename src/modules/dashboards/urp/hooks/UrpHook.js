import {useEffect, useState} from "react";
import {getUrpCards} from "@modules/dashboards/urp/services/UrpService.js";

export const useUrpCard=()=>{
    const [cardData,setCardData]=useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const data = await getUrpCards();
                setCardData(data);
            } catch (error) {
                // Handle error if needed
            } finally {
                setLoading(false);
            }
        };

        fetchCardsData();
    }, []);

    return { cardData, loading };
};