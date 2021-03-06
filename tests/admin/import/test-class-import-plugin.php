<?php
/**
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Tests for our wrapper import class.
 */
class WPSEO_Import_Plugin_Test extends WPSEO_UnitTestCase {

	/**
	 * @covers WPSEO_Import_Plugin::__construct
	 * @covers WPSEO_Import_Plugin::complete_msg
	 */
	public function test_detect_no_data() {
		$importer = new WPSEO_Import_Plugin( new WPSEO_Import_AIOSEO, 'detect' );

		$this->assertEquals( false, $importer->status->status );
		$this->assertEquals( 'All In One SEO Pack data not found.', $importer->status->get_msg() );

	}

	/**
	 * @covers WPSEO_Import_Plugin::__construct
	 * @covers WPSEO_Import_Plugin::complete_msg
	 */
	public function test_detect_with_data() {
		$this->setup_post();
		$importer = new WPSEO_Import_Plugin( new WPSEO_Import_AIOSEO, 'detect' );

		$this->assertEquals( true, $importer->status->status );
		$this->assertEquals( 'All In One SEO Pack data found.', $importer->status->get_msg() );
	}

	/**
	 * @covers WPSEO_Import_Plugin::__construct
	 * @covers WPSEO_Import_Plugin::complete_msg
	 */
	public function test_import_no_data() {
		$importer = new WPSEO_Import_Plugin( new WPSEO_Import_AIOSEO, 'import' );

		$this->assertEquals( false, $importer->status->status );
		$this->assertEquals( 'All In One SEO Pack data not found.', $importer->status->get_msg() );

	}

	/**
	 * @covers WPSEO_Import_Plugin::__construct
	 * @covers WPSEO_Import_Plugin::complete_msg
	 */
	public function test_import_with_data() {
		$this->setup_post();
		$importer = new WPSEO_Import_Plugin( new WPSEO_Import_AIOSEO, 'import' );

		$this->assertEquals( true, $importer->status->status );
		$this->assertEquals( 'All In One SEO Pack data successfully imported.', $importer->status->get_msg() );
	}

	/**
	 * @covers WPSEO_Import_Plugin::__construct
	 * @covers WPSEO_Import_Plugin::complete_msg
	 */
	public function test_cleanup_no_data() {
		$importer = new WPSEO_Import_Plugin( new WPSEO_Import_AIOSEO, 'cleanup' );

		$this->assertEquals( false, $importer->status->status );
		$this->assertEquals( 'All In One SEO Pack data not found.', $importer->status->get_msg() );

	}

	/**
	 * @covers WPSEO_Import_Plugin::__construct
	 * @covers WPSEO_Import_Plugin::complete_msg
	 */
	public function test_cleanup_with_data() {
		$this->setup_post();
		$importer = new WPSEO_Import_Plugin( new WPSEO_Import_AIOSEO, 'cleanup' );

		$this->assertEquals( true, $importer->status->status );
		$this->assertEquals( 'All In One SEO Pack data successfully removed.', $importer->status->get_msg() );
	}

	/**
	 * Sets up a test post
	 *
	 * @return int $post_id
	 */
	private function setup_post() {
		$post_id = $this->factory()->post->create();
		update_post_meta( $post_id, '_aioseop_title', 'Test title' );
		update_post_meta( $post_id, '_aioseop_description', 'Test description' );

		return $post_id;
	}
}
