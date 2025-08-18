export function QuarterDisplayCompact({ quarter }) {
    const getQuarterStyle = (q) => {
        const quarterNum = typeof q === "string" ? Number.parseInt(q) : q

        const styles = {
            1: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50 hover:bg-emerald-100" },
            2: { dot: "bg-primary/20", text: "text-primary", bg: "bg-primary/20 hover:bg-primary/20" },
            3: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50 hover:bg-amber-100" },
            4: { dot: "bg-danger/30", text: "text-danger", bg: "bg-danger/30 hover:bg-danger/30" },
        }

        return (
            styles[quarterNum] || {
            dot: "bg-slate-500",
                text: "text-slate-700",
                bg: "bg-slate-50 hover:bg-slate-100",
        }
    )
    }

    const style = getQuarterStyle(quarter)

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${style.bg} border transition-all duration-200 ease-in-out`}
        >
            <p className="text-xs font-medium text-slate-500 mb-0">QUARTER</p>
            <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${style.dot} shadow-sm`}></div>
                <span className={`text-sm font-bold ${style.text}`}>{quarter}</span>
            </div>
        </div>
    )
}
