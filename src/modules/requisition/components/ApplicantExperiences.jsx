const ApplicantExperiences = ({ items }) => {
    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">
                    Work Experience
                    <span className="badge bg-primary/10 ms-1">{items?.length || 0}</span>
                </div>
            </div>

            <div className="box-body !p-0">
                {items?.length ? (
                    <table className="table whitespace-nowrap min-w-full">
                        <thead>
                        <tr>
                            <th className="!ps-4">Company</th>
                            <th>Designation</th>
                            <th>Years in Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((e) => (
                            <tr key={e.id}>
                                <td className="!ps-4">{e.company || "—"}</td>
                                <td>{e.designation || "—"}</td>
                                <td>{e.years_in_role ?? "—"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-4 text-gray-500">No experience added.</div>
                )}
            </div>
        </div>
    );
};

export default ApplicantExperiences;
