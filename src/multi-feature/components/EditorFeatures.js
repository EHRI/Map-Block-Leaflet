import {__} from "@wordpress/i18n";
import {useState, useCallback, useMemo, useEffect} from "@wordpress/element";
import {Button, Modal, PanelBody, PanelRow, TextareaControl, TextControl, ComboboxControl, ColorPicker, BaseControl} from "@wordpress/components";
import {Feature, Map} from "../../shared/components/Map";
import apiFetch from '@wordpress/api-fetch';
import L from 'leaflet';
import './EditorFeatures.scss';

const DEFAULT_MAP_POSITION = [50, 10];
const DEFAULT_MAP_ZOOM = 4;

const EditorFeatures = (props) => {
	const [label, setLabel] = useState(props.label);
	const [content, setContent] = useState(props.content);
	const [color, setColor] = useState(props.color);
	const [postId, setPostId] = useState(props.postId || null);
	const [posts, setPosts] = useState([]);
	const [pages, setPages] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch posts and pages from WordPress REST API
	useEffect(() => {
		const fetchContent = async () => {
			try {
				const [fetchedPosts, fetchedPages] = await Promise.all([
					apiFetch({ path: '/wp/v2/posts?per_page=100' }),
					apiFetch({ path: '/wp/v2/pages?per_page=100' })
				]);
				setPosts(fetchedPosts);
				setPages(fetchedPages);
			} catch (error) {
				console.error('Error fetching posts/pages:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchContent();
	}, []);

	const createFeature = () => {
		const response = {color, label, content, postId}

		if (props.id !== undefined) {
			response.id = props.id
		}
		props.onSave(response);
	}

	// Combine posts and pages into a single options array
	const postOptions = useMemo(() => {
		const options = [
			{ label: __('-- None --', 'map-block-leaflet'), value: null }
		];

		if (pages.length > 0) {
			options.push({
				label: __('--- Pages ---', 'map-block-leaflet'),
				value: 'pages-header',
				disabled: true
			});
			pages.forEach(page => {
				options.push({
					label: page.title.rendered,
					value: page.id
				});
			});
		}

		if (posts.length > 0) {
			options.push({
				label: __('--- Posts ---', 'map-block-leaflet'),
				value: 'posts-header',
				disabled: true
			});
			posts.forEach(post => {
				options.push({
					label: post.title.rendered,
					value: post.id
				});
			});
		}

		return options;
	}, [posts, pages]);

	const isValidJSONObject = (str) => {
		try {
			const parsed = JSON.parse(str);
			return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
		} catch (e) {
			return false;
		}
	};

	const hasValidFeature = label && isValidJSONObject(content);

	const styleFunction = useCallback((feature) => ({
		color: color,
		weight: 1
	}), [color]);

	// Calculate map position from GeoJSON content if available
	const mapPosition = useMemo(() => {
		if (isValidJSONObject(content)) {
			try {
				const geoJson = JSON.parse(content);
				const layer = L.geoJSON(geoJson);
				const bounds = layer.getBounds();
				if (bounds.isValid()) {
					const center = bounds.getCenter();
					return [center.lat, center.lng];
				}
			} catch (e) {
				// Fall back to default position
			}
		}
		return DEFAULT_MAP_POSITION;
	}, [content]);

	return (
		<Modal
			title={props.title}
			onRequestClose={props.onClose}>
			<div className="editor-features-modal__content">

				<div className="editor-features-modal__map-preview">
					<Map
						position={mapPosition}
						zoom={DEFAULT_MAP_ZOOM}
						themeUrl={props.themeUrl}
						height={350}
					>
						{isValidJSONObject(content) && (
							<Feature
								data={JSON.parse(content)}
								style={styleFunction}
							/>
						)}
					</Map>
				</div>

				<PanelBody title={__('Details', 'map-block-leaflet')} initialOpen={true}>
					<PanelRow>
						<div className="editor-features-modal__form-fields">
							<div className="editor-features-modal__field">
								<TextControl
									label={__('Label', 'map-block-leaflet')}
									onChange={setLabel}
									value={label}
									help={__('This text will not be displayed on the web, it is to facilitate the identification of the feature.', 'map-block-leaflet')}
                  __next40pxDefaultSize
                  __nextHasNoMarginBottom
								/>
							</div>

							<div className="editor-features-modal__field">
								<TextareaControl
									label={__('Content', 'map-block-leaflet')}
									value={content}
									onChange={setContent}
									help={__('Paste GeoJSON content here (must be a valid GeoJSON object).', 'map-block-leaflet')}
                  __nextHasNoMarginBottom
								/>
							</div>

							<div className="editor-features-modal__field">
								<ComboboxControl
									label={__('Linked Post/Page', 'map-block-leaflet')}
									value={postId}
									onChange={setPostId}
									options={postOptions}
									help={__('Select a post or page to display its content when the feature is clicked.', 'map-block-leaflet')}
									disabled={loading}
                  __next40pxDefaultSize
                  __nextHasNoMarginBottom
								/>
							</div>

							<div className="editor-features-modal__field--last">
								<BaseControl
									label={__('Color', 'map-block-leaflet')}
									help={__('Choose the border and fill color for the feature.', 'map-block-leaflet')}
                  __nextHasNoMarginBottom
								>
									<ColorPicker
										color={color}
										onChangeComplete={(value) => setColor(value.hex)}
										disableAlpha
									/>
								</BaseControl>
							</div>

						</div>
					</PanelRow>
				</PanelBody>

				<div className="editor-features-modal__actions">
					<Button disabled={!hasValidFeature} variant="primary" onClick={createFeature}> {__('Accept', 'map-block-leaflet')} </Button>
				</div>
			</div>
		</Modal>
	)
}

export default EditorFeatures