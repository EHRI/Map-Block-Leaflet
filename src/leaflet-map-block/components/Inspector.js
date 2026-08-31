import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
    PanelBody,
    TextareaControl,
    TextControl,
    RangeControl,
    ToggleControl
} from "@wordpress/components";
import ThemeSettings from '../../shared/components/ThemeSettings';
import ImageUpload from '../../shared/components/ImageUpload';

const Inspector = (props) => {
    const { attributes, setAttributes } = props;
    const {
        lat, lng, height, content, zoom, disableScrollZoom,
        markerImage, markerSize
    } = attributes;

    return (
        <InspectorControls>
            <PanelBody>
                <label class="blocks-base-control__label" for="map-block-leaflet-text-control-lat">{__('Latitude', 'map-block-leaflet')}</label>
                <TextControl
                    id="map-block-leaflet-text-control-lat"
                    onChange={lat => setAttributes({ lat: Number(lat) })}
                    type="number"
                    value={lat}
                />
                <label class="blocks-base-control__label" for="map-block-leaflet-text-control-lon">{__('Longitude', 'map-block-leaflet')}</label>
                <TextControl
                    onChange={lng => setAttributes({ lng: Number(lng) })}
                    id="map-block-leaflet-text-control-lon"
                    type="number"
                    value={lng}
                />

                <RangeControl
                    label={__("Zoom", "map-block-leaflet")}
                    value={zoom}
                    onChange={zoom => setAttributes({ zoom: Number(zoom) })}
                    min={1}
                    max={17} />

                <TextareaControl
                    label={__('Content of tooltip', 'map-block-leaflet')}
                    onChange={content => setAttributes({ content })}
                    value={content}
                />
            </PanelBody>
            <ThemeSettings attributes={attributes} setAttributes={setAttributes} />
            <PanelBody title={__('Custom marker', 'map-block-leaflet')} initialOpen={false}>
                <ImageUpload
                    image={markerImage}
                    onSelect={(image) => setAttributes({ markerImage: image })}
                />

                <RangeControl
                    label={__('Marker size', 'map-block-leaflet')}
                    value={markerSize}
                    disabled={!markerImage}
                    onChange={size => setAttributes({ markerSize: size })}
                    min={10}
                    max={200}
                />
            </PanelBody>

            <PanelBody title={__('Options', 'map-block-leaflet')} initialOpen={false}>

                <label class="blocks-base-control__label" for="map-block-leaflet-text-control-lon">{__('Map height', 'map-block-leaflet')}</label>
                <TextControl
                    onChange={height => setAttributes({ height: Number(height) })}
                    id="map-block-leaflet-text-control-lon"
                    type="number"
                    step="10"
                    value={height}
                />

                <ToggleControl
                    label={__('Disable scroll zoom', 'map-block-leaflet')}
                    checked={disableScrollZoom}
                    onChange={value => setAttributes({ disableScrollZoom: value })}
                />
            </PanelBody>
        </InspectorControls>
    )
}

export default Inspector