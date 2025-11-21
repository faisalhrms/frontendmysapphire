import React, { useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import sapphireb from "@assets/images/company-logos/sapphireb.png";
import sapphirew from "@assets/images/company-logos/sapphirew.png";
import useDarkModeForm from "@redux/common/useDarkModeForm.js";

export default function SRLTreeDiagram() {
    const [openSRL, setOpenSRL] = useState(false);
    const [openJV, setOpenJV] = useState(false);
    const [openYear2526, setOpenYear2526] = useState(false);

    const isDark = useDarkModeForm();

    return (
        <div className="box custom-box">
            <div className="box-body">
                <Tree
                    lineWidth={"3px"}
                    lineColor={"#cbd5e1"}
                    lineBorderRadius={"12px"}
                    label={
                        <div
                            onClick={() => setOpenSRL(!openSRL)}
                            className="px-10 py-5 bg-gradient-to-br bg-primary/10 text-primary text-xs  rounded-xl shadow-xl inline-block border border-gray-200"
                        >
                            <img
                                src={isDark ? sapphirew : sapphireb}
                                alt="Logo"
                                className="h-5 w-28"
                            />
                        </div>
                    }
                >
                    {openSRL && (
                        <>
                            <TreeNode
                                label={
                                    <div className="px-8 py-4 bg-gradient-to-r bg-primary/10 text-primary text-xs  rounded-xl shadow-lg  border border-gray-200">
                                        General Ledger (GL)
                                    </div>
                                }
                            >
                                <TreeNode
                                    label={
                                        <div
                                            className="px-6 py-3 bg-primary/10 text-primary  text-xs  rounded-lg shadow  border border-gray-200">
                                            GL Library
                                        </div>
                                    }
                                >
                                    <TreeNode
                                        label={
                                            <div
                                                onClick={() => setOpenJV(!openJV)}
                                                className="px-8 py-4 bg-primary/10 text-primary  rounded-xl shadow-lg cursor-pointer
                                transition-all select-none  border border-gray-200"
                                            >
                                                Journal Voucher
                                            </div>
                                        }
                                    >
                                        {openJV && (
                                            <>
                                                <TreeNode label={<div
                                                    className="px-7 py-3 bg-primary/10 text-xs text-primary  rounded-lg  border border-gray-200">Year
                                                    21-22</div>}/>
                                                <TreeNode label={<div
                                                    className="px-7 py-3 bg-primary/10 text-xs text-primary rounded-lg  border border-gray-200">Year
                                                    23-24</div>}/>
                                                <TreeNode label={<div
                                                    className="px-7 py-3 bg-primary/10 text-xs text-primary  rounded-lg  border border-gray-200">Year
                                                    24-25</div>}/>

                                                <TreeNode
                                                    label={
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenYear2526(!openYear2526);
                                                            }}
                                                            className="px-7 py-3 bg-primary/10 text-primary  rounded-lg cursor-pointer
                                      transition-all select-none  border border-gray-200"
                                                        >
                                                            Year 25-26
                                                        </div>
                                                    }
                                                >
                                                    {openYear2526 && (
                                                        <>
                                                            <TreeNode label={<div
                                                                className="px-6 py-3 bg-primary/10 text-xs text-primary rounded-lg shadow-sm  border border-gray-200">BOX
                                                                NOV 25-26</div>}/>
                                                            <TreeNode label={<div
                                                                className="px-6 py-3 bg-primary/10  text-xs text-primary rounded-lg shadow-sm  border border-gray-200">BOX
                                                                SEP 25-26</div>}/>
                                                            <TreeNode label={<div
                                                                className="px-6 py-3 bg-primary/10 text-xs text-primary rounded-lg shadow-sm border border-gray-200">BOX
                                                                OCT 25-26</div>}/>
                                                        </>
                                                    )}
                                                </TreeNode>
                                            </>
                                        )}
                                    </TreeNode>
                                </TreeNode>
                            </TreeNode>

                            {[
                                "Inventory",
                                "Accounts Receivable (AR)",
                                "Accounts Receivable (B2)",
                                "Wash Sample (WS)",
                                "Accounts Payable (AP)",
                            ].map((name) => (
                                <TreeNode
                                    key={name}
                                    label={
                                        <div
                                            className="px-8 py-4 bg-gradient-to-r bg-primary/10 text-primary text-xs rounded-xl shadow-lg  border border-gray-200">
                                            {name}
                                        </div>
                                    }
                                />
                            ))}
                        </>
                    )}
                </Tree>
            </div>
        </div>
    );
}