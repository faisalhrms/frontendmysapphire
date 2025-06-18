import {useParams} from "react-router-dom";

const PublicDynamicForm = () => {
    const { slug } = useParams();
    return (
        <>
            <p>{slug}</p>
        </>
    )
}

export default PublicDynamicForm