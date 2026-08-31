import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";

import ThemeSettings from '../../shared/components/ThemeSettings';
import AddMarker from "./AddMarker";
import ListMarkers from "./ListMarkers";

const Inspector = (props) => {
    const { attributes, setAttributes } = props;

    const addMarker = (marker) => {
        setAttributes({ markers: attributes.markers.concat(marker) });
    }

    const handleChangeMarkers = (markers) => {
        setAttributes({ markers });
    }

    return (
        <InspectorControls>
            <PanelBody title={__('Markers', 'map-block-leaflet')} initialOpen>
                <AddMarker themeUrl={attributes.themeUrl} onCreate={addMarker} />
                <ListMarkers themeUrl={attributes.themeUrl} onChange={handleChangeMarkers} markers={attributes.markers} />
            </PanelBody>
            <ThemeSettings attributes={attributes} setAttributes={setAttributes} />
        </InspectorControls>
    )
}

export default Inspector