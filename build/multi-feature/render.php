<?php

$id      = uniqid( 'lmbf_' );
$classes = 'map_block_leaflet map_block_leaflet_multifeature';
if ( array_key_exists( 'align', $attributes ) ) {
	switch ( $attributes['align'] ) {
		case 'wide':
			$classes .= ' alignwide';
			break;
		case 'full':
			$classes .= ' alignfull';
			break;
	}
}

// Fetch post/page content for features that have a postId
$features_with_content = array_map(function($feature) {
	if ( isset($feature['postId']) && !empty($feature['postId']) ) {
		$post = get_post($feature['postId']);
		if ( $post ) {
			// Apply the_content filters to process shortcodes, embeds, etc.
			$content = apply_filters('the_content', $post->post_content);
			$feature['postContent'] = $content;
			$feature['postTitle'] = $post->post_title;
		}
	}
	return $feature;
}, $attributes['features']);

?>


<div id="<?= $id ?>" class="<?= $classes ?>" style="height: <?= $attributes['height'] ?>px"></div>

<script>
	document.addEventListener("DOMContentLoaded", function () {
		const features = <?= json_encode( $features_with_content ) ?>;

		const baseLayer = L.tileLayer("<?= esc_js( $attributes['themeUrl'] ) ?>", {
			attribution: '<?= $attributes['themeAttribution'] ?>'
		});

		if (features.length === 0) {
			console.error('No features provided to multi-feature block');
			return;
		}

		// Create lookup maps by label for color and post data
		const colorByLabel = {};
		const postDataByLabel = {};

		features.forEach(f => {
			colorByLabel[f.label] = f.color;
			if (f.postContent) {
				postDataByLabel[f.label] = {
					title: f.postTitle,
					content: f.postContent
				};
			}
		});

		// Parse GeoJSON and ensure properties._label exists for lookup
		let geoJsonFeatures = features.map(f => {
			const geoJson = JSON.parse(f.content);

			// Add label to properties so Leaflet callbacks can access it
			if (geoJson.type === 'FeatureCollection') {
				// For FeatureCollections, add label to each feature's properties
				if (geoJson.features && Array.isArray(geoJson.features)) {
					geoJson.features.forEach(feature => {
						if (!feature.properties) {
							feature.properties = {};
						}
						feature.properties._label = f.label;
					});
				}
			} else if (geoJson.type === 'Feature') {
				// For single Features, add label to properties
				if (!geoJson.properties) {
					geoJson.properties = {};
				}
				geoJson.properties._label = f.label;
			} else {
				// For direct geometries (Point, Polygon, etc.), wrap in a Feature
              return {
                  type: 'Feature',
                  geometry: geoJson,
                  properties: {
                    _label: f.label
                  }
                };
			}

			return geoJson;
		});

		const geoJsonLayer = L.geoJSON(geoJsonFeatures, {
			style: function (feature) {
				// Use label from properties for lookup
				const label = feature.properties ? feature.properties._label : null;
				const featureColor = label ? colorByLabel[label] : '#3388ff';
				return {
					color: featureColor,
					weight: 1,
					fillOpacity: 0.2,
					fillColor: featureColor
				};
			},
			onEachFeature: function (feature, layer) {
				const label = feature.properties ? feature.properties._label : null;
				const postData = label ? postDataByLabel[label] : null;

				// Only add hover and click effects if feature has a post assigned
				if (postData) {
					const defaultStyle = {
						fillOpacity: 0.2,
						weight: 1
					};

					const hoverStyle = {
						fillOpacity: 0.1,
						weight: 2
					};

					layer.on('mouseover', function (e) {
						layer.setStyle(hoverStyle);
					});

					layer.on('mouseout', function (e) {
						layer.setStyle(defaultStyle);
					});

					layer.on('click', function (e) {
						// Show post/page content in a Leaflet popup
						const popupContent = '<div class="feature-popup">' +
							'<h3>' + postData.title + '</h3>' +
							'<div class="feature-popup-content">' + postData.content + '</div>' +
							'</div>';

						layer.bindPopup(popupContent, {
							maxWidth: 500,
							maxHeight: 400,
							className: 'feature-popup-container'
						}).openPopup();
					});

					// Add pointer cursor to indicate it's clickable
					layer.on('mouseover', function (e) {
						e.target._path.style.cursor = 'pointer';
					});
				}
			}
		});

		const bounds = geoJsonLayer.getBounds();
		if (!bounds.isValid()) {
			console.error('Invalid bounds for features');
			return;
		}

		const center = bounds.getCenter();
		const map = L.map("<?= $id ?>", {
			center: center,
            layers: [baseLayer, geoJsonLayer]
		});
		map.scrollWheelZoom.disable();

		map.fitBounds(bounds, {
			padding: [50, 50]
		});

		const container = document.getElementById("<?= $id ?>");

		const observer = ResizeObserver && new ResizeObserver(function () {
			map.invalidateSize(true);
		});

		observer && observer.observe(container);
	});
</script>
