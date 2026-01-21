import { __ } from "@wordpress/i18n";
import { useState, useEffect, useMemo } from "@wordpress/element";
import { Button } from "@wordpress/components";
import EditorFeatures from "./EditorFeatures";
import FeatureIcon from "./FeatureIcon";

const initialFeaturesToState = features => {
    return features
        .sort((a, b) => {
            const aLabel = a.label.toLowerCase();
            const bLabel = b.label.toLowerCase();
            return aLabel.localeCompare(bLabel);
        })
        .map((props, id) => ({ id, ...props }));
}

const exportStateToFeatures = features => {
    return features.map(({ id, ...props }) => props);
}

const ListFeatures = ({ features: initialFeatures, onChange, themeUrl }) => {
    const [features, setFeatures] = useState([])
    const [isOpen, setOpen] = useState(false)
    const [currentFeature, setCurrentFeature] = useState({})

    useEffect(() => {
        setFeatures(initialFeaturesToState(initialFeatures))
    }, [initialFeatures])

    const handleEdit = id => {
        const feature = features.find(feature => feature.id === id);
        setCurrentFeature(feature);
        setOpen(true);
    }

    const handleDelete = id => {
        const featuresFiltered = features.filter(attrs => attrs.id !== id)
        onChange(exportStateToFeatures(featuresFiltered))
    }

    const handleSave = newFeature => {
        const featuresEdited = features.map(feature => feature.id === newFeature.id ? newFeature : feature)
        setFeatures(featuresEdited)
        onChange(exportStateToFeatures(featuresEdited))
        setOpen(false);
    }

    const handleClose = () => {
        setOpen(false);
        setCurrentFeature({});
    }

    return (
        <>
            {isOpen && (
                <EditorFeatures title={__('Edit feature', 'map-block-leaflet')} onSave={handleSave} onClose={handleClose} themeUrl={themeUrl} {...currentFeature} />
            )}
            {features.map((attrs) => (
                <div className="map-block-leaflet-list-item" key={attrs.id}>
                    <div>
                        <FeatureIcon />
                    </div>
                    <div>
                        <div>{attrs.label}</div>
                        <div className="map-block-leaflet-list-item-action">
                            <Button size="small" variant="secondary" onClick={() => handleEdit(attrs.id)}>{__('Edit', 'map-block-leaflet')}</Button>
                            <Button size="small" variant="secondary" isDestructive onClick={() => handleDelete(attrs.id)}>{__('Delete', 'map-block-leaflet')}</Button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ListFeatures