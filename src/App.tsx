import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const positions = [
	{
		title: '카카오',
		latlng: new kakao.maps.LatLng(33.450705, 126.570677),
	},
	{
		title: '생태연못',
		latlng: new kakao.maps.LatLng(33.450936, 126.569477),
	},
	{
		title: '텃밭',
		latlng: new kakao.maps.LatLng(33.450879, 126.56994),
	},
	{
		title: '근린공원',
		latlng: new kakao.maps.LatLng(33.451393, 126.570738),
	},
];

function App() {
	const container = useRef<HTMLDivElement | null>(null);
	const [initialKakao, setInitialKaKao] = useState<typeof kakao.maps | null>(
		null
	);
	const [reactMap, setReactMap] = useState<kakao.maps.Map | null>(null);
	const [markerArray, setMarkerArray] = useState<kakao.maps.Marker[]>([]);

	/**
	 * 지도 클릭시 마커를 이동하고 위도, 경도를 표시한다.
	 * @param mouseEvent : 이벤트
	 * @param marker : 마커객체
	 */

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

		//복수의 마커들
		for (let i = 0; i < positions.length; i++) {
			// 마커를 생성합니다
			const markers = new kakao.maps.Marker({
				map: map, // 마커를 표시할 지도
				position: positions[i].latlng, // 마커를 표시할 위치
				title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
			});
			markers.setMap(map);
		}

		//클릭이벤트
		initialKakao.event.addListener(map, 'click', (mouseEvent: any) => {
			if (!initialKakao) return;

			// const latlng = mouseEvent.latLng;
			const marker = new initialKakao.Marker({
				position: mouseEvent.latLng,
			});

			// 마커가 지도 위에 표시되도록 설정합니다
			marker.setMap(map);

			// // 생성된 마커를 배열에 추가합니다
			setMarkerArray([...markerArray, marker]);
		});

		// return () =>
		// 	initialKakao.event.removeListener(map, 'click', handleMapClick);
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
