const RequisitionPersonSpec = ({ personSpec }) => {
    if (!personSpec) return null;

    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Person Specification</div>
            </div>

            <div className="box-body !p-0">
                <table className="table whitespace-nowrap min-w-full">
                    <tbody>
                    <tr>
                        <td><strong>Gender:</strong></td>
                        <td>{personSpec.gender}</td>
                    </tr>

                    <tr>
                        <td><strong>Age Range:</strong></td>
                        <td>{personSpec.age_from} - {personSpec.age_to}</td>
                    </tr>

                    <tr>
                        <td><strong>Technical Skills:</strong></td>
                        <td>{personSpec.knowledge_technical_skills}</td>
                    </tr>

                    <tr>
                        <td><strong>Experience:</strong></td>
                        <td>{personSpec.education_relevant_experience}</td>
                    </tr>

                    <tr>
                        <td><strong>Industry Background:</strong></td>
                        <td>{personSpec.preferred_industry_background}</td>
                    </tr>

                    <tr>
                        <td><strong>Behavioral Attributes:</strong></td>
                        <td>{personSpec.personality_behavioral_attributes}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequisitionPersonSpec;
