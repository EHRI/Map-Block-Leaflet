import { __ } from '@wordpress/i18n'
import { useBlockProps } from '@wordpress/block-editor'
import Inspector from "./components/Inspector"
import { Map } from "../shared/components/Map"
import { FeatureCluster } from "./components/FeatureCluster";
import './editor.scss'
import Resizable from "../shared/components/Resizable"
import { BlockControls } from '@wordpress/block-editor';

export default function Edit(props) {
    const { attributes, setAttributes, toggleSelection } = props;
    const { features } = attributes;

    const defaultPosition = [50, 10]
    const handleZoom = () => { }
    const handleHeight = (height) => setAttributes({ height })

    return (
        <div {...useBlockProps()}>
            <Inspector {...props} />
          <BlockControls {...props} />
            <Resizable
                height={attributes.height}
                setHeight={handleHeight}
                toggleSelection={toggleSelection}
            >
                <Map
                    disableScrollZoom={attributes.disableScrollZoom}
                    position={defaultPosition}
                    zoom={13}
                    themeUrl={attributes.themeUrl}
                    height={attributes.height}
                    setZoom={handleZoom}
                >
                    <FeatureCluster features={features} />
                </Map>
            </Resizable>
        </div>
    )
}
