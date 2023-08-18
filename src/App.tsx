import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
	const container = useRef<HTMLDivElement | null>(null);
	const [initialKakao, setInitialKaKao] = useState<typeof kakao.maps | null>(
		null
	);
	const [reactMap, setReactMap] = useState<kakao.maps.Map | null>(null);
	/**
	 * 지도 클릭시 마커를 이동하고 위도, 경도를 표시한다.
	 * @param mouseEvent : 이벤트
	 * @param marker : 마커객체
	 */
	const handleMapClick = (mouseEvent: any, marker: kakao.maps.Marker) => {
		const latlng = mouseEvent.latLng;
		const newMessage = `클릭한 위치의 위도는 ${latlng.getLat()} 이고, 경도는 ${latlng.getLng()} 입니다`;
		console.log(newMessage);

		marker.setPosition(latlng);
	};

	//시작 : kakao map 글로벌객체를 state에 담는다.(나중에 쓰기편하게)
	useEffect(() => {
		if (!container.current) return;
		const kakao = window.kakao.maps;
		setInitialKaKao(kakao);
	}, [container]);

	//카카오맵을 그리고, 마커도 그리고, 지도클릭시에 마커이동
	useEffect(() => {
		if (!initialKakao) return;
		if (!container.current) return;
		const options = {
			center: new initialKakao.LatLng(33.450701, 126.570667),
			level: 3,
		};

		const map = new initialKakao.Map(container.current, options);

		setReactMap(map);

		const marker = new initialKakao.Marker({
			position: map.getCenter(),
		});
		marker.setMap(map);

		initialKakao.event.addListener(
			map,
			'click',
			(mouseEvent: typeof kakao.maps.event) =>
				handleMapClick(mouseEvent, marker)
		);

		return () =>
			initialKakao.event.removeListener(map, 'click', handleMapClick);
	}, [initialKakao, container]);

	//컨트롤바
	useEffect(() => {
		if (!reactMap) return;
		if (!initialKakao) return;

		const mapTypeControl = new initialKakao.MapTypeControl();
		reactMap.addControl(mapTypeControl, initialKakao.ControlPosition.TOPRIGHT);

		const zoomControl = new initialKakao.ZoomControl();
		reactMap.addControl(zoomControl, initialKakao.ControlPosition.RIGHT);
	}, [reactMap, initialKakao]);

	return (
		<>
			<div
				className='map'
				ref={container}
				style={{ width: 800, height: '90vh' }}></div>
		</>
	);
}

export default App;
