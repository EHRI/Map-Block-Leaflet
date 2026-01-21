<?php

$id      = uniqid( 'lmbf_' );
$classes = 'map_block_leaflet';
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

<style>
    .leaflet-popup-scrolled {
        display: flex;
        overflow: unset;
    }

    .feature-popup-container .leaflet-popup-content-wrapper {
        max-height: 400px;
        overflow-y: hidden;
    }

    .feature-popup {
        display: flex;
        flex-direction: column;
    }

    .feature-popup h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.2em;
        border-bottom: 2px solid #ddd;
        padding-bottom: 0.5rem;
    }

    .feature-popup-content {
        line-height: 1.6;
        flex: 1;
        overflow-y: auto;
    }

    .feature-popup-content img {
        max-width: 100%;
        height: auto;
    }

</style>

<div id="<?= $id ?>" class="<?= $classes ?>" style="height: <?= $attributes['height'] ?>px">
</div>

<script>
	document.addEventListener("DOMContentLoaded", function () {
		const features = <?= json_encode( $features_with_content ) ?>;

		const baseLayer = L.tileLayer("<?= esc_js( $attributes['themeUrl'] ) ?>", {
			attribution: '<?= $attributes['themeAttribution'] ?>'
		});

		const colors = Object.fromEntries(features.map((f) => [f.label, f.color]));
		const postContents = Object.fromEntries(
			features
				.filter(f => f.postContent)
				.map((f) => [f.label, { title: f.postTitle, content: f.postContent }])
		);

		let geoJsonFeatures = features.map(f => JSON.parse(f.content));
		const geoJsonLayer = L.geoJSON(geoJsonFeatures, {
			style: function (geoJson) {
				return {
					color: colors[geoJson.properties.name],
					weight: 1,
					fillOpacity: 0.2,
					fillColor: colors[geoJson.properties.name]
				};
			},
			onEachFeature: function (feature, layer) {
				const featureName = feature.properties.name;
				const postData = postContents[featureName];

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

		const center = geoJsonLayer.getBounds().getCenter();
		const map = L.map("<?= $id ?>", {
			minZoom: 4,
            maxZoom: 10,
			center: center,
            layers: [baseLayer, geoJsonLayer],
			zoomSnap: 0.5,  // Allows zoom in 0.5 increments
		});
		map.scrollWheelZoom.disable();

		if (features.length > 0) {
			const bounds = geoJsonLayer.getBounds();

			map.fitBounds(bounds, {
				padding: [-10,-10]
            })
		} else {
			console.log("No features found")
		}

		const container = document.getElementById("<?= $id ?>");

		const observer = ResizeObserver && new ResizeObserver(function () {
			map.invalidateSize(true);
		});

		observer && observer.observe(container);
	});
</script>
