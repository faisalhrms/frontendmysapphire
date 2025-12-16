const ApplicantQualifications = ({ items }) => {
    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">
                    Qualifications
                    <span className="badge bg-primary/10 ms-1">{items?.length || 0}</span>
                </div>
            </div>

            <div className="box-body !p-0">
                {items?.length ? (
                    <table className="table whitespace-nowrap min-w-full">
                        <thead>
                        <tr>
                            <th className="!ps-4">Degree</th>
                            <th>Institution</th>
                            <th>Year</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((q) => (
                            <tr key={q.id}>
                                <td className="!ps-4">{q.degree || "—"}</td>
                                <td>{q.institution || "—"}</td>
                                <td>{q.year_completed ?? "—"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-4 text-gray-500">No qualifications added.</div>
                )}
            </div>
        </div>
    );
};

export default ApplicantQualifications;
