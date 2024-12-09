import { Link } from 'react-router-dom';

function MenuLoop({ items, toggleSidemenu, HoverToggleInnerMenuFn, level}) {

    const handleClick = (event) => {
        event.preventDefault();
    };
    return (
        <>
            <Link to="#!" className={`side-menu__item ${items?.selected ? 'active' : ''}`} onClick={(event) => {
                event.preventDefault();
                toggleSidemenu(event, items);
            }} onMouseEnter={(event) => HoverToggleInnerMenuFn(event, items)}>
                <i className={`side-menu__icon bx ${items.icon}`}></i>
                <span className={`${level === 1 ? "side-menu__label" : ""}`}>
                    {items.title}
                    {items.badgetxt ? (
                        <span className={items.class}>
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
                {items.children.map((firstLevel)=>
                    <li className={`${firstLevel.menutitle ? 'slide__category' : ''} ${firstLevel?.type === 'empty' ? 'slide' : ''} ${firstLevel?.type === 'link' ? 'slide' : ''} ${firstLevel?.type === 'sub' ? 'slide has-sub' : ''} ${firstLevel?.active ? 'open' : ''} ${firstLevel?.selected ? 'active' : ''}`} key={Math.random()}>
                        {firstLevel.type === "link" ?
                            <Link to={firstLevel.path}
                                  className={`side-menu__item ${firstLevel.selected ? 'active' : ''}`}>
                                <span className="">
                            {firstLevel.title}
                                    {firstLevel.badgetxt ? (
                                        <span className={firstLevel.class}>
                                {firstLevel.badgetxt}
                              </span>
                                    ) : (
                                        ""
                                    )}
                          </span>
                            </Link>
                            : ""}
                        {firstLevel.type === "empty" ?
                            <Link to="#" className='side-menu__item' onClick={handleClick}>
                                <i className={`side-menu__icon bx ${items.icon}`}></i>
                                <span className="">
                            {firstLevel.title}
                                    {firstLevel.badgetxt ? (
                                        <span className={firstLevel.class}>
                                {firstLevel.badgetxt}
                              </span>
                                    ) : (
                                        ""
                                    )}
                          </span>
                            </Link>
                            : ""}
                        {firstLevel.type=== "sub" ?
                            <MenuLoop items={firstLevel} toggleSidemenu={toggleSidemenu} HoverToggleInnerMenuFn={HoverToggleInnerMenuFn} level={level+1}/>
                            : ''}

                    </li>
                )}


            </ul>
        </>
    )
}

export default MenuLoop
