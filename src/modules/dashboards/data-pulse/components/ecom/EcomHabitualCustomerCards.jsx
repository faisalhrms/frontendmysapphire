import React, { useMemo } from "react";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import { Users, RotateCcw, Wallet } from "lucide-react";

const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const EcomHabitualCustomerCards = ({ cards = {}, loading = false, formatAmount = (n) => String(n) }) => {
    const data = useMemo(() => {
        const totalCustomers = safeNum(cards?.total_customers);
        const returnOrders = safeNum(cards?.return_orders);
        const totalOrderAmount = safeNum(cards?.total_order_amount);

        return [
            {
                title: "Total Customers",
                value: formatAmount(totalCustomers),
                icon: Users,
                description: "Distinct accounts in selected window",
            },
            {
                title: "Total Return Orders",
                value: formatAmount(returnOrders),
                icon: RotateCcw,
                description: "Orders classified as Return",
            },
            {
                title: "Total Return Amount",
                value: `PKR ${formatAmount(totalOrderAmount)}`,
                icon: Wallet,
                description: "Sum of amounts for Return orders",
            },
        ];
    }, [cards, formatAmount]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.map((c) => (
                <StatCard
                    key={c.title}
                    title={c.title}
                    value={loading ? "-" : c.value}
                    icon={c.icon}
                    description={c.description}
                    loading={loading}
                />
            ))}
        </div>
    );
};

export default EcomHabitualCustomerCards;
