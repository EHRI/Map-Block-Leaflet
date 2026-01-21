import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";

import themes from '../../shared/themes';
import providers from '../../shared/providers';
import ThemePicker from '../../shared/components/ThemePicker';
import AddFeature from "./AddFeature";
import ListFeatures from "./ListFeatures";

const Inspector = (props) => {
    const { attributes, setAttributes } = props;
    const { themeId } = attributes;

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
            </PanelBody>
        </InspectorControls>
    )
}

export default Inspector