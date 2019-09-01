/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

//import './block/block.js';

/**
 * WordPress dependencies
 */

const { Fragment } = wp.element;
const { PluginSidebar, PluginSidebarMoreMenuItem, PluginPrePublishPanel } = wp.editPost;
const { registerPlugin } = wp.plugins;
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { Panel, PanelBody, PanelRow, SelectControl } = wp.components;
const { PluginDocumentSettingPanel } = wp.editPost;

const postmeta_key = 'post_relationship';

const PostSelector = ( ( { postId, posts, setPostId } ) => {
	return (
		<SelectControl
			name={ 'post-relationship' }
			label={ __( 'Post', 'post-relationship' ) }
			value={ postId }
			options={ [
				{
					label: __( 'None' ),
					value: null,
				},
				...posts.map( ( { id, title } ) => {
					return {
						label: title.rendered,
						value: id,
					};
				} ) ] }
			onChange={ ( id ) => {
				setPostId( { id } );
			} }
		/>
	);
} );

const AuthorSelector = compose( [
	withSelect(
		( select ) => {
			const { getEntityRecords } = select( 'core' );
			const { getEditedPostAttribute } = select( 'core/editor' );
			const s = getEntityRecords( 'postType', 'post', { per_page: - 1 } ) || [];
			const meta = getEditedPostAttribute( 'meta' ) || {};
			return {
				posts: s,
				postId: meta[ postmeta_key ]
			};

		}
	),
	withDispatch( ( dispatch ) => {
		return {
			setPostId: ( { id } ) =>
				dispatch( 'core/editor' ).editPost(
					{
						meta: { [ postmeta_key ]: parseInt( id ) }
					}
				),
		};
	} )
] )
( PostSelector );

const PluginPanel = () => (
	<PanelBody
		title="Post Relationship"
		initialOpen={ true }
	>
		<PanelRow>
			<AuthorSelector />
		</PanelRow>
	</PanelBody>
);

const Component = () => (
	<Fragment>
		<PluginSidebarMoreMenuItem target={ 'post-relationship' }>
			{ __( 'Post' ) }
		</PluginSidebarMoreMenuItem>
		<PluginSidebar
			name={ 'post-relationship' }
			title={ __( 'Post', 'post-relationship' ) }
		>
			<Panel>
				<PluginPanel />
			</Panel>

		</PluginSidebar>

		<PluginPrePublishPanel
			title="Post Relationship"
			initialOpen={ true }>
			<PanelRow>
				<AuthorSelector />
			</PanelRow>
		</PluginPrePublishPanel>
	</Fragment>
);


if ( PluginDocumentSettingPanel ) {
	registerPlugin( 'post-relationship', {
		icon: 'admin-post',
		render: () => (
			<Fragment>
				<PluginDocumentSettingPanel className="my-document-setting-plugin" title="My Panel">
					<AuthorSelector />
				</PluginDocumentSettingPanel>
				<Component />
			</Fragment>

		)
	} )
}else {

	registerPlugin( 'post-relationship', {
		icon: 'admin-post',
		render: Component,
	} );
}


