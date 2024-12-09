import React from 'react'
import { useEffect } from 'react';

function TabToTop() {
	const ScreenUp = () => {
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		const handleScroll = () => {
			const color = document.getElementsByClassName("scrollToTop")[0];
			if (color) {
				window.scrollY > 100 ? (color.style.display = "flex") : (color.style.display = "none");
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	return (
		<>
			<div className="scrollToTop" onClick={ScreenUp}>
				<span className="arrow"><i className="ri-arrow-up-s-fill text-xl"></i></span>
			</div>
		</>
	)
}

export default TabToTop