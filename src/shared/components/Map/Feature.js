import { GeoJSON } from 'react-leaflet';

export const Feature = ({ data, children, style }) => {
	return (
		<GeoJSON
			data={data}
			style={style}
		>
			{children}
		</GeoJSON>
	);
}  