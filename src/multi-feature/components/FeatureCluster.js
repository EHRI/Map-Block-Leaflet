import { useEffect, useMemo } from "@wordpress/element";
import { useMap } from 'react-leaflet';
import { Feature } from "../../shared/components/Map";
import L from 'leaflet';

const BOUNDS_PADDING = [50, 50];

export const FeatureCluster = ({ features }) => {
    const map = useMap();

    // Filter and parse features once, with error handling
    const validFeatures = useMemo(() => {
        return features
            .filter(props => props.content)
            .map(props => {
                try {
                    return {
                        ...props,
                        parsedContent: JSON.parse(props.content)
                    };
                } catch (error) {
                    console.error(`Failed to parse GeoJSON for feature "${props.label}":`, error);
                    return null;
                }
            })
            .filter(Boolean);
    }, [features]);

    // Fit map bounds when features change
    useEffect(() => {
        if (validFeatures.length === 0) return;

        try {
            const geoJsonData = validFeatures.map(f => f.parsedContent);
            const layer = L.geoJSON(geoJsonData);
            const bounds = layer.getBounds();

            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: BOUNDS_PADDING });
            }
        } catch (error) {
            console.error('Failed to fit bounds for features:', error);
        }
    }, [validFeatures, map]);

    return validFeatures.map((props, index) =>
        <Feature
            data={props.parsedContent}
            style={(feature) => ({
                color: props.color,
                weight: 1,
            })}
            key={`${props.label}-${index}`}
        />
    );
}