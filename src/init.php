<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


function my_guten_plugin_cgb_block_assets() { // phpcs:ignore

	wp_register_script(
		'my_guten_plugin-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array(
			'wp-blocks',
			'wp-components',
			'wp-data',
			'wp-element',
			'wp-editor',
			'wp-edit-post',
			'wp-i18n',
		), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	wp_enqueue_script('my_guten_plugin-cgb-block-js');

	register_post_meta( '', 'post_relationship', array(
		'show_in_rest' => true,
		'single'       => true,
		'type'         => 'number',
	) );
}

// Hook: Block assets.
add_action( 'init', 'my_guten_plugin_cgb_block_assets' );
