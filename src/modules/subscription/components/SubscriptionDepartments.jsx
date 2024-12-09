const SubscriptionDepartments = ({ departments }) => {
    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Departments</div>
            </div>
            <div className="box-body">
                {departments.length ? (
                    departments.map((dept) => (
                        <span key={dept.id} className="badge bg-primary/10 text-primary me-1">
                            {dept.name}
                        </span>
                    ))
                ) : (
                    <p className="text-center text-[#8c9097] dark:text-white/50 text-[0.875rem]">
                        No departments available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SubscriptionDepartments;
