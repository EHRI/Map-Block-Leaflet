import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";

import ThemeSettings from '../../shared/components/ThemeSettings';
import AddFeature from "./AddFeature";
import ListFeatures from "./ListFeatures";

const Inspector = (props) => {
    const { attributes, setAttributes } = props;

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
            <ThemeSettings attributes={attributes} setAttributes={setAttributes} />
        </InspectorControls>
    )
}

export default Inspector