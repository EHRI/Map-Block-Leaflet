import { useState } from "@wordpress/element";
import { Button } from "@wordpress/components";
import EditorFeatures from "./EditorFeatures";
import { __ } from "@wordpress/i18n";

const cleanFeature = {
    label: "",
    content: "",
    color: "#DAB1DA",
    postId: null
}
const AddFeature = ({ onCreate, themeUrl }) => {
    const [isOpen, setOpen] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(cleanFeature)

    const clearEditor = () => {
        setOpen(false);
        setCurrentFeature(cleanFeature);
    }
    const handleSave = newFeature => {
        onCreate(newFeature);
        clearEditor();
    }

    const handleClick = () => setOpen(true);

    return (
        <>
            <div style={{ marginBottom: "1rem" }}>
                <Button variant="primary" onClick={handleClick}>{__('Add feature', 'map-block-leaflet')}</Button>
            </div>
            {isOpen && (
                <EditorFeatures
                    title={__('Add new feature', 'map-block-leaflet')}
                    onSave={handleSave}
                    onClose={clearEditor}
                    themeUrl={themeUrl}
                    {...currentFeature}
                />
            )}
        </>
    )
}

export default AddFeature