import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";

import themes from '../../shared/themes';
import providers from '../../shared/providers';
import ThemePicker from '../../shared/components/ThemePicker';
import AddFeature from "./AddFeature";
import ListFeatures from "./ListFeatures";

const Inspector = (props) => {
    const { attributes, setAttributes } = props;
    const { themeId, themeUrl, themeAttribution } = attributes;

    const setTheme = ({ id }) => {
        const themeSelected = providers.find(provider => provider.id === id);
        if (themeSelected) {
            setAttributes({
                themeId: themeSelected.id,
                themeUrl: themeSelected.url,
                themeAttribution: themeSelected.attribution,
            })
        }
    }

    const safeThemeUrl = (url) => {
        const reqex = /{ext}|{ex}|{e}$/;
        return url.replace(reqex, 'png');
    }

    const addFeature = (feature) => {
        setAttributes({ features: attributes.features.concat(feature) });
    }

    const handleChangeFeatures = (features) => {
      setAttributes({ features });
    }


    return (
        <InspectorControls>
            <PanelBody title={__('Features', 'map-block-leaflet')} initialOpen>
                <AddFeature themeUrl={attributes.themeUrl} onCreate={addFeature} />
                <ListFeatures themeUrl={attributes.themeUrl} onChange={handleChangeFeatures} features={attributes.features} />
            </PanelBody>
            <PanelBody title={__('Theme', 'map-block-leaflet')} initialOpen={false}>
                <ThemePicker
                    value={themeId}
                    themes={themes}
                    onChange={setTheme}
                />
                <label class="blocks-base-control__label" for="map-block-leaflet-text-control-xyz">{__('XYZ Tiles', 'map-block-leaflet')}</label>
                <TextControl
                    onChange={themeUrl => setAttributes({ themeId: '', themeUrl: safeThemeUrl(themeUrl) })}
                    id="map-block-leaflet-text-control-xyz"
                    type="text"
                    value={themeUrl}
                />
                <label class="blocks-base-control__label" for="map-block-leaflet-text-control-attribution">{__('Attribution', 'map-block-leaflet')}</label>
                <TextControl
                    onChange={themeAttribution => setAttributes({ themeAttribution })}
                    id="map-block-leaflet-text-control-attribution"
                    type="text"
                    value={themeAttribution}
                />
            </PanelBody>
        </InspectorControls>
    )
}

export default Inspector