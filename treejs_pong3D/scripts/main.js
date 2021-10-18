
import * as THREE from '../three.js-dev/build/three.module.js';

import { OrbitControls } from '../three.js-dev/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from '../three.js-dev/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../three.js-dev/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../three.js-dev/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '../three.js-dev/examples/jsm/postprocessing/UnrealBloomPass.js';

import { GLTFLoader } from '../three.js-dev/examples/jsm/loaders/GLTFLoader.js';

import { init_score } from './score_init.js';
import { init_paddles } from './paddles_init.js';
import { init_ball } from './ball_init.js';
import { init_arena } from './arena_init.js';
import { init_audio } from './audio_init.js';
import { init_plane } from './plane_init.js';
import { moveSun } from './update_sun.js';
import { moveBall } from './Update_ball.js';
import { updateAudioVisualizer } from './update_audio.js';
import { updateplane } from './update_plane.js';

//Faire une structure de configuration (longueuer/largeur terrain / barres)

var config = {
	arena_w : 70,
	arena_w_2 : 0,
	arena_h : 50,
	arena_h_2 : 0,
	arena_size : 0,

	paddle_w : 1,
	paddle_h : 10,
	paddle_h_2 : 0
}
config.paddle_h_2 = config.paddle_h / 2;
config.arena_h_2 = config.arena_h / 2;
config.arena_w_2 = config.arena_w / 2;

//Camera =====
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 30;
camera.position.y = 38;
camera.rotation.x = -0.86;

//Render =====
const renderer = new THREE.WebGLRenderer( { antialias: true } );
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

//PostProcessing =====
const BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const params = {
	exposure: 1,
	bloomStrength: 2,
	bloomThreshold: 0,
	bloomRadius: 0,
	scene: "Scene with Glow"
};

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild( renderer.domElement );

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

const finalPass = new ShaderPass(
	new THREE.ShaderMaterial( {
		uniforms: {
			baseTexture: { value: null },
			bloomTexture: { value: bloomComposer.renderTarget2.texture }
		},
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		defines: {}
	} ), "baseTexture"
);
finalPass.needsSwap = true;
const width = window.innerWidth;
const height = window.innerHeight;
bloomComposer.setSize( width / 2 , height / 2);

const finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );


//Orbit Control (for spectators only) =====
const controls_mouse = new OrbitControls( camera, renderer.domElement );
controls_mouse.maxPolarAngle = Math.PI * 0.5;
controls_mouse.minDistance = 1;
controls_mouse.maxDistance = 100;
camera.rotation.x = -0.86;
//End of Orbit Control

//Window Resize =====
window.onresize = function ()
{
	const width = window.innerWidth;
	const height = window.innerHeight;

	if (height > width)
	{
		camera.fov = 75 * (height / width);
		camera.aspect = 1;
	}
	else
	{
		camera.fov = 75;
		camera.aspect = width / height;
	}
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );

	bloomComposer.setSize( width / 2, height / 2);
	finalComposer.setSize( width, height );
};

//Var Setup =====
var PI_s = 
{
	M_PI : Math.PI,
	M_2PI : 2 * Math.PI,
	M_PI_2 : Math.PI / 2,
	M_3PI_2 : 3 * (Math.PI / 2)
}

var Leftcol = 0x0ae0ff;
var Rightcol = 0xff13a5;

var audio_s = init_audio(scene, config, BLOOM_SCENE);

//Sun =====
var IncreaseBrightness = true;
var SunMesh;
var gltfloader = new GLTFLoader().setPath( 'models/' );

gltfloader.load( 'SunFull.gltf', function ( gltf ) 
{
	gltf.scene.traverse( function ( child ) 
	{
		if ( child.isMesh )
		{
			child.material.emissiveIntensity = 0.3;
			child.position.set(0, 11, - (config.arena_h_2 + 4));
		}
	} );
	SunMesh = gltf.scene;
	scene.add( gltf.scene );
} );

//Init fcts============================
var plane_s = init_plane(scene);

var score_s = init_score(scene, config);
updateScore(score_s);

let paddles_s = init_paddles(scene, config, Leftcol, Rightcol, BLOOM_SCENE);
let arena_s = init_arena(scene, config, BLOOM_SCENE);
let ball_s = init_ball(scene, BLOOM_SCENE);

//Keys =====
let controls =
{
	UpArrow : false,
	DownArrow : false,
	Wkey : false,
	Skey : false
}

const onKeyDown = function ( event )
{
	switch ( event.code )
	{
		case 'KeyW':
			controls.Wkey = true;
			break;
		case 'KeyS':
			controls.Skey = true;
			break;

		case 'ArrowUp':
			controls.UpArrow = true;
			break;
		case 'ArrowDown':
			controls.DownArrow = true;
			break;
	}
};

const onKeyUp = function ( event )
{
	switch ( event.code )
	{
		case 'KeyW':
			controls.Wkey = false;
			break;
		case 'KeyS':
			controls.Skey = false;
			break;

		case 'ArrowUp':
			controls.UpArrow = false;
			break;
		case 'ArrowDown':
			controls.DownArrow = false;
			break;
	}
};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

//Stars
const vertices = [];

for ( let i = 0; i < 1000; i ++ ) {

	const x = THREE.MathUtils.randFloatSpread( 500 );
	const y = THREE.MathUtils.randFloatSpread( 500 );
	const z = THREE.MathUtils.randFloatSpread( 500 );

	if (x < config.arena_w_2 + 10 && x > - config.arena_w_2 - 10 && y > -10 && y < 60 && z < config.arena_h_2 + 10 && z > - config.arena_h_2 - 10)
		i--;
	else
		vertices.push( x, y, z );

}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

const material = new THREE.PointsMaterial( { color: 0x888888 } );

const points = new THREE.Points( geometry, material );

scene.add( points );

//Fireworks

var firework_n = 150;

function sleep(ms)	{
	return new Promise(resolve => setTimeout(resolve, ms));
	}

async function setFirework_pos(fireworks, x, y, z, elevation)
{
	var positions = fireworks.geometry.attributes.position.array;

	var x, y, z;
	var	currentIndex = 0;

	for (let j = 0; j < elevation; j++)
	{
		for ( let i = 0; i < firework_n * 3; i ++ ) 
		{
			positions[ currentIndex++ ] = x;
			if (currentIndex == 1 && j > 1)
				positions[ currentIndex++ ] = y - 2;
			else if (currentIndex == 4 && j > 3)
				positions[ currentIndex++ ] = y - 4;
			else
				positions[ currentIndex++ ] = y;
			
			// positions[currentIndex - 6] = y - 2;
			positions[ currentIndex++ ] = z;
		}
		y += 1;
		currentIndex = 0;
		fireworks.geometry.attributes.position.needsUpdate = true;
		await sleep(30);
	}
	y -= 1;
	positions[1] = y;
	positions[4] = y - 2;
	fireworks.geometry.attributes.position.needsUpdate = true;
	await sleep(30);
	positions[4] = y;
	fireworks.geometry.attributes.position.needsUpdate = true;
	//Explode Here
}

function launchFirework(x, y, z, elevation)
{
	// const firework_v = [];

	// firework_v.push(x, y, z);
	const firework_geo = new THREE.BufferGeometry();
	var firework_pos = new Float32Array( firework_n * 3 );
	firework_geo.setAttribute( 'position', new THREE.BufferAttribute( firework_pos, 3 ) );
	const firework_m = new THREE.PointsMaterial( { color: 0x888888 } );

	const fireworks = new THREE.Points( firework_geo, firework_m );

	scene.add(fireworks);
	setFirework_pos(fireworks, x, y, z, elevation);

	// while (fireworks[0].position.x < x + 20)
	// 	fireworks[0].position.x += 0.05;
}

launchFirework(0, 0, 0, 25);



//La game loop ======
const animate = function ()
{
	requestAnimationFrame( animate );
	moveBall(ball_s, paddles_s, arena_s, score_s, scene, PI_s, config, BLOOM_SCENE);
	updateAudioVisualizer(audio_s);
	IncreaseBrightness = moveSun(SunMesh, IncreaseBrightness);
	updateplane(plane_s, audio_s);

	if (controls.UpArrow == true)
	{
		if (paddles_s.bar_right.position.z - config.paddle_h_2 > arena_s.top.position.z + 1.1)
		{
	    	paddles_s.bar_right.position.z -= 0.5;
			paddles_s.bar_right_out.position.z = paddles_s.bar_right.position.z;
		}
	}
	if (controls.Wkey == true)
	{
		if (paddles_s.bar_left.position.z - config.paddle_h_2 > arena_s.top.position.z + 1.1)
		{
	    	paddles_s.bar_left.position.z -= 0.5;
			paddles_s.bar_left_out.position.z = paddles_s.bar_left.position.z;
		}
	}
	if (controls.DownArrow == true)
	{
		if (paddles_s.bar_right.position.z + config.paddle_h_2 < arena_s.bot.position.z - 1.1)
		{
			paddles_s.bar_right.position.z += 0.5;
			paddles_s.bar_right_out.position.z = paddles_s.bar_right.position.z;
		}
	}
	if (controls.Skey == true)
	{
		if (paddles_s.bar_left.position.z + config.paddle_h_2 < arena_s.bot.position.z - 1.1)
		{
			paddles_s.bar_left.position.z += 0.5;
			paddles_s.bar_left_out.position.z = paddles_s.bar_left.position.z;
		}
	}
	bloomComposer.render();
	finalComposer.render();
};
animate();