import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import Themeprimarycolor, * as switcherData from '@modules/layouts/includes/switcher/SwitcherData.jsx';
import { Link } from 'react-router-dom';

const Switcher = () => {
  const dispatch = useDispatch();
  const local_variable = useSelector((state) => state.theme);

  useEffect(() => {
    switcherData.LocalStorageBackup(dispatch);
  }, [dispatch]);

  const customStyles = `
    ${local_variable.colorPrimaryRgb ? `--primary-rgb: ${local_variable.colorPrimaryRgb};` : ''}
    ${local_variable.colorPrimary ? `--primary: ${local_variable.colorPrimary};` : ''}
    ${local_variable.darkBg ? `--dark-bg: ${local_variable.darkBg};` : ''}
    ${local_variable.bodyBg ? `--body-bg: ${local_variable.bodyBg};` : ''}
    ${local_variable.inputBorder ? `--input-border: ${local_variable.inputBorder};` : ''}
    ${local_variable.Light ? `--light: ${local_variable.Light};` : ''}
  `;

  return (
      <>
        <Helmet>
          <html
              dir={local_variable.dir}
              className={local_variable.class}
              data-header-styles={local_variable.dataHeaderStyles}
              data-vertical-style={local_variable.dataVerticalStyle}
              data-nav-layout={local_variable.dataNavLayout}
              data-menu-styles={local_variable.dataMenuStyles}
              data-toggled={local_variable.toggled}
              data-nav-style={local_variable.dataNavStyle}
              hor-style={local_variable.horStyle}
              data-page-style={local_variable.dataPageStyle}
              data-width={local_variable.dataWidth}
              data-menu-position={local_variable.dataMenuPosition}
              data-header-position={local_variable.dataHeaderPosition}
              icon-overlay={local_variable.iconOverlay}
              bg-img={local_variable.bgImg}
              icon-text={local_variable.iconText}
              style={customStyles}>
          </html>
        </Helmet>
        <div id="hs-overlay-switcher" className="hs-overlay hidden ti-offcanvas ti-offcanvas-right" tabIndex={-1}>
          <div className="ti-offcanvas-header z-10 relative">
            <h5 className="ti-offcanvas-title">Switcher</h5>
            <button
                type="button"
                className="ti-btn flex-shrink-0 p-0 transition-none text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-gray-700 focus:ring-gray-400 focus:ring-offset-white dark:hover:text-white/80 dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                data-hs-overlay="#hs-overlay-switcher"
            >
              <span className="sr-only">Close modal</span>
              <i className="ri-close-circle-line leading-none text-lg"></i>
            </button>
          </div>
          <div className="ti-offcanvas-body !p-0 !border-b dark:border-white/10 z-10 relative !h-auto">
            <div className="flex rtl:space-x-reverse" aria-label="Tabs" role="tablist">
              <button
                  type="button"
                  className="hs-tab-active:bg-success/20 w-full !py-2 !px-4 hs-tab-active:border-b-transparent text-defaultsize border-0 hs-tab-active:text-success dark:hs-tab-active:bg-success/20 dark:hs-tab-active:border-b-white/10 dark:hs-tab-active:text-success -mb-px bg-white font-semibold text-center text-defaulttextcolor dark:text-defaulttextcolor/70 rounded-none hover:text-gray-700 dark:bg-bodybg dark:border-white/10 active"
                  id="switcher-item-1"
                  data-hs-tab="#switcher-1"
                  aria-controls="switcher-1"
                  role="tab"
              >
                Theme Style
              </button>
              <button
                  type="button"
                  className="hs-tab-active:bg-success/20 w-full !py-2 !px-4 hs-tab-active:border-b-transparent text-defaultsize border-0 hs-tab-active:text-success dark:hs-tab-active:bg-success/20 dark:hs-tab-active:border-b-white/10 dark:hs-tab-active:text-success -mb-px bg-white font-semibold text-center text-defaulttextcolor dark:text-defaulttextcolor/70 rounded-none hover:text-gray-700 dark:bg-bodybg dark:border-white/10 dark:hover:text-gray-300"
                  id="switcher-item-2"
                  data-hs-tab="#switcher-2"
                  aria-controls="switcher-2"
                  role="tab"
              >
                Theme Colors
              </button>
            </div>
          </div>
          <div className="ti-offcanvas-body" id="switcher-body">
            <div id="switcher-1" role="tabpanel" aria-labelledby="switcher-item-1" className="">
              <div className="">
                <p className="switcher-style-head">Theme Color Mode:</p>
                <div className="grid grid-cols-3 switcher-style">
                  <div className="flex items-center">
                    <input
                        type="radio"
                        name="theme-style"
                        className="ti-form-radio"
                        id="switcher-light-theme"
                        checked={local_variable.class !== 'dark'}
                        onChange={() => switcherData.Light(dispatch)}
                    />
                    <label
                        htmlFor="switcher-light-theme"
                        className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold"
                    >
                      Light
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                        type="radio"
                        name="theme-style"
                        className="ti-form-radio"
                        id="switcher-dark-theme"
                        checked={local_variable.class === 'dark'}
                        onChange={() => switcherData.Dark(dispatch)}
                    />
                    <label
                        htmlFor="switcher-dark-theme"
                        className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold"
                    >
                      Dark
                    </label>
                  </div>
                </div>
              </div>



            <div>
              <p className="switcher-style-head">Directions:</p>
              <div className="grid grid-cols-3  switcher-style">
                <div className="flex items-center">
                  <input type="radio" name="direction" className="ti-form-radio" id="switcher-ltr" checked={local_variable.dir === "ltr"} onChange={_e => { }}
                    onClick={() => { switcherData.Ltr(dispatch); }} />
                  <label htmlFor="switcher-ltr" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">LTR</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="direction" className="ti-form-radio" id="switcher-rtl" checked={local_variable.dir === "rtl"} onChange={_e => { }}
                    onClick={() => { switcherData.Rtl(dispatch); }} />
                  <label htmlFor="switcher-rtl" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">RTL</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Navigation Styles:</p>
              <div className="grid grid-cols-3  switcher-style">
                <div className="flex items-center">
                  <input type="radio" name="navigation-style" className="ti-form-radio" id="switcher-vertical" checked={local_variable.dataNavLayout === "vertical"} onChange={_e => { }}
                    onClick={() => switcherData.Vertical(dispatch)} />
                  <label htmlFor="switcher-vertical"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Vertical</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="navigation-style" className="ti-form-radio" id="switcher-horizontal" checked={local_variable.dataNavLayout === "horizontal"} onChange={_e => { }}
                    onClick={() => switcherData.HorizontalClick(dispatch)} />
                  <label htmlFor="switcher-horizontal"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Horizontal</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Navigation Menu Style:</p>
              <div className="grid grid-cols-2 gap-2 switcher-style">
                <div className="flex">
                  <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-menu-click"
                    checked={local_variable.dataNavStyle === "menu-click"} onChange={_e => { }}
                    onClick={() => switcherData.Menuclick(dispatch)} />
                  <label htmlFor="switcher-menu-click" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Menu
                    Click</label>
                </div>
                <div className="flex">
                  <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-menu-hover" checked={local_variable.dataNavStyle === "menu-hover"} onChange={_e => { }}
                    onClick={() => switcherData.MenuHover(dispatch)} />
                  <label htmlFor="switcher-menu-hover" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Menu
                    Hover</label>
                </div>
                <div className="flex">
                  <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-icon-click" checked={local_variable.dataNavStyle === "icon-click"} onChange={_e => { }}
                    onClick={() => switcherData.IconClick(dispatch)} />
                  <label htmlFor="switcher-icon-click" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Icon
                    Click</label>
                </div>
                <div className="flex">
                  <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-icon-hover"
                    checked={local_variable.dataNavStyle === "icon-hover"} onChange={_e => { }}
                    onClick={() => switcherData.IconHover(dispatch)} />
                  <label htmlFor="switcher-icon-hover" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Icon
                    Hover</label>
                </div>
              </div>
              <div className="px-4 text-secondary text-xs"><b className="me-2 inline-flex">Note:</b>Works same for both Vertical and
                Horizontal
              </div>
            </div>
            <div className=" sidemenu-layout-styles">
              <p className="switcher-style-head">Sidemenu Layout Syles:</p>
              <div className="grid grid-cols-2 gap-2 switcher-style">
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-default-menu"
                  defaultChecked
                     onChange={_e => { }}
                    onClick={() => switcherData.Defaultmenu(dispatch)} />
                  <label htmlFor="switcher-default-menu"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Default
                    Menu</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-closed-menu" checked={local_variable.dataVerticalStyle === "closed"} onChange={_e => { }}
                    onClick={() => switcherData.Closedmenu(dispatch)} />
                  <label htmlFor="switcher-closed-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">
                    Closed
                    Menu</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-icontext-menu" checked={local_variable.dataVerticalStyle === "icontext"} onChange={_e => { }}
                    onClick={() => switcherData.iconTextfn(dispatch)} />
                  <label htmlFor="switcher-icontext-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Icon
                    Text</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-icon-overlay"
                    onClick={() => switcherData.iconOverayFn(dispatch)} />
                  <label htmlFor="switcher-icon-overlay" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Icon
                    Overlay</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-detached" checked={local_variable.dataVerticalStyle === "detached"} onChange={_e => { }}
                    onClick={() => switcherData.DetachedFn(dispatch)} />
                  <label htmlFor="switcher-detached"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Detached</label>
                </div>
                <div className="flex">
                  <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-double-menu" checked={local_variable.dataVerticalStyle === "doublemenu"} onChange={_e => { }}
                    onClick={() => switcherData.DoubletFn(dispatch)} />
                  <label htmlFor="switcher-double-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Double
                    Menu</label>
                </div>
              </div>
              <div className="px-4 text-secondary text-xs"><b className="me-2 inline-flex">Note:</b>Navigation menu styles won't work
                here.</div>
            </div>
            <div>
              <p className="switcher-style-head">Page Styles:</p>
              <div className="grid grid-cols-3  switcher-style">
                <div className="flex">
                  <input type="radio" name="data-page-styles" className="ti-form-radio" id="switcher-regular" checked={local_variable.dataPageStyle === "regular"} onChange={_e => { }}
                    onClick={() => switcherData.Regular(dispatch)} />
                  <label htmlFor="switcher-regular"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Regular</label>
                </div>
                <div className="flex">
                  <input type="radio" name="data-page-styles" className="ti-form-radio" id="switcher-classic" checked={local_variable.dataPageStyle === "classic"} onChange={_e => { }}
                    onClick={() => switcherData.Classic(dispatch)} />
                  <label htmlFor="switcher-classic"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Classic</label>
                </div>
                <div className="flex">
                  <input type="radio" name="data-page-styles" className="ti-form-radio" id="switcher-modern" checked={local_variable.dataPageStyle === "modern"} onChange={_e => { }} onClick={() => switcherData.Modern(dispatch)} />
                  <label htmlFor="switcher-modern"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"> Modern</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Layout Width Styles:</p>
              <div className="grid grid-cols-3 switcher-style">
                <div className="flex">
                  <input type="radio" name="layout-width" className="ti-form-radio" id="switcher-full-width" checked={local_variable.dataWidth === "fullwidth"} onChange={_e => { }}
                    onClick={() => switcherData.Fullwidth(dispatch)} />
                  <label htmlFor="switcher-full-width"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">FullWidth</label>
                </div>
                <div className="flex">
                  <input type="radio" name="layout-width" className="ti-form-radio" id="switcher-boxed" checked={local_variable.dataWidth === "boxed"} onChange={_e => { }}
                    onClick={() => switcherData.Boxed(dispatch)} />
                  <label htmlFor="switcher-boxed" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Boxed</label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Menu Positions:</p>
              <div className="grid grid-cols-3  switcher-style">
                <div className="flex">
                  <input type="radio" name="data-menu-positions" className="ti-form-radio" id="switcher-menu-fixed"
                    checked={local_variable.dataMenuPosition === "fixed"} onChange={_e => { }}
                    onClick={() => switcherData.FixedMenu(dispatch)} />
                  <label htmlFor="switcher-menu-fixed"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Fixed</label>
                </div>
                <div className="flex">
                  <input type="radio" name="data-menu-positions" className="ti-form-radio" id="switcher-menu-scroll" checked={local_variable.dataMenuPosition === "scrollable"} onChange={_e => { }}
                    onClick={() => switcherData.scrollMenu(dispatch)} />
                  <label htmlFor="switcher-menu-scroll"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Scrollable </label>
                </div>
              </div>
            </div>
            <div>
              <p className="switcher-style-head">Header Positions:</p>
              <div className="grid grid-cols-3 switcher-style">
                <div className="flex">
                  <input type="radio" name="data-header-positions" className="ti-form-radio" id="switcher-header-fixed" checked={local_variable.dataHeaderPosition === "fixed"} onChange={_e => { }}
                    onClick={() => switcherData.Headerpostionfixed(dispatch)} />
                  <label htmlFor="switcher-header-fixed" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                    Fixed</label>
                </div>
                <div className="flex">
                  <input type="radio" name="data-header-positions" className="ti-form-radio" id="switcher-header-scroll" checked={local_variable.dataHeaderPosition === "scrollable"} onChange={_e => { }}
                    onClick={() => switcherData.Headerpostionscroll(dispatch)} />
                  <label htmlFor="switcher-header-scroll"
                    className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Scrollable
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div id="switcher-2" className="hidden" role="tabpanel" aria-labelledby="switcher-item-2">
            <div className="theme-colors">
              <p className="switcher-style-head">Menu Colors:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-white" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles === "light"} onChange={_e => { }}
                    id="switcher-menu-light" onClick={() => switcherData.lightMenu(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Light Menu
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-dark" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles === "dark"} onChange={_e => { }}
                    id="switcher-menu-dark" onClick={() => switcherData.darkMenu(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Dark Menu
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-primary" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles === "color"} onChange={_e => { }}
                    id="switcher-menu-primary" onClick={() => switcherData.colorMenu(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Color Menu
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-gradient" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles === "gradient"} onChange={_e => { }}
                    id="switcher-menu-gradient" onClick={() => switcherData.gradientMenu(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Gradient Menu
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-transparent" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles === "transparent"} onChange={_e => { }}
                    id="switcher-menu-transparent" onClick={() => switcherData.transparentMenu(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Transparent Menu
                  </span>
                </div>
              </div>
              <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]"><b className="me-2 inline-flex">Note:</b>If you want to change color Menu
                dynamically
                change from below Theme Primary color picker.</div>
            </div>
            <div className="theme-colors">
              <p className="switcher-style-head">Header Colors:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-white !border" type="radio" name="header-colors"
                    checked={local_variable.dataHeaderStyles === "light"} onChange={_e => { }}
                    id="switcher-header-light" onClick={() => switcherData.lightHeader(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Light Header
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-dark" type="radio" name="header-colors"
                    checked={local_variable.dataHeaderStyles === "dark"} onChange={_e => { }}
                    id="switcher-header-dark" onClick={() => switcherData.darkHeader(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Dark Header
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-primary" type="radio" name="header-colors"
                    checked={local_variable.dataHeaderStyles === "color"} onChange={_e => { }}
                    id="switcher-header-primary" onClick={() => switcherData.colorHeader(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Color Header
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-gradient" type="radio" name="header-colors"
                    checked={local_variable.dataHeaderStyles === "gradient"} onChange={_e => { }}
                    id="switcher-header-gradient" onClick={() => switcherData.gradientHeader(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Gradient Header
                  </span>
                </div>
                <div className="hs-tooltip ti-main-tooltip ti-form-radio switch-select ">
                  <input className="hs-tooltip-toggle ti-form-radio color-input color-transparent" type="radio"
                    checked={local_variable.dataHeaderStyles === "transparent"} onChange={_e => { }}
                    name="header-colors" id="switcher-header-transparent" onClick={() => switcherData.transparentHeader(dispatch)} />
                  <span
                    className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                    role="tooltip">
                    Transparent Header
                  </span>
                </div>
              </div>
              <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]"><b className="me-2 inline-flex">Note:</b>If you want to change color
                Header dynamically
                change from below Theme Primary color picker.</div>
            </div>
            <div className="theme-colors">
              <p className="switcher-style-head">Theme Primary:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-1" type="radio" name="theme-primary"
                    checked={local_variable.colorPrimaryRgb === '58, 88, 146'} onChange={(_e) => { }}
                    id="switcher-primary" onClick={() => switcherData.primaryColor1(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-2" type="radio" name="theme-primary"
                    checked={local_variable.colorPrimaryRgb === '92, 144 ,163'} onChange={(_e) => { }}
                    id="switcher-primary1" onClick={() => switcherData.primaryColor2(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-3" type="radio" name="theme-primary"
                    checked={local_variable.colorPrimaryRgb === '161, 90 ,223'} onChange={(_e) => { }}
                    id="switcher-primary2" onClick={() => switcherData.primaryColor3(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-4" type="radio" name="theme-primary"
                    checked={local_variable.colorPrimaryRgb === '78, 172, 76'} onChange={(_e) => { }}
                    id="switcher-primary3" onClick={() => switcherData.primaryColor4(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-primary-5" type="radio" name="theme-primary"
                    checked={local_variable.colorPrimaryRgb === '223, 90, 90'} onChange={(_e) => { }}
                    id="switcher-primary4" onClick={() => switcherData.primaryColor5(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select ps-0 mt-1 color-primary-light">
                  <div className='theme-container-primary'>
                    <button className="">nano</button>
                  </div>
                  <div className='pickr-container-primary'>
                    <div className='pickr'>
                      <button className='pcr-button' onClick={(ele) => {
                        if (ele.target.querySelector("input")) {
                          ele.target.querySelector("input").click();
                        }
                      }}>
                        <Themeprimarycolor dispatch={dispatch} />
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="theme-colors">
              <p className="switcher-style-head">Theme Background:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-1" type="radio" name="theme-background"
                    checked={local_variable.bodyBg === '34 44 110'} onChange={(_e) => { }}
                    id="switcher-background" onClick={() => switcherData.backgroundColor1(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-2" type="radio" name="theme-background"
                    checked={local_variable.bodyBg === '22 92 129'} onChange={(_e) => { }}
                    id="switcher-background1" onClick={() => switcherData.backgroundColor2(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-3" type="radio" name="theme-background"
                    checked={local_variable.bodyBg === '104 51 149'} onChange={(_e) => { }}
                    id="switcher-background2" onClick={() => switcherData.backgroundColor3(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-4" type="radio" name="theme-background"
                    checked={local_variable.bodyBg === '29 106 56'} onChange={(_e) => { }}
                    id="switcher-background3" onClick={() => switcherData.backgroundColor4(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio color-input color-bg-5" type="radio" name="theme-background"
                    checked={local_variable.bodyBg === '134 80 34'} onChange={(_e) => { }}
                    id="switcher-background4" onClick={() => switcherData.backgroundColor5(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select ps-0 mt-1 color-bg-transparent">
                  <div className='theme-container-background' >
                    <button className="">nano</button>
                  </div>
                  <div className='pickr-container-background'>
                    <div className='pickr'>
                      <button className='pcr-button' onClick={(ele) => {
                        if (ele.target.querySelector("input")) {
                          ele.target.querySelector("input").click();
                        }
                      }}>
                        <switcherData.Themebackgroundcolor theme={local_variable} dispatch={dispatch}/>
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="menu-image theme-colors">
              <p className="switcher-style-head">Menu With Background Image:</p>
              <div className="flex switcher-style space-x-3 rtl:space-x-reverse flex-wrap gap-3">
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img1" type="radio" name="theme-images" id="switcher-bg-img" checked={local_variable.bgImg === 'bgimg1'} onChange={(_e) => { }} onClick={() => switcherData.bgImage1(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img2" type="radio" name="theme-images" id="switcher-bg-img1" checked={local_variable.bgImg === 'bgimg2'} onChange={(_e) => { }} onClick={() => switcherData.bgImage2(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img3" type="radio" name="theme-images" id="switcher-bg-img2" checked={local_variable.bgImg === 'bgimg3'} onChange={(_e) => { }} onClick={() => switcherData.bgImage3(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img4" type="radio" name="theme-images" id="switcher-bg-img3" checked={local_variable.bgImg === 'bgimg4'} onChange={(_e) => { }} onClick={() => switcherData.bgImage4(dispatch)} />
                </div>
                <div className="ti-form-radio switch-select">
                  <input className="ti-form-radio bgimage-input bg-img5" type="radio" name="theme-images" id="switcher-bg-img4" checked={local_variable.bgImg === 'bgimg5'} onChange={(_e) => { }} onClick={() => switcherData.bgImage5(dispatch)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ti-offcanvas-footer sm:flex justify-between">
          <Link to="#" id="reset-all" className="w-full ti-btn ti-btn-danger-full m-1" onClick={() => switcherData.Reset(dispatch)}>Reset</Link>  </div>
      </div>
    </>
  );
}

export default Switcher

