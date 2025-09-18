import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import logo1 from "@assets/images/brand-logos/desktop-logo.svg";
import logo2 from "@assets/images/brand-logos/toggle-logo.png";
import logo3 from "@assets/images/brand-logos/desktop-dark.svg";
import logo4 from "@assets/images/brand-logos/toggle-dark.png";
import logo5 from "@assets/images/brand-logos/desktop-white.svg";
import logo6 from "@assets/images/brand-logos/toggle-white.png";
import SimpleBar from 'simplebar-react';
import {useDispatch, useSelector} from "react-redux";
import {setTheme} from "@redux/common/themeSlice.js";
import MenuLoop from "@modules/layouts/includes/sidebar/components/MenuLoop.jsx";
import useMenuItems from "@hooks/useMenuItems.js";
import {DASHBOARD_ROUTES} from "@modules/dashboards/routes.js";
import { Search, X } from "lucide-react";
const Sidebar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const initialMenuItems = useMenuItems();
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState(initialMenuItems);
  const [isSearching, setIsSearching] = useState(false);


  useEffect(() => {
    setMenuItems(initialMenuItems);
    setFilteredMenuItems(initialMenuItems);
  }, [initialMenuItems]);

  // Search functionality
  const searchInMenuItems = (items, query) => {
    if (!query.trim()) return items;

    const searchRecursively = (menuItems, searchTerm) => {
      const results = [];

      menuItems?.forEach(item => {
        // Check if current item matches
        const itemMatches = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.menutitle?.toLowerCase().includes(searchTerm.toLowerCase());

        // Search in children
        let matchingChildren = [];
        if (item.children && item.children.length > 0) {
          matchingChildren = searchRecursively(item.children, searchTerm);
        }

        // Include item if it matches or has matching children
        if (itemMatches || matchingChildren.length > 0) {
          const itemCopy = { ...item };

          // If item has matching children, include them and mark parent as active
          if (matchingChildren.length > 0) {
            itemCopy.children = matchingChildren;
            itemCopy.active = true; // Expand parent to show matching children
          }

          // If the item itself matches, highlight it
          if (itemMatches) {
            itemCopy.searchMatch = true;
          }

          results.push(itemCopy);
        }
      });

      return results;
    };

    return searchRecursively(items, query);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(query.trim().length > 0);

    if (query.trim()) {
      const filtered = searchInMenuItems(initialMenuItems, query);
      setFilteredMenuItems(filtered);
    } else {
      setFilteredMenuItems(initialMenuItems);
      // Reset any expanded states when clearing search
      resetMenuStates();
    }
  };

  // Reset menu states when clearing search
  const resetMenuStates = () => {
    const resetStates = (items) => {
      return items?.map(item => ({
        ...item,
        active: false,
        searchMatch: false,
        children: item.children ? resetStates(item.children) : item.children
      }));
    };

    const resetItems = resetStates(initialMenuItems);
    setMenuItems(resetItems);
    setFilteredMenuItems(resetItems);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setFilteredMenuItems(initialMenuItems);
    resetMenuStates();
  };

  function closeMenuFn() {
    const closeMenuRecursively = (items) => {
      items?.forEach((item) => {
        item.active = false;
        closeMenuRecursively(item.children);
      });
    };
    closeMenuRecursively(isSearching ? filteredMenuItems : menuItems);
    if (isSearching) {
      setFilteredMenuItems((arr) => [...arr]);
    } else {
      setMenuItems((arr) => [...arr]);
    }
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
        dispatch(setTheme({
          "toggled": "close"
        }))
      }

      if ((WindowPreSize[WindowPreSize.length - 1] >= 992) && (WindowPreSize[WindowPreSize.length - 2] < 992)) {
        dispatch(setTheme({
          "toggled": theme.dataVerticalStyle === "doublemenu" ? "double-menu-open" : ""
        }))
      }
    }
  }

  function switcherArrowFn() {
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
        if (!(theme.dataVerticalStyle?.dir === "rtl")) {
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

            const slideLeftButton = document.querySelector("#slide-left");
            if (slideLeftButton) {
              slideLeftButton.classList.remove("hidden");
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
        if (!(theme.dataVerticalStyle?.dir === "rtl")) {
          if (Math.abs(check) <= Math.abs(marginLeftValue)) {
            menuNav.style.marginInlineStart = "0px";
            const slideLeftButton = document.querySelector("#slide-left");
            if (slideLeftButton) {
              slideLeftButton.classList.add("hidden");
            }
          } else {
            menuNav.style.marginInlineStart = (Number(menuNav.style.marginInlineStart.split("px")[0]) + Math.abs(mainContainer1Width)) + "px";
            const slideRightButton = document.querySelector("#slide-right");
            if (slideRightButton) {
              slideRightButton.classList.remove("hidden");
            }
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

  useEffect(() => {
    window.addEventListener("scroll", Topup);
    return () => {
      window.removeEventListener("scroll", Topup);
    };
  }, []);

  const level = 0
  let hasParent = false
  let hasParentLevel = 0

  function setSubmenu(event, targetObject, items = isSearching ? filteredMenuItems : menuItems) {
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
    if (isSearching) {
      setFilteredMenuItems((arr) => [...arr]);
    } else {
      setMenuItems((arr) => [...arr]);
    }
  }

  function getParentObject(obj, childObject) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && JSON.stringify(obj[key]) === JSON.stringify(childObject)) {
          return obj;
        }
        if (typeof obj[key] === 'object') {
          const parentObject = getParentObject(obj[key], childObject);
          if (parentObject !== null) {
            return parentObject;
          }
        }
      }
    }
    return null;
  }

  function setMenuAncestorsActive(targetObject) {
    const parent = getParentObject(isSearching ? filteredMenuItems : menuItems, targetObject);
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
      } else {
        item.active = false;
        item.selected = false;
      }

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
    setSubmenuRecursively(isSearching ? filteredMenuItems : menuItems);
  }

  const [previousUrl, setPreviousUrl] = useState('/')

  useEffect(() => {
    let currentPath = location.pathname.endsWith("/") ? location.pathname.slice(0, -1) : location.pathname;
    if (currentPath !== previousUrl && (isSearching ? filteredMenuItems : menuItems).length > 0) {
      setMenuUsingUrl(currentPath);
      setPreviousUrl(currentPath);
    }
  }, [location, menuItems, filteredMenuItems, previousUrl, isSearching]);

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

  const toggleSidemenu = (event, clickedItem) => {
    event.preventDefault();

    const currentItems = isSearching ? filteredMenuItems : menuItems;
    const setCurrentItems = isSearching ? setFilteredMenuItems : setMenuItems;

    const findAndCloseSiblings = (items, targetItem, parentItems = null) => {
      items.forEach(item => {
        if (item.children && item.children.includes(targetItem)) {
          item.children.forEach(sibling => {
            if (sibling !== targetItem) {
              sibling.active = false;
              sibling.selected = false;
              if (sibling.children) {
                closeAllChildren(sibling.children);
              }
            }
          });
          return;
        }
        if (item.children) {
          findAndCloseSiblings(item.children, targetItem, items);
        }
      });
    };

    const closeAllChildren = (children) => {
      children.forEach(child => {
        child.active = false;
        child.selected = false;
        if (child.children) {
          closeAllChildren(child.children);
        }
      });
    };

    findAndCloseSiblings(currentItems, clickedItem);

    clickedItem.active = !clickedItem.active;
    clickedItem.selected = !clickedItem.selected;

    if (!clickedItem.active && clickedItem.children) {
      closeAllChildren(clickedItem.children);
    }

    setCurrentItems([...currentItems]);
  };

  function closeOtherMenusAtSameLevel(items, targetItem) {
    for (const item of items) {
      if (item !== targetItem && item.children && item.children.length > 0) {
        item.active = false;
        closeAllChildMenus(item.children);
      }
    }
  }

  function closeAllChildMenus(items) {
    for (const item of items) {
      item.active = false;
      if (item.children && item.children.length > 0) {
        closeAllChildMenus(item.children);
      }
    }
  }

  function setAncestorsActiveInArray(items, targetItem) {
    const setActiveRecursively = (menuItems, target) => {
      for (const item of menuItems) {
        if (item.children && item.children.length > 0) {
          for (const child of item.children) {
            if (child === target || (child.path && child.path === target.path) || (child.id && child.id === target.id)) {
              item.active = true;
              setActiveRecursively(items, item);
              return true;
            }
            if (setActiveRecursively(item.children, target)) {
              item.active = true;
              return true;
            }
          }
        }
      }
      return false;
    };

    setActiveRecursively(items, targetItem);
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
        const parent = findParent(item.children, targetObject);
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

  const Sideclick = (event) => {
    if (event.target.closest('.side-menu__item') ||
        event.target.closest('.slide') ||
        event.target.closest('[data-bs-toggle]')) {
      return;
    }

    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute('data-icon-overlay') !== 'open') {
        html.setAttribute('data-icon-overlay', 'open');
      }
    }
  }

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleMenuItemClick = (event, item) => {
    event.stopPropagation();

    const currentItems = isSearching ? filteredMenuItems : menuItems;
    const setCurrentItems = isSearching ? setFilteredMenuItems : setMenuItems;

    if (item.type === 'link') {
      setCurrentItems((prevItems) => {
        const newItems = JSON.parse(JSON.stringify(prevItems));

        const clearSelected = (items) => {
          items.forEach(menuItem => {
            menuItem.selected = false;
            if (menuItem.children) {
              clearSelected(menuItem.children);
            }
          });
        };

        const setSelected = (items) => {
          items.forEach(menuItem => {
            if (menuItem.path === item.path || menuItem.id === item.id) {
              menuItem.selected = true;
              setAncestorsActiveInArray(newItems, menuItem);
            }
            if (menuItem.children) {
              setSelected(menuItem.children);
            }
          });
        };

        clearSelected(newItems);
        setSelected(newItems);

        return newItems;
      });

      return;
    }

    if (item.type === 'sub') {
      event.preventDefault();
      toggleSidemenu(event, item);
      return;
    }

    if (item.type === 'empty') {
      event.preventDefault();
      return;
    }
  };

  const handleSubmenuLinkClick = (event, item) => {
    event.stopPropagation();

    const currentItems = isSearching ? filteredMenuItems : menuItems;
    const setCurrentItems = isSearching ? setFilteredMenuItems : setMenuItems;

    setCurrentItems((prevItems) => {
      const newItems = JSON.parse(JSON.stringify(prevItems));

      const clearSelected = (items) => {
        items.forEach(menuItem => {
          menuItem.selected = false;
          if (menuItem.children) {
            clearSelected(menuItem.children);
          }
        });
      };

      const setSelected = (items) => {
        items.forEach(menuItem => {
          if (menuItem.path === item.path || menuItem.id === item.id) {
            menuItem.selected = true;
            setAncestorsActiveInArray(newItems, menuItem);
          }
          if (menuItem.children) {
            setSelected(menuItem.children);
          }
        });
      };

      clearSelected(newItems);
      setSelected(newItems);

      return newItems;
    });
  };

  // Get display items (filtered or normal)
  const displayItems = isSearching ? filteredMenuItems : menuItems;

  return (
      <>
        <div
            id="responsive-overlay"
            onClick={() => {
              menuClose()
            }}
        ></div>
        <aside
            className="app-sidebar"
            id="sidebar"
            onMouseEnter={() => Onhover()}
            onMouseLeave={() => Outhover()}
        >
          <div className="main-sidebar-header">
            <Link to={DASHBOARD_ROUTES.PROJECT.path} className="header-logo">
              <img src={logo1} alt="logo" className="desktop-logo"/>
              <img src={logo2} alt="logo" className="toggle-logo"/>
              <img src={logo3} alt="logo" className="desktop-dark"/>
              <img src={logo4} alt="logo" className="toggle-dark"/>
              <img src={logo5} alt="logo" className="desktop-white"/>
              <img src={logo6} alt="logo" className="toggle-white"/>
            </Link>
          </div>



          <SimpleBar className="main-sidebar" id="sidebar-scroll">
            {theme.dataNavLayout !== "horizontal" && (
                <div className="slide has-sub open active" style={{padding: '0 1rem'}}>
                  <div style={{position: 'relative'}}>
                    <Search
                        style={{
                          position: 'absolute',
                          left: '0.5rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: '18px',
                          color: '#6b7280',
                        }}
                    />

                    <input
                        type="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        style={{
                          width: '100%',
                          paddingLeft: '2rem',
                          paddingBottom: '4px',
                          border: 'none',
                          borderBottom: '2px solid #d1d5db',
                          outline: 'none',
                          fontSize: '0.875rem',
                          backgroundColor: 'transparent',
                          color: '#b8b9ba',
                        }}
                    />
                  </div>

                  {isSearching && displayItems.length === 0 && (
                      <div
                          style={{
                            paddingTop: '0.75rem',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            textAlign: 'center'
                          }}
                      >
                        No menu items found for "{searchQuery}"
                      </div>
                  )}
                </div>
            )}

            <nav className="main-menu-container nav nav-pills flex-column sub-open">
              <div className="slide-left" id="slide-left" onClick={() => {
                slideLeft();
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24"
                     height="24" viewBox="0 0 24 24">
                  <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
                </svg>
              </div>

              <ul className="main-menu" onClick={(e) => Sideclick(e)}>
                {displayItems.map((levelone, index) => (
                    <li
                        key={levelone.id || levelone.path || index}
                        className={`${levelone.menutitle ? 'slide__category' : ''} ${levelone.type === 'link' ? 'slide' : ''}
                           ${levelone.type === 'sub' ? 'slide has-sub' : ''} ${levelone?.active ? 'open' : ''} ${levelone?.selected ? 'active' : ''}`}
                    >
                      {levelone.menutitle ?
                          <span className='category-name'>
                      {levelone.menutitle}
                    </span> : ""
                      }

                      {levelone.type === "link" ?
                          <Link
                              to={levelone.path}
                              className={`side-menu__item ${levelone.selected ? 'active' : ''} ${levelone.searchMatch ? 'bg-blue-50  border-blue-500 dark:bg-blue-900/20' : ''}`}
                          >
                            <i className={`side-menu__icon bx ${levelone.icon}`}></i>
                            <span className="side-menu__label">
                        {levelone.title}
                              {levelone.badgetxt ? (
                                  <span className={levelone.class || 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'}>
                            {levelone.badgetxt}
                          </span>
                              ) : ""}
                      </span>
                          </Link> : ""
                      }

                      {levelone.type === "empty" ?
                          <Link
                              to="#"
                              className={`side-menu__item ${levelone.searchMatch ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20' : ''}`}
                              onClick={(e) => {
                                handleClick(e);
                                handleMenuItemClick(e, levelone);
                              }}
                          >
                            <i className={`side-menu__icon bx ${levelone.icon}`}></i>
                            <span className="">
                        {levelone.title}
                              {levelone.badgetxt ? (
                                  <span className={levelone.class || 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'}>
                            {levelone.badgetxt}
                          </span>
                              ) : ""}
                      </span>
                          </Link> : ""
                      }

                      {levelone.type === "sub" ?
                          <MenuLoop
                              items={levelone}
                              level={level + 1}
                              toggleSidemenu={toggleSidemenu}
                              HoverToggleInnerMenuFn={HoverToggleInnerMenuFn}
                              isSearching={isSearching}
                          /> : ''
                      }
                    </li>
                ))}
              </ul>

              <div className="slide-right" id="slide-right" onClick={() => {
                slideRight();
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24"
                     height="24" viewBox="0 0 24 24">
                  <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
                </svg>
              </div>
            </nav>
          </SimpleBar>
        </aside>
      </>
  );
}

export default Sidebar;