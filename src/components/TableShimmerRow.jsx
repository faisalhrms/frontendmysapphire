import React from 'react';
import ContentLoader from 'react-content-loader';

const TableShimmerRow = ({ columns, rowHeight = 10 }) => {
    return (
        <tr className='border-b border-defaultborder text-[0.6875rem]'>
            {Array.from({ length: columns }).map((_, index) => (
                <td key={index} className="!px-4 !py-4">
                    <ContentLoader
                        speed={2}
                        width="100%"
                        height={rowHeight}
                        backgroundColor="#f3f4f6"
                        foregroundColor="#e5e7eb"
                    >
                        <rect x="0" y="0" rx="4" ry="4" width="100%" height={rowHeight} />
                    </ContentLoader>
                </td>
            ))}
        </tr>
    );
};

export default TableShimmerRow;
