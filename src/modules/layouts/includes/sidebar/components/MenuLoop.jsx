import { Link } from 'react-router-dom';

function MenuLoop({ items, toggleSidemenu, HoverToggleInnerMenuFn, level, isSearching = false}) {

    const handleClick = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Link
                to="#!"
                className={`side-menu__item ${items?.selected ? 'active' : ''} ${items?.searchMatch ? 'bg-blue-50  border-blue-500 dark:bg-blue-900/20' : ''}`}
                onClick={(event) => {
                    event.preventDefault();
                    toggleSidemenu(event, items);
                }}
                onMouseEnter={(event) => HoverToggleInnerMenuFn(event, items)}
            >
                {
                    level < 2 &&
                    <i className={`side-menu__icon bx ${items.icon}`}></i>
                }
                <span className={`${level === 1 ? "side-menu__label" : ""}`}>
                    {items.title}
                    {items.badgetxt ? (
                        <span className={items.class || 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'}>
                            {items.badgetxt}
                        </span>
                    ) : (
                        ""
                    )}
                </span>
                <i className="fe fe-chevron-right side-menu__angle"></i>
            </Link>
            <ul className={`slide-menu child${level}  ${items.active ? 'double-menu-active' : ''} ${items?.dirchange ? "force-left" : ""} `} style={
                items.active
                    ? { display: "block" }
                    : { display: "none" }
            }>
                {level <= 1 ? <li className='slide side-menu__label1'>
                    <Link to="#">{items.title}</Link>
                </li> :""}
                {items.children.map((firstLevel, index)=>
                    <li className={`${firstLevel.menutitle ? 'slide__category' : ''} ${firstLevel?.type === 'empty' ? 'slide' : ''} ${firstLevel?.type === 'link' ? 'slide' : ''} ${firstLevel?.type === 'sub' ? 'slide has-sub' : ''} ${firstLevel?.active ? 'open' : ''} ${firstLevel?.selected ? 'active' : ''}`} key={firstLevel.id || firstLevel.path || index}>
                        {firstLevel.type === "link" ?
                            <Link to={firstLevel.path}
                                  className={`side-menu__item ${firstLevel.selected ? 'active' : ''} ${firstLevel?.searchMatch ? 'bg-blue-50  border-blue-500 dark:bg-blue-900/20' : ''}`}
                            >
                                <span className="">
                            {firstLevel.title}
                                    {firstLevel.badgetxt ? (
                                        <span className={firstLevel.class || 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'}>
                                {firstLevel.badgetxt}
                              </span>
                                    ) : (
                                        ""
                                    )}
                          </span>
                            </Link>
                            : ""}
                        {firstLevel.type === "empty" ?
                            <Link
                                to="#"
                                className={`side-menu__item ${firstLevel?.searchMatch ? 'bg-blue-50  border-blue-500 dark:bg-blue-900/20' : ''}`}
                                onClick={handleClick}
                            >
                                <i className={`side-menu__icon bx ${items.icon}`}></i>
                                <span className="">
                            {firstLevel.title}
                                    {firstLevel.badgetxt ? (
                                        <span className={firstLevel.class  || 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'}>
                                {firstLevel.badgetxt}
                              </span>
                                    ) : (
                                        ""
                                    )}
                          </span>
                            </Link>
                            : ""}
                        {firstLevel.type=== "sub" ?
                            <MenuLoop
                                items={firstLevel}
                                toggleSidemenu={toggleSidemenu}
                                HoverToggleInnerMenuFn={HoverToggleInnerMenuFn}
                                level={level+1}
                                isSearching={isSearching}
                            />
                            : ''}

                    </li>
                )}


            </ul>
        </>
    )
}

export default MenuLoop