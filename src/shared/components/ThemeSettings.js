import { __ } from "@wordpress/i18n";
import { PanelBody, TextControl } from "@wordpress/components";

import themes from '../themes';
import providers from '../providers';
import ThemePicker from './ThemePicker';

const ThemeSettings = ({ attributes, setAttributes }) => {
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

    return (
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
    )
}

export default ThemeSettings
