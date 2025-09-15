import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const countries = [
    { code: "+93", name: "Afghanistan", flag: "https://flagcdn.com/w20/af.png" },
    { code: "+355", name: "Albania", flag: "https://flagcdn.com/w20/al.png" },
    { code: "+213", name: "Algeria", flag: "https://flagcdn.com/w20/dz.png" },
    { code: "+1", name: "American Samoa", flag: "https://flagcdn.com/w20/as.png" },
    { code: "+376", name: "Andorra", flag: "https://flagcdn.com/w20/ad.png" },
    { code: "+244", name: "Angola", flag: "https://flagcdn.com/w20/ao.png" },
    { code: "+1264", name: "Anguilla", flag: "https://flagcdn.com/w20/ai.png" },
    { code: "+672", name: "Antarctica", flag: "https://flagcdn.com/w20/aq.png" },
    { code: "+1268", name: "Antigua and Barbuda", flag: "https://flagcdn.com/w20/ag.png" },
    { code: "+54", name: "Argentina", flag: "https://flagcdn.com/w20/ar.png" },
    { code: "+374", name: "Armenia", flag: "https://flagcdn.com/w20/am.png" },
    { code: "+297", name: "Aruba", flag: "https://flagcdn.com/w20/aw.png" },
    { code: "+61", name: "Australia", flag: "https://flagcdn.com/w20/au.png" },
    { code: "+43", name: "Austria", flag: "https://flagcdn.com/w20/at.png" },
    { code: "+994", name: "Azerbaijan", flag: "https://flagcdn.com/w20/az.png" },
    { code: "+1242", name: "Bahamas", flag: "https://flagcdn.com/w20/bs.png" },
    { code: "+973", name: "Bahrain", flag: "https://flagcdn.com/w20/bh.png" },
    { code: "+880", name: "Bangladesh", flag: "https://flagcdn.com/w20/bd.png" },
    { code: "+1246", name: "Barbados", flag: "https://flagcdn.com/w20/bb.png" },
    { code: "+375", name: "Belarus", flag: "https://flagcdn.com/w20/by.png" },
    { code: "+32", name: "Belgium", flag: "https://flagcdn.com/w20/be.png" },
    { code: "+501", name: "Belize", flag: "https://flagcdn.com/w20/bz.png" },
    { code: "+229", name: "Benin", flag: "https://flagcdn.com/w20/bj.png" },
    { code: "+1441", name: "Bermuda", flag: "https://flagcdn.com/w20/bm.png" },
    { code: "+975", name: "Bhutan", flag: "https://flagcdn.com/w20/bt.png" },
    { code: "+591", name: "Bolivia", flag: "https://flagcdn.com/w20/bo.png" },
    { code: "+387", name: "Bosnia and Herzegovina", flag: "https://flagcdn.com/w20/ba.png" },
    { code: "+267", name: "Botswana", flag: "https://flagcdn.com/w20/bw.png" },
    { code: "+55", name: "Brazil", flag: "https://flagcdn.com/w20/br.png" },
    { code: "+246", name: "British Indian Ocean Territory", flag: "https://flagcdn.com/w20/io.png" },
    { code: "+1284", name: "British Virgin Islands", flag: "https://flagcdn.com/w20/vg.png" },
    { code: "+673", name: "Brunei", flag: "https://flagcdn.com/w20/bn.png" },
    { code: "+359", name: "Bulgaria", flag: "https://flagcdn.com/w20/bg.png" },
    { code: "+226", name: "Burkina Faso", flag: "https://flagcdn.com/w20/bf.png" },
    { code: "+257", name: "Burundi", flag: "https://flagcdn.com/w20/bi.png" },
    { code: "+855", name: "Cambodia", flag: "https://flagcdn.com/w20/kh.png" },
    { code: "+237", name: "Cameroon", flag: "https://flagcdn.com/w20/cm.png" },
    { code: "+1", name: "Canada", flag: "https://flagcdn.com/w20/ca.png" },
    { code: "+238", name: "Cape Verde", flag: "https://flagcdn.com/w20/cv.png" },
    { code: "+1345", name: "Cayman Islands", flag: "https://flagcdn.com/w20/ky.png" },
    { code: "+236", name: "Central African Republic", flag: "https://flagcdn.com/w20/cf.png" },
    { code: "+235", name: "Chad", flag: "https://flagcdn.com/w20/td.png" },
    { code: "+56", name: "Chile", flag: "https://flagcdn.com/w20/cl.png" },
    { code: "+86", name: "China", flag: "https://flagcdn.com/w20/cn.png" },
    { code: "+61", name: "Christmas Island", flag: "https://flagcdn.com/w20/cx.png" },
    { code: "+61", name: "Cocos Islands", flag: "https://flagcdn.com/w20/cc.png" },
    { code: "+57", name: "Colombia", flag: "https://flagcdn.com/w20/co.png" },
    { code: "+269", name: "Comoros", flag: "https://flagcdn.com/w20/km.png" },
    { code: "+682", name: "Cook Islands", flag: "https://flagcdn.com/w20/ck.png" },
    { code: "+506", name: "Costa Rica", flag: "https://flagcdn.com/w20/cr.png" },
    { code: "+385", name: "Croatia", flag: "https://flagcdn.com/w20/hr.png" },
    { code: "+53", name: "Cuba", flag: "https://flagcdn.com/w20/cu.png" },
    { code: "+599", name: "Curaçao", flag: "https://flagcdn.com/w20/cw.png" },
    { code: "+357", name: "Cyprus", flag: "https://flagcdn.com/w20/cy.png" },
    { code: "+420", name: "Czech Republic", flag: "https://flagcdn.com/w20/cz.png" },
    { code: "+243", name: "Democratic Republic of the Congo", flag: "https://flagcdn.com/w20/cd.png" },
    { code: "+45", name: "Denmark", flag: "https://flagcdn.com/w20/dk.png" },
    { code: "+253", name: "Djibouti", flag: "https://flagcdn.com/w20/dj.png" },
    { code: "+1767", name: "Dominica", flag: "https://flagcdn.com/w20/dm.png" },
    { code: "+1809", name: "Dominican Republic", flag: "https://flagcdn.com/w20/do.png" },
    { code: "+593", name: "Ecuador", flag: "https://flagcdn.com/w20/ec.png" },
    { code: "+20", name: "Egypt", flag: "https://flagcdn.com/w20/eg.png" },
    { code: "+503", name: "El Salvador", flag: "https://flagcdn.com/w20/sv.png" },
    { code: "+240", name: "Equatorial Guinea", flag: "https://flagcdn.com/w20/gq.png" },
    { code: "+291", name: "Eritrea", flag: "https://flagcdn.com/w20/er.png" },
    { code: "+372", name: "Estonia", flag: "https://flagcdn.com/w20/ee.png" },
    { code: "+268", name: "Eswatini", flag: "https://flagcdn.com/w20/sz.png" },
    { code: "+251", name: "Ethiopia", flag: "https://flagcdn.com/w20/et.png" },
    { code: "+500", name: "Falkland Islands", flag: "https://flagcdn.com/w20/fk.png" },
    { code: "+298", name: "Faroe Islands", flag: "https://flagcdn.com/w20/fo.png" },
    { code: "+679", name: "Fiji", flag: "https://flagcdn.com/w20/fj.png" },
    { code: "+358", name: "Finland", flag: "https://flagcdn.com/w20/fi.png" },
    { code: "+33", name: "France", flag: "https://flagcdn.com/w20/fr.png" },
    { code: "+594", name: "French Guiana", flag: "https://flagcdn.com/w20/gf.png" },
    { code: "+689", name: "French Polynesia", flag: "https://flagcdn.com/w20/pf.png" },
    { code: "+262", name: "French Southern Territories", flag: "https://flagcdn.com/w20/tf.png" },
    { code: "+241", name: "Gabon", flag: "https://flagcdn.com/w20/ga.png" },
    { code: "+220", name: "Gambia", flag: "https://flagcdn.com/w20/gm.png" },
    { code: "+995", name: "Georgia", flag: "https://flagcdn.com/w20/ge.png" },
    { code: "+49", name: "Germany", flag: "https://flagcdn.com/w20/de.png" },
    { code: "+233", name: "Ghana", flag: "https://flagcdn.com/w20/gh.png" },
    { code: "+350", name: "Gibraltar", flag: "https://flagcdn.com/w20/gi.png" },
    { code: "+30", name: "Greece", flag: "https://flagcdn.com/w20/gr.png" },
    { code: "+299", name: "Greenland", flag: "https://flagcdn.com/w20/gl.png" },
    { code: "+1473", name: "Grenada", flag: "https://flagcdn.com/w20/gd.png" },
    { code: "+590", name: "Guadeloupe", flag: "https://flagcdn.com/w20/gp.png" },
    { code: "+1671", name: "Guam", flag: "https://flagcdn.com/w20/gu.png" },
    { code: "+502", name: "Guatemala", flag: "https://flagcdn.com/w20/gt.png" },
    { code: "+44", name: "Guernsey", flag: "https://flagcdn.com/w20/gg.png" },
    { code: "+224", name: "Guinea", flag: "https://flagcdn.com/w20/gn.png" },
    { code: "+245", name: "Guinea-Bissau", flag: "https://flagcdn.com/w20/gw.png" },
    { code: "+592", name: "Guyana", flag: "https://flagcdn.com/w20/gy.png" },
    { code: "+509", name: "Haiti", flag: "https://flagcdn.com/w20/ht.png" },
    { code: "+504", name: "Honduras", flag: "https://flagcdn.com/w20/hn.png" },
    { code: "+852", name: "Hong Kong", flag: "https://flagcdn.com/w20/hk.png" },
    { code: "+36", name: "Hungary", flag: "https://flagcdn.com/w20/hu.png" },
    { code: "+354", name: "Iceland", flag: "https://flagcdn.com/w20/is.png" },
    { code: "+91", name: "India", flag: "https://flagcdn.com/w20/in.png" },
    { code: "+62", name: "Indonesia", flag: "https://flagcdn.com/w20/id.png" },
    { code: "+98", name: "Iran", flag: "https://flagcdn.com/w20/ir.png" },
    { code: "+964", name: "Iraq", flag: "https://flagcdn.com/w20/iq.png" },
    { code: "+353", name: "Ireland", flag: "https://flagcdn.com/w20/ie.png" },
    { code: "+44", name: "Isle of Man", flag: "https://flagcdn.com/w20/im.png" },
    { code: "+972", name: "Israel", flag: "https://flagcdn.com/w20/il.png" },
    { code: "+39", name: "Italy", flag: "https://flagcdn.com/w20/it.png" },
    { code: "+225", name: "Ivory Coast", flag: "https://flagcdn.com/w20/ci.png" },
    { code: "+1876", name: "Jamaica", flag: "https://flagcdn.com/w20/jm.png" },
    { code: "+81", name: "Japan", flag: "https://flagcdn.com/w20/jp.png" },
    { code: "+44", name: "Jersey", flag: "https://flagcdn.com/w20/je.png" },
    { code: "+962", name: "Jordan", flag: "https://flagcdn.com/w20/jo.png" },
    { code: "+7", name: "Kazakhstan", flag: "https://flagcdn.com/w20/kz.png" },
    { code: "+254", name: "Kenya", flag: "https://flagcdn.com/w20/ke.png" },
    { code: "+686", name: "Kiribati", flag: "https://flagcdn.com/w20/ki.png" },
    { code: "+383", name: "Kosovo", flag: "https://flagcdn.com/w20/xk.png" },
    { code: "+965", name: "Kuwait", flag: "https://flagcdn.com/w20/kw.png" },
    { code: "+996", name: "Kyrgyzstan", flag: "https://flagcdn.com/w20/kg.png" },
    { code: "+856", name: "Laos", flag: "https://flagcdn.com/w20/la.png" },
    { code: "+371", name: "Latvia", flag: "https://flagcdn.com/w20/lv.png" },
    { code: "+961", name: "Lebanon", flag: "https://flagcdn.com/w20/lb.png" },
    { code: "+266", name: "Lesotho", flag: "https://flagcdn.com/w20/ls.png" },
    { code: "+231", name: "Liberia", flag: "https://flagcdn.com/w20/lr.png" },
    { code: "+218", name: "Libya", flag: "https://flagcdn.com/w20/ly.png" },
    { code: "+423", name: "Liechtenstein", flag: "https://flagcdn.com/w20/li.png" },
    { code: "+370", name: "Lithuania", flag: "https://flagcdn.com/w20/lt.png" },
    { code: "+352", name: "Luxembourg", flag: "https://flagcdn.com/w20/lu.png" },
    { code: "+853", name: "Macao", flag: "https://flagcdn.com/w20/mo.png" },
    { code: "+261", name: "Madagascar", flag: "https://flagcdn.com/w20/mg.png" },
    { code: "+265", name: "Malawi", flag: "https://flagcdn.com/w20/mw.png" },
    { code: "+60", name: "Malaysia", flag: "https://flagcdn.com/w20/my.png" },
    { code: "+960", name: "Maldives", flag: "https://flagcdn.com/w20/mv.png" },
    { code: "+223", name: "Mali", flag: "https://flagcdn.com/w20/ml.png" },
    { code: "+356", name: "Malta", flag: "https://flagcdn.com/w20/mt.png" },
    { code: "+692", name: "Marshall Islands", flag: "https://flagcdn.com/w20/mh.png" },
    { code: "+596", name: "Martinique", flag: "https://flagcdn.com/w20/mq.png" },
    { code: "+222", name: "Mauritania", flag: "https://flagcdn.com/w20/mr.png" },
    { code: "+230", name: "Mauritius", flag: "https://flagcdn.com/w20/mu.png" },
    { code: "+262", name: "Mayotte", flag: "https://flagcdn.com/w20/yt.png" },
    { code: "+52", name: "Mexico", flag: "https://flagcdn.com/w20/mx.png" },
    { code: "+691", name: "Micronesia", flag: "https://flagcdn.com/w20/fm.png" },
    { code: "+373", name: "Moldova", flag: "https://flagcdn.com/w20/md.png" },
    { code: "+377", name: "Monaco", flag: "https://flagcdn.com/w20/mc.png" },
    { code: "+976", name: "Mongolia", flag: "https://flagcdn.com/w20/mn.png" },
    { code: "+382", name: "Montenegro", flag: "https://flagcdn.com/w20/me.png" },
    { code: "+1664", name: "Montserrat", flag: "https://flagcdn.com/w20/ms.png" },
    { code: "+212", name: "Morocco", flag: "https://flagcdn.com/w20/ma.png" },
    { code: "+258", name: "Mozambique", flag: "https://flagcdn.com/w20/mz.png" },
    { code: "+95", name: "Myanmar", flag: "https://flagcdn.com/w20/mm.png" },
    { code: "+264", name: "Namibia", flag: "https://flagcdn.com/w20/na.png" },
    { code: "+674", name: "Nauru", flag: "https://flagcdn.com/w20/nr.png" },
    { code: "+977", name: "Nepal", flag: "https://flagcdn.com/w20/np.png" },
    { code: "+31", name: "Netherlands", flag: "https://flagcdn.com/w20/nl.png" },
    { code: "+687", name: "New Caledonia", flag: "https://flagcdn.com/w20/nc.png" },
    { code: "+64", name: "New Zealand", flag: "https://flagcdn.com/w20/nz.png" },
    { code: "+505", name: "Nicaragua", flag: "https://flagcdn.com/w20/ni.png" },
    { code: "+227", name: "Niger", flag: "https://flagcdn.com/w20/ne.png" },
    { code: "+234", name: "Nigeria", flag: "https://flagcdn.com/w20/ng.png" },
    { code: "+683", name: "Niue", flag: "https://flagcdn.com/w20/nu.png" },
    { code: "+672", name: "Norfolk Island", flag: "https://flagcdn.com/w20/nf.png" },
    { code: "+850", name: "North Korea", flag: "https://flagcdn.com/w20/kp.png" },
    { code: "+389", name: "North Macedonia", flag: "https://flagcdn.com/w20/mk.png" },
    { code: "+1670", name: "Northern Mariana Islands", flag: "https://flagcdn.com/w20/mp.png" },
    { code: "+47", name: "Norway", flag: "https://flagcdn.com/w20/no.png" },
    { code: "+968", name: "Oman", flag: "https://flagcdn.com/w20/om.png" },
    { code: "+92", name: "Pakistan", flag: "https://flagcdn.com/w20/pk.png" },
    { code: "+680", name: "Palau", flag: "https://flagcdn.com/w20/pw.png" },
    { code: "+970", name: "Palestine", flag: "https://flagcdn.com/w20/ps.png" },
    { code: "+507", name: "Panama", flag: "https://flagcdn.com/w20/pa.png" },
    { code: "+675", name: "Papua New Guinea", flag: "https://flagcdn.com/w20/pg.png" },
    { code: "+595", name: "Paraguay", flag: "https://flagcdn.com/w20/py.png" },
    { code: "+51", name: "Peru", flag: "https://flagcdn.com/w20/pe.png" },
    { code: "+63", name: "Philippines", flag: "https://flagcdn.com/w20/ph.png" },
    { code: "+64", name: "Pitcairn", flag: "https://flagcdn.com/w20/pn.png" },
    { code: "+48", name: "Poland", flag: "https://flagcdn.com/w20/pl.png" },
    { code: "+351", name: "Portugal", flag: "https://flagcdn.com/w20/pt.png" },
    { code: "+1787", name: "Puerto Rico", flag: "https://flagcdn.com/w20/pr.png" },
    { code: "+974", name: "Qatar", flag: "https://flagcdn.com/w20/qa.png" },
    { code: "+242", name: "Republic of the Congo", flag: "https://flagcdn.com/w20/cg.png" },
    { code: "+262", name: "Reunion", flag: "https://flagcdn.com/w20/re.png" },
    { code: "+40", name: "Romania", flag: "https://flagcdn.com/w20/ro.png" },
    { code: "+7", name: "Russia", flag: "https://flagcdn.com/w20/ru.png" },
    { code: "+250", name: "Rwanda", flag: "https://flagcdn.com/w20/rw.png" },
    { code: "+590", name: "Saint Barthélemy", flag: "https://flagcdn.com/w20/bl.png" },
    { code: "+290", name: "Saint Helena", flag: "https://flagcdn.com/w20/sh.png" },
    { code: "+1869", name: "Saint Kitts and Nevis", flag: "https://flagcdn.com/w20/kn.png" },
    { code: "+1758", name: "Saint Lucia", flag: "https://flagcdn.com/w20/lc.png" },
    { code: "+590", name: "Saint Martin", flag: "https://flagcdn.com/w20/mf.png" },
    { code: "+508", name: "Saint Pierre and Miquelon", flag: "https://flagcdn.com/w20/pm.png" },
    { code: "+1784", name: "Saint Vincent and the Grenadines", flag: "https://flagcdn.com/w20/vc.png" },
    { code: "+685", name: "Samoa", flag: "https://flagcdn.com/w20/ws.png" },
    { code: "+378", name: "San Marino", flag: "https://flagcdn.com/w20/sm.png" },
    { code: "+239", name: "Sao Tome and Principe", flag: "https://flagcdn.com/w20/st.png" },
    { code: "+966", name: "Saudi Arabia", flag: "https://flagcdn.com/w20/sa.png" },
    { code: "+221", name: "Senegal", flag: "https://flagcdn.com/w20/sn.png" },
    { code: "+381", name: "Serbia", flag: "https://flagcdn.com/w20/rs.png" },
    { code: "+248", name: "Seychelles", flag: "https://flagcdn.com/w20/sc.png" },
    { code: "+232", name: "Sierra Leone", flag: "https://flagcdn.com/w20/sl.png" },
    { code: "+65", name: "Singapore", flag: "https://flagcdn.com/w20/sg.png" },
    { code: "+1721", name: "Sint Maarten", flag: "https://flagcdn.com/w20/sx.png" },
    { code: "+421", name: "Slovakia", flag: "https://flagcdn.com/w20/sk.png" },
    { code: "+386", name: "Slovenia", flag: "https://flagcdn.com/w20/si.png" },
    { code: "+677", name: "Solomon Islands", flag: "https://flagcdn.com/w20/sb.png" },
    { code: "+252", name: "Somalia", flag: "https://flagcdn.com/w20/so.png" },
    { code: "+27", name: "South Africa", flag: "https://flagcdn.com/w20/za.png" },
    { code: "+500", name: "South Georgia and the South Sandwich Islands", flag: "https://flagcdn.com/w20/gs.png" },
    { code: "+82", name: "South Korea", flag: "https://flagcdn.com/w20/kr.png" },
    { code: "+211", name: "South Sudan", flag: "https://flagcdn.com/w20/ss.png" },
    { code: "+34", name: "Spain", flag: "https://flagcdn.com/w20/es.png" },
    { code: "+94", name: "Sri Lanka", flag: "https://flagcdn.com/w20/lk.png" },
    { code: "+249", name: "Sudan", flag: "https://flagcdn.com/w20/sd.png" },
    { code: "+597", name: "Suriname", flag: "https://flagcdn.com/w20/sr.png" },
    { code: "+47", name: "Svalbard and Jan Mayen", flag: "https://flagcdn.com/w20/sj.png" },
    { code: "+46", name: "Sweden", flag: "https://flagcdn.com/w20/se.png" },
    { code: "+41", name: "Switzerland", flag: "https://flagcdn.com/w20/ch.png" },
    { code: "+963", name: "Syria", flag: "https://flagcdn.com/w20/sy.png" },
    { code: "+886", name: "Taiwan", flag: "https://flagcdn.com/w20/tw.png" },
    { code: "+992", name: "Tajikistan", flag: "https://flagcdn.com/w20/tj.png" },
    { code: "+255", name: "Tanzania", flag: "https://flagcdn.com/w20/tz.png" },
    { code: "+66", name: "Thailand", flag: "https://flagcdn.com/w20/th.png" },
    { code: "+670", name: "Timor-Leste", flag: "https://flagcdn.com/w20/tl.png" },
    { code: "+228", name: "Togo", flag: "https://flagcdn.com/w20/tg.png" },
    { code: "+690", name: "Tokelau", flag: "https://flagcdn.com/w20/tk.png" },
    { code: "+676", name: "Tonga", flag: "https://flagcdn.com/w20/to.png" },
    { code: "+1868", name: "Trinidad and Tobago", flag: "https://flagcdn.com/w20/tt.png" },
    { code: "+216", name: "Tunisia", flag: "https://flagcdn.com/w20/tn.png" },
    { code: "+90", name: "Turkey", flag: "https://flagcdn.com/w20/tr.png" },
    { code: "+993", name: "Turkmenistan", flag: "https://flagcdn.com/w20/tm.png" },
    { code: "+1649", name: "Turks and Caicos Islands", flag: "https://flagcdn.com/w20/tc.png" },
    { code: "+688", name: "Tuvalu", flag: "https://flagcdn.com/w20/tv.png" },
    { code: "+256", name: "Uganda", flag: "https://flagcdn.com/w20/ug.png" },
    { code: "+380", name: "Ukraine", flag: "https://flagcdn.com/w20/ua.png" },
    { code: "+971", name: "United Arab Emirates", flag: "https://flagcdn.com/w20/ae.png" },
    { code: "+44", name: "United Kingdom", flag: "https://flagcdn.com/w20/gb.png" },
    { code: "+1", name: "United States", flag: "https://flagcdn.com/w20/us.png" },
    { code: "+598", name: "Uruguay", flag: "https://flagcdn.com/w20/uy.png" },
    { code: "+1340", name: "US Virgin Islands", flag: "https://flagcdn.com/w20/vi.png" },
    { code: "+998", name: "Uzbekistan", flag: "https://flagcdn.com/w20/uz.png" },
    { code: "+678", name: "Vanuatu", flag: "https://flagcdn.com/w20/vu.png" },
    { code: "+379", name: "Vatican City", flag: "https://flagcdn.com/w20/va.png" },
    { code: "+58", name: "Venezuela", flag: "https://flagcdn.com/w20/ve.png" },
    { code: "+84", name: "Vietnam", flag: "https://flagcdn.com/w20/vn.png" },
    { code: "+681", name: "Wallis and Futuna", flag: "https://flagcdn.com/w20/wf.png" },
    { code: "+212", name: "Western Sahara", flag: "https://flagcdn.com/w20/eh.png" },
    { code: "+967", name: "Yemen", flag: "https://flagcdn.com/w20/ye.png" },
    { code: "+260", name: "Zambia", flag: "https://flagcdn.com/w20/zm.png" },
    { code: "+263", name: "Zimbabwe", flag: "https://flagcdn.com/w20/zw.png" },
];

const WhatsAppForm = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === "+92") || countries[0]);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const [qrName, setQrName] = useState("");
    const [error, setError] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const validatePhoneNumber = (number) => {
        const cleanNumber = number.replace(/\D/g, "");
        return cleanNumber.length >= 7;
    };

    const constructWhatsAppLink = () => {
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${selectedCountry.code.replace('+', '')}${cleanNumber}${message ? `?text=${encodedMessage}` : ""}`;
    };

    const handleCustomizeClick = () => {
        if (!phoneNumber.trim()) {
            setError("Please enter a phone number.");
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            setError("Please enter a valid phone number (at least 7 digits).");
            return;
        }
        setError("");
        navigate("/module/qr/qr-customize", {
            state: {
                country: selectedCountry,
                phoneNumber,
                message,
                qrName,
                whatsappLink: constructWhatsAppLink(),
            },
        });
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm)
    );

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setDropdownOpen(false);
        setSearchTerm("");
    };

    return (
       <>
            <div className="mb-4">
                <div
                    className={`relative flex items-center border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent dark:text-gray-200 dark:bg-bodybg ${
                        error ? "border-danger" : "border-gray-300"
                    }`}
                >
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center pl-3 pr-2 py-3 border-r border-gray-300 bg-gray-50 text-gray-700 text-sm rounded-l-lg focus:outline-none hover:bg-gray-100 dark:text-gray-200 dark:bg-bodybg dark:hover:bg-gray-700 min-w-[140px]"
                        >
                            <img
                                src={selectedCountry.flag}
                                alt={selectedCountry.name}
                                className="w-5 h-3 mr-2 object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <span className="mr-1">{selectedCountry.code}</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute top-full left-0 z-50 w-80 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
                                <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                                    <input
                                        type="text"
                                        placeholder="Search countries..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                <div className="overflow-y-auto max-h-48">
                                    {filteredCountries.map((country) => (
                                        <button
                                            key={`${country.code}-${country.name}`}
                                            type="button"
                                            onClick={() => handleCountrySelect(country)}
                                            className="w-full flex items-center px-3 mb-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none"
                                        >
                                            <img
                                                src={country.flag}
                                                alt={country.name}
                                                className="w-5 h-3 mr-3 object-cover flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <span className="text-sm font-medium mr-2 flex-shrink-0">{country.code}</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{country.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <input
                        type="tel"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setError("");
                        }}
                        className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none dark:text-gray-200 dark:bg-bodybg"
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="mb-4">
                <div className="relative">
                    <textarea
                        placeholder="Text Message (optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        maxLength={5000}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:text-gray-200 dark:bg-bodybg"
                    />
                    <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                        {message.length}/5000
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Name your QR"
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-200 dark:bg-bodybg"
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleCustomizeClick}
                    disabled={!phoneNumber.trim() || error}
                    className={`py-3 px-6 rounded-lg font-semibold flex justify-between items-center ${
                        phoneNumber.trim() && !error
                            ? "bg-primary text-white hover:bg-primary/80"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Customize & Download QR
                </button>
            </div>

            {dropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                ></div>
            )}
        </>
    );
};

export default WhatsAppForm;