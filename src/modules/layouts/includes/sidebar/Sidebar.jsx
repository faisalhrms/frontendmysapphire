import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import logo1 from "@assets/images/brand-logos/desktop-logo.svg";
import logo2 from "@assets/images/brand-logos/toggle-logo.png";
import logo3 from "@assets/images/brand-logos/desktop-dark.svg";
import logo4 from "@assets/images/brand-logos/toggle-dark.png";
import logo5 from "@assets/images/brand-logos/desktop-white.png";
import logo6 from "@assets/images/brand-logos/toggle-white.png";
import SimpleBar from 'simplebar-react';
import {useDispatch, useSelector} from "react-redux";
import {setTheme} from "@redux/common/themeSlice.js";
import MenuLoop from "@modules/layouts/includes/sidebar/components/MenuLoop.jsx";
import useMenuItems from "@hooks/useMenuItems.js";
import {DASHBOARD_ROUTES} from "@modules/dashboards/routes.js";


const Sidebar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const initialMenuItems = useMenuItems();
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  useEffect(() => {
    setMenuItems(initialMenuItems);
  }, [initialMenuItems]);

  function closeMenuFn() {
    const closeMenuRecursively = (items) => {
      items?.forEach((item) => {
        item.active = false;
        closeMenuRecursively(item.children);
      });
    };
    closeMenuRecursively(menuItems);
    setMenuItems((arr) => [...arr]);
  }

  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (window.innerWidth <= 992) {
      if (mainContent) {
        dispatch(setTheme({
          "toggled": "close"
        }))
      } else if (document.documentElement.getAttribute("data-nav-layout") === "horizontal") {
        closeMenuFn();
      }
    }
    mainContent.addEventListener('click', menuClose);
    window.addEventListener('resize', menuResizeFn);
  }, []);

  const location = useLocation();


  function Onhover() {
    if ((theme.toggled === 'icon-overlay-close' || theme.toggled === 'detached-close') && theme.iconOverlay !== 'open') {
      dispatch(setTheme({
        "iconOverlay": "open"
      }))
    }
  }

  function Outhover() {
    if ((theme.toggled === 'icon-overlay-close' || theme.toggled === 'detached-close') && theme.iconOverlay === 'open') {
      dispatch(setTheme({
        "iconOverlay": ""
      }))
    }
  }

  function menuClose() {
    if (window.innerWidth <= 992) {
      dispatch(setTheme({
        "toggled": "close"
      }))
    }
    const overlayElement = document.querySelector("#responsive-overlay");
    if (overlayElement) {

      overlayElement.classList.remove("active");
    }
    if (theme.dataNavLayout === 'horizontal' || theme.dataNavStyle === 'menu-click' || theme.dataNavStyle === 'icon-click') {
      closeMenuFn();
    }
    if (window.innerWidth > 992) {
      if (theme.iconOverlay === "open") {
        dispatch(setTheme({
          "iconOverlay": ""
        }))
      }
    }

  }

  const WindowPreSize = [window.innerWidth]

  function menuResizeFn() {

    WindowPreSize.push(window.innerWidth);
    if (WindowPreSize.length > 2) {
      WindowPreSize.shift()
    }
    if (WindowPreSize.length > 1) {
      if ((WindowPreSize[WindowPreSize.length - 1] < 992) && (WindowPreSize[WindowPreSize.length - 2] >= 992)) {
        // less than 992;
        dispatch(setTheme({
          "toggled": "close"
        }))
      }

      if ((WindowPreSize[WindowPreSize.length - 1] >= 992) && (WindowPreSize[WindowPreSize.length - 2] < 992)) {
        // greater than 992
        dispatch(setTheme({
          "toggled": theme.dataVerticalStyle === "doublemenu" ? "double-menu-open" : ""
        }))
      }
    }
  }

  function switcherArrowFn() {

    // Used to remove is-expanded class and remove class on clicking arrow buttons
    function slideClick() {
      const slide = document.querySelectorAll(".slide");
      const slideMenu = document.querySelectorAll(".slide-menu");

      slide.forEach((element) => {
        if (element.classList.contains("is-expanded")) {
          element.classList.remove("is-expanded");
        }
      });

      slideMenu.forEach((element) => {
        if (element.classList.contains("open")) {
          element.classList.remove("open");
          element.style.display = "none";
        }
      });
    }

    slideClick();
  }

  function slideRight() {
    const menuNav = document.querySelector(".main-menu");
    const mainContainer1 = document.querySelector(".main-sidebar");

    if (menuNav && mainContainer1) {
      const marginLeftValue = Math.ceil(Number(window.getComputedStyle(menuNav).marginInlineStart.split("px")[0]));
      const marginRightValue = Math.ceil(Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0]));
      const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
      let mainContainer1Width = mainContainer1.offsetWidth;

      if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
        if (!(theme.dataVerticalStyle.dir === "rtl")) {
          if (Math.abs(check) > Math.abs(marginLeftValue)) {
            menuNav.style.marginInlineEnd = "0";

            if (!(Math.abs(check) > Math.abs(marginLeftValue) + mainContainer1Width)) {
              mainContainer1Width = Math.abs(check) - Math.abs(marginLeftValue);
              const slideRightButton = document.querySelector("#slide-right");
              if (slideRightButton) {
                slideRightButton.classList.add("hidden");
              }
            }

            menuNav.style.marginInlineStart = (Number(menuNav.style.marginInlineStart.split("px")[0]) - Math.abs(mainContainer1Width)) + "px";

            const slideRightButton = document.querySelector("#slide-right");
            if (slideRightButton) {
              slideRightButton.classList.remove("hidden");
            }
          }
        } else {
          if (Math.abs(check) > Math.abs(marginRightValue)) {
            menuNav.style.marginInlineEnd = "0";

            if (!(Math.abs(check) > Math.abs(marginRightValue) + mainContainer1Width)) {
              mainContainer1Width = Math.abs(check) - Math.abs(marginRightValue);
              const slideRightButton = document.querySelector("#slide-right");
              if (slideRightButton) {
                slideRightButton.classList.add("hidden");
              }
            }

            menuNav.style.marginInlineStart = (Number(menuNav.style.marginInlineStart.split("px")[0]) - Math.abs(mainContainer1Width)) + "px";

            const slideLeftButton = document.querySelector("#slide-left");
            if (slideLeftButton) {
              slideLeftButton.classList.remove("hidden");
            }
          }
        }
      }

      const element = document.querySelector(".main-menu > .slide.open");
      const element1 = document.querySelector(".main-menu > .slide.open > ul");
      if (element) {
        element.classList.remove("active");
      }
      if (element1) {
        element1.style.display = "none";
      }
    }

    switcherArrowFn();
  }

  function slideLeft() {
    const menuNav = document.querySelector(".main-menu");
    const mainContainer1 = document.querySelector(".main-sidebar");

    if (menuNav && mainContainer1) {
      const marginLeftValue = Math.ceil(Number(window.getComputedStyle(menuNav).marginInlineStart.split("px")[0]));
      const marginRightValue = Math.ceil(Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0]));
      const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
      let mainContainer1Width = mainContainer1.offsetWidth;

      if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
        if (!(theme.dataVerticalStyle.dir === "rtl")) {
          if (Math.abs(check) <= Math.abs(marginLeftValue)) {
            menuNav.style.marginInlineStart = "0px";
          }
        } else {
          if (Math.abs(check) > Math.abs(marginRightValue)) {
            menuNav.style.marginInlineStart = "0";

            if (!(Math.abs(check) > Math.abs(marginRightValue) + mainContainer1Width)) {
              mainContainer1Width = Math.abs(check) - Math.abs(marginRightValue);
              const slideRightButton = document.querySelector("#slide-right");
              if (slideRightButton) {
                slideRightButton.classList.add("hidden");
              }
            }

            menuNav.style.marginInlineStart = (Number(menuNav.style.marginInlineStart.split("px")[0]) - Math.abs(mainContainer1Width)) + "px";

            const slideLeftButton = document.querySelector("#slide-left");
            if (slideLeftButton) {
              slideLeftButton.classList.remove("hidden");
            }
          }
        }
      }

      const element = document.querySelector(".main-menu > .slide.open");
      const element1 = document.querySelector(".main-menu > .slide.open > ul");
      if (element) {
        element.classList.remove("active");
      }
      if (element1) {
        element1.style.display = "none";
      }
    }

    switcherArrowFn();
  }


  const Topup = () => {
    if (window.scrollY > 30 && document.querySelector(".app-sidebar")) {
      const Scolls = document.querySelectorAll(".app-sidebar");
      Scolls.forEach((e) => {
        e.classList.add("sticky-pin");
      });
    } else {
      const Scolls = document.querySelectorAll(".app-sidebar");
      Scolls.forEach((e) => {
        e.classList.remove("sticky-pin");
      });
    }
  };
  window.addEventListener("scroll", Topup);

  const level = 0
  let hasParent = false
  let hasParentLevel = 0

  function setSubmenu(event, targetObject, items = menuItems) {
    if ((window.screen.availWidth <= 992 || theme.dataNavStyle !== "icon-hover") && (window.screen.availWidth <= 992 || theme.dataNavStyle !== "menu-hover")) {
      if (!event?.ctrlKey) {
        for (const item of items) {
          if (item === targetObject) {
            item.active = true;
            item.selected = true;
            setMenuAncestorsActive(item);
          } else if (!item.active && !item.selected) {
            item.active = false;
            item.selected = false;
          } else {
            removeActiveOtherMenus(item);
          }
          if (item.children && item.children.length > 0) {
            setSubmenu(event, targetObject, item.children);
          }
        }

      }
    }

    setMenuItems((arr) => [...arr]);
  }

  function getParentObject(obj, childObject) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && JSON.stringify(obj[key]) === JSON.stringify(childObject)) {
          return obj; // Return the parent object
        }
        if (typeof obj[key] === 'object') {
          const parentObject = getParentObject(obj[key], childObject);
          if (parentObject !== null) {
            return parentObject;
          }
        }
      }
    }
    return null; // Object not found
  }

  function setMenuAncestorsActive(targetObject) {
    const parent = getParentObject(menuItems, targetObject);
    if (parent) {
      if (hasParentLevel > 2) {
        hasParent = true;
      }
      parent.active = true;
      parent.selected = true;
      hasParentLevel += 1;
      setMenuAncestorsActive(parent);
    } else if (!hasParent) {
      if (theme.dataVerticalStyle === 'doublemenu') {
        dispatch(setTheme({
          "toggled": "double-menu-close"
        }))
      }
    }
  }

  function removeActiveOtherMenus(item) {
    if (item) {
      if (Array.isArray(item)) {
        for (const val of item) {
          val.active = false;
          val.selected = false;
        }
      }
      item.active = false;
      item.selected = false;

      if (item.children && item.children.length > 0) {
        removeActiveOtherMenus(item.children);
      }
    }
  }

  function setMenuUsingUrl(currentPath) {
    hasParent = false;
    hasParentLevel = 1;
    const setSubmenuRecursively = (items) => {
      items?.forEach((item) => {
        if (item.path === currentPath) {
          setSubmenu(null, item);
        }
        setSubmenuRecursively(item.children);
      });
    };
    setSubmenuRecursively(menuItems);
  }

  const [previousUrl, setPreviousUrl] = useState('/')

  useEffect(() => {
    let currentPath = location.pathname.endsWith("/") ? location.pathname.slice(0, -1) : location.pathname;
    if (currentPath !== previousUrl && menuItems.length > 0) {
      setMenuUsingUrl(currentPath);
      setPreviousUrl(currentPath);
    }
  }, [location, menuItems, previousUrl]);

  useEffect(() => {
    const targetElement = document.documentElement;
    const observer = new MutationObserver(handleAttributeChange);
    const config = { attributes: true };
    observer.observe(targetElement, config);
    return () => observer.disconnect();
  }, []);

  function handleAttributeChange(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && (mutation.attributeName === 'data-nav-layout' || mutation.attributeName === 'data-vertical-style')) {
        const newValue = mutation.target.getAttribute('data-nav-layout');
        if (newValue === 'vertical') {
          let currentPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
          currentPath = !currentPath ? DASHBOARD_ROUTES.PROJECT.path : currentPath;
          setMenuUsingUrl(currentPath);
        } else {
          closeMenuFn();
        }
      }
    }
  }

  //
  function toggleSidemenu(event, targetObject, items = menuItems) {
    let element = event.target;

    if ((theme.dataNavStyle !== "icon-hover" && theme.dataNavStyle !== "menu-hover") || (window.innerWidth < 992) || (theme.dataNavLayout !== "horizontal") && (theme.toggled !== "icon-hover-closed" || theme.toggled !== "menu-hover-closed")) {
      for (const item of items) {
        if (item === targetObject) {
          if (theme.dataVerticalStyle === 'doublemenu' && item.active) {
            return
          }
          item.active = !item.active;

          if (item.active) {
            closeOtherMenus(items, item);
          } else {
            if (theme.dataVerticalStyle === 'doublemenu') {
              dispatch(setTheme({
                "toggled": "double-menu-close"
              }))
            }
          }
          setAncestorsActive(items, item);

        } else if (!item.active) {
          if (theme.dataVerticalStyle !== 'doublemenu') {
            item.active = false; //
          }
        }
        if (item.children && item.children.length > 0) {
          toggleSidemenu(event, targetObject, item.children);
        }
      }
      if (targetObject?.children && targetObject.active) {
        if (theme.dataVerticalStyle === 'doublemenu' && theme.toggled !== 'double-menu-open') {
          dispatch(setTheme({
            "toggled": "double-menu-open"
          }))
        }
      }
      if (element && theme.dataNavLayout === 'horizontal' && (theme.dataNavStyle === 'menu-click' || theme.dataNavStyle === 'icon-click')) {
        const listItem = element.closest("li");
        if (listItem) {
          // Find the first sibling <ul> element
          const siblingUL = listItem.querySelector("ul");
          let outterUlWidth = 0;
          let listItemUL = listItem.closest('ul:not(.main-menu)');
          while (listItemUL) {
            listItemUL = listItemUL.parentElement.closest('ul:not(.main-menu)');
            if (listItemUL) {
              outterUlWidth += listItemUL.clientWidth;
            }
          }
          if (siblingUL) {
            // You've found the sibling <ul> element
            let siblingULRect = listItem.getBoundingClientRect();
            if (theme.dir === 'rtl') {
              targetObject.dirchange = (siblingULRect.left - siblingULRect.width - outterUlWidth + 150 < 0 && outterUlWidth < window.innerWidth) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth);
            } else {
              targetObject.dirchange = (outterUlWidth + siblingULRect.right + siblingULRect.width + 50 > window.innerWidth && siblingULRect.right >= 0) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth);
            }
          }
          setTimeout(() => {
            let computedValue = siblingUL.getBoundingClientRect();
            if ((computedValue.bottom) > window.innerHeight) {
              siblingUL.style.height = (window.innerHeight - computedValue.top - 8) + 'px';
              siblingUL.style.overflow = 'auto';
            }
          }, 100);
        }
      }
    }
    setMenuItems((arr) => [...arr]);
  }

  function setAncestorsActive(menuItems, targetObject) {
    const parent = findParent(menuItems, targetObject);
    if (parent) {
      parent.active = true;
      if (parent.active) {
        dispatch(setTheme({
          "toggled": "double-menu-open"
        }))
      }

      setAncestorsActive(menuItems, parent);
    } else {
      if (theme.dataVerticalStyle === "doublemenu") {
        dispatch(setTheme({
          "toggled": "double-menu-close"
        }))
      }
    }
  }

  function closeOtherMenus(menuItems, targetObject) {
    for (const item of menuItems) {
      if (item !== targetObject) {
        item.active = false;
        if (item.children && item.children.length > 0) {
          closeOtherMenus(item.children, targetObject);
        }
      }
    }
  }

  function findParent(menuItems, targetObject) {
    for (const item of menuItems) {
      if (item.children && item.children.includes(targetObject)) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const parent = findParent(menuItems = item.children, targetObject);
        if (parent) {
          return parent;
        }
      }
    }
    return null;
  }

  function HoverToggleInnerMenuFn(event, item) {
    let element = event.target;
    if (element && theme.dataNavLayout === "horizontal" && (theme.dataNavStyle === "menu-hover" || theme.dataNavStyle === "icon-hover")) {
      const listItem = element.closest("li");
      if (listItem) {
        // Find the first sibling <ul> element
        const siblingUL = listItem.querySelector("ul");
        let outterUlWidth = 0;
        let listItemUL = listItem.closest("ul:not(.main-menu)");
        while (listItemUL) {
          listItemUL = listItemUL.parentElement.closest("ul:not(.main-menu)");
          if (listItemUL) {
            outterUlWidth += listItemUL.clientWidth;
          }
        }
        if (siblingUL) {
          // You've found the sibling <ul> element
          let siblingULRect = listItem.getBoundingClientRect();
          if (theme.dir === "rtl") {
            item.dirchange = (siblingULRect.left - siblingULRect.width - outterUlWidth + 150 < 0 && outterUlWidth < window.innerWidth) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth);
          } else {
            item.dirchange = (outterUlWidth + siblingULRect.right + siblingULRect.width + 50 > window.innerWidth && siblingULRect.right >= 0) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth);
          }
        }
      }
    }
  }

  const Sideclick = () => {
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute('data-icon-overlay') !== 'open') {
        html.setAttribute('data-icon-overlay', 'open');
      }

    }
  }

  const handleClick = (event) => {
    // Your logic here
    event.preventDefault(); // Prevents the default anchor behavior (navigation)
    // ... other logic you want to perform on click
  };
  return (<>
    <div id="responsive-overlay"
         onClick={() => {
           menuClose()
         }}
    ></div>
    <aside className="app-sidebar" id="sidebar" onMouseEnter={() => Onhover()}
           onMouseLeave={() => Outhover()}>

      <div className="main-sidebar-header">
        <a href={DASHBOARD_ROUTES.PROJECT.path} className="header-logo">
          <img src={logo1} alt="logo" className="desktop-logo"/>
          <img src={logo2} alt="logo" className="toggle-logo"/>
          <img src={logo3} alt="logo" className="desktop-dark"/>
          <img src={logo4} alt="logo" className="toggle-dark"/>
          <img src={logo5} alt="logo" className="desktop-white"/>
          <img src={logo6} alt="logo" className="toggle-white"/>
        </a>
      </div>
      <SimpleBar className="main-sidebar" id="sidebar-scroll">

        <nav className="main-menu-container nav nav-pills flex-column sub-open">
          <div className="slide-left" id="slide-left" onClick={() => {
            slideLeft();
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24"
                 height="24" viewBox="0 0 24 24">
              <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
            </svg>
          </div>

          <ul className="main-menu" onClick={() => Sideclick()}>
            {menuItems.map((levelone) => (
              <li key={Math.random()} className={`${levelone.menutitle ? 'slide__category' : ''} ${levelone.type === 'link' ? 'slide' : ''}
                       ${levelone.type === 'sub' ? 'slide has-sub' : ''} ${levelone?.active ? 'open' : ''} ${levelone?.selected ? 'active' : ''}`}>
                {levelone.menutitle ? <span className='category-name'>
                        {levelone.menutitle}
                      </span> : ""}
                {levelone.type === "link" ?
                    <Link to={levelone.path} className={`side-menu__item ${levelone.selected ? 'active' : ''}`}>
                      <i className={`side-menu__icon bx ${levelone.icon}`}></i>
                      <span className="side-menu__label">
                          {levelone.title}
                        {levelone.badgetxt ? (<span className={levelone.class || 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'}>
                              {levelone.badgetxt}
                            </span>) : ("")}
                        </span>
                    </Link> : ""}
                {levelone.type === "empty" ?
                    <Link to="#" className='side-menu__item' onClick={handleClick}>
                      <i className={`side-menu__icon bx ${levelone.icon}`}></i>
                      <span className="">
                          {levelone.title}
                        {levelone.badgetxt ? (<span className={levelone.class || 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'}>
                              {levelone.badgetxt}
                            </span>) : ("")}
                        </span>
                    </Link> : ""}
                {levelone.type === "sub" ? <MenuLoop items={levelone} level={level + 1} toggleSidemenu={toggleSidemenu} HoverToggleInnerMenuFn={HoverToggleInnerMenuFn}/> : ''}
              </li>
            ))}
          </ul>
          <div className="slide-right" id="slide-right" onClick={() => {
            slideRight();
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24"
                 height="24" viewBox="0 0 24 24">
              <path
                  d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </svg>
          </div>
        </nav>

      </SimpleBar>

    </aside>
  </>);
}

export default Sidebar;

