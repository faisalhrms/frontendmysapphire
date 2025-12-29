const RequisitionPersonSpec = ({ personSpec }) => {
    if (!personSpec) return null;

    const Row = ({ label, value }) => (
        <tr className="border-b last:border-b-0">
            <td className="w-48 align-top p-3 font-semibold whitespace-nowrap">
                {label}
            </td>
            <td className="align-top p-3 whitespace-normal break-words [overflow-wrap:anywhere]">
                {value || "—"}
            </td>
        </tr>
    );

    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Person Specification</div>
            </div>

            <div className="box-body !p-0 overflow-x-auto">
                <table className="table min-w-full table-fixed">
                    <tbody>
                    <Row label="Gender:" value={personSpec.gender} />
                    <Row
                        label="Age Range:"
                        value={`${personSpec.age_from ?? "—"} - ${personSpec.age_to ?? "—"}`}
                    />
                    <Row
                        label="Technical Skills:"
                        value={personSpec.knowledge_technical_skills}
                    />
                    <Row
                        label="Experience:"
                        value={personSpec.education_relevant_experience}
                    />
                    <Row
                        label="Industry Background:"
                        value={personSpec.preferred_industry_background}
                    />
                    <Row
                        label="Behavioral Attributes:"
                        value={personSpec.personality_behavioral_attributes}
                    />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequisitionPersonSpec;
