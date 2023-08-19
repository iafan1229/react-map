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
const fetchOption = {
	method: 'GET',
	headers: {
		Authorization: 'KakaoAK 9a8bb55a94f70533c68ddc084e58be33',
	},
};

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
function makeOverListener(
	map: kakao.maps.Map,
	marker: kakao.maps.Marker,
	infowindow: kakao.maps.InfoWindow
) {
	return function () {
		infowindow.open(map, marker);
	};
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow: kakao.maps.InfoWindow) {
	return function () {
		infowindow.close();
	};
}

function App() {
	const container = useRef<HTMLDivElement | null>(null);
	const [initialKakao, setInitialKaKao] = useState<typeof kakao.maps | null>(
		null
	);
	const [reactMap, setReactMap] = useState<kakao.maps.Map | null>(null);
	const [markerArray, setMarkerArray] = useState<kakao.maps.Marker[]>([]);

	//시작 : kakao map 글로벌객체를 state에 담는다.(나중에 쓰기편하게)
	useEffect(() => {
		if (!container.current) return;
		const kakao = window.kakao.maps;
		setInitialKaKao(kakao);
	}, [container]);

	//비즈니스 로직 분리(마커 추가, 복수의 마커 등등)
	useEffect(() => {
		if (!initialKakao) return;
		if (!container.current) return;

		const options = {
			center: new initialKakao.LatLng(33.450701, 126.570667),
			level: 3,
		};

		const map = new initialKakao.Map(container.current, options);

		setReactMap(map);

		//클릭이벤트로 위도, 경도 불러오고, 추가된 마커의 주소 불러오기
		initialKakao.event.addListener(map, 'click', async (mouseEvent: any) => {
			if (!initialKakao) return;
			const marker = new initialKakao.Marker({
				position: mouseEvent.latLng,
			});
			const latlng = mouseEvent.latLng;
			// const newMessage = `클릭한 위치의 위도는 ${latlng.getLat()} 이고, 경도는 ${latlng.getLng()} 입니다`;

			const getLocation = await fetch(
				`${`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${latlng.getLng()}&y=${latlng.getLat()}`}`,
				fetchOption
			);
			const jsonData = await getLocation.json();
			const result = await jsonData.documents[0].address.address_name;
			marker.setTitle(result);
			marker.setMap(map);

			setMarkerArray([...markerArray, marker]);

			// 마커에 표시할 인포윈도우를 생성합니다
			const infowindow = new kakao.maps.InfoWindow({
				content: result, // 인포윈도우에 표시할 내용
			});

			kakao.maps.event.addListener(
				marker,
				'mouseover',
				makeOverListener(map, marker, infowindow)
			);
			kakao.maps.event.addListener(
				marker,
				'mouseout',
				makeOutListener(infowindow)
			);
			kakao.maps.event.addListener(marker, 'click', () => {
				marker.setMap(null);
				infowindow.close();
			});
		});
		//복수의 마커들
		for (let i = 0; i < positions.length; i++) {
			// 마커를 생성합니다
			const markers = new kakao.maps.Marker({
				map: map, // 마커를 표시할 지도
				position: positions[i].latlng, // 마커를 표시할 위치
				title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
			});
			markers.setMap(map);

			// 마커에 표시할 인포윈도우를 생성합니다
			const infowindow = new kakao.maps.InfoWindow({
				content: positions[i].title ?? positions[i].title, // 인포윈도우에 표시할 내용
			});

			kakao.maps.event.addListener(
				markers,
				'mouseover',
				makeOverListener(map, markers, infowindow)
			);
			kakao.maps.event.addListener(
				markers,
				'mouseout',
				makeOutListener(infowindow)
			);
		}
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
