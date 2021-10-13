import * as THREE from '../three.js-dev/build/three.module.js';

export function init_paddles(scene, config, Leftcol, Rightcol, BLOOM_SCENE)
{
	const geometry_bar = new THREE.BoxGeometry(1, 1, config.paddle_h);

	const material_bar_left = new THREE.MeshStandardMaterial( { color: 0xffffff } );
	const bar_left_msh = new THREE.Mesh( geometry_bar, material_bar_left );

	const material_bar_right = new THREE.MeshStandardMaterial( { color: 0xffffff } );
	const bar_right_msh = new THREE.Mesh( geometry_bar, material_bar_right );

	const outline_geometry_bar = new THREE.BoxGeometry(1.2, 1.2, config.paddle_h + 0.2);
	var LeftoutlineMaterial= new THREE.MeshBasicMaterial( { color: Leftcol, side: THREE.BackSide } );
	var LeftoutlineMesh = new THREE.Mesh( outline_geometry_bar, LeftoutlineMaterial );
	LeftoutlineMesh.scale.multiplyScalar(1.05);
	LeftoutlineMesh.layers.enable( BLOOM_SCENE );
	scene.add( LeftoutlineMesh );

	var RightoutlineMaterial= new THREE.MeshBasicMaterial( { color: Rightcol, side: THREE.BackSide } );
	var RightoutlineMesh = new THREE.Mesh( outline_geometry_bar, RightoutlineMaterial );
	RightoutlineMesh.scale.multiplyScalar(1.05);
	RightoutlineMesh.layers.enable( BLOOM_SCENE );
	scene.add( RightoutlineMesh );

	var Left_bar_pos_x = - (config.arena_w / 2 - (config.paddle_h_2 + 1));
	bar_left_msh.position.x = Left_bar_pos_x ;
	LeftoutlineMesh.position.x = bar_left_msh.position.x;

	var Right_bar_pos_x = config.arena_w / 2 - (config.paddle_h_2 + 1);
	bar_right_msh.position.x = Right_bar_pos_x;
	RightoutlineMesh.position.x = bar_right_msh.position.x;
	scene.add( bar_left_msh, bar_right_msh, LeftoutlineMesh, RightoutlineMesh);

	let paddles_s = {
		bar_left : bar_left_msh,
		bar_left_out : LeftoutlineMesh,
		bar_right : bar_right_msh,
		bar_right_out : RightoutlineMesh,
		Lbar_pos_x : Left_bar_pos_x,
		Rbar_pos_x : Right_bar_pos_x,
		left_col : Leftcol,
		right_col : Rightcol
	}
	return (paddles_s);
}