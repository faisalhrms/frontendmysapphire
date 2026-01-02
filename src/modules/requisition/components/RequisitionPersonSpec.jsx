const RequisitionPersonSpec = ({ requisition }) => {
    const Row = ({ label, value, html = false }) => (
        <tr className="border-b last:border-b-0">
            <td className="w-60 align-top p-3 font-semibold whitespace-nowrap">{label}</td>
            <td className="align-top p-3 whitespace-normal break-words [overflow-wrap:anywhere]">
                {html ? (
                    value ? <div dangerouslySetInnerHTML={{ __html: value }} /> : "—"
                ) : (
                    value ?? "—"
                )}
            </td>
        </tr>
    );

    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Requirements</div>
            </div>

            <div className="box-body !p-0 overflow-x-auto">
                <table className="table min-w-full table-fixed">
                    <tbody>
                    <Row
                        label="Minimum Total Experience (Years):"
                        value={requisition.min_total_experience_years ?? "—"}
                    />
                    <Row
                        label="Education / Relevant Experience:"
                        value={requisition.education_relevant_experience}
                        html
                    />
                    <Row
                        label="Knowledge / Technical Skills:"
                        value={requisition.knowledge_technical_skills}
                        html
                    />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequisitionPersonSpec;
