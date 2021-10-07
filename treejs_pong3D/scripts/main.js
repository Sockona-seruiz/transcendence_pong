
import * as THREE from '../three.js-dev/build/three.module.js';

import { GUI } from '../three.js-dev/examples/jsm/libs/dat.gui.module.js';
import Stats from '../three.js-dev/examples/jsm/libs/stats.module.js';

import { OrbitControls } from '../three.js-dev/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from '../three.js-dev/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../three.js-dev/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../three.js-dev/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '../three.js-dev/examples/jsm/postprocessing/UnrealBloomPass.js';

import { BasisTextureLoader } from '../three.js-dev/examples/jsm/loaders/BasisTextureLoader.js';

import { FBXLoader } from '../three.js-dev/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from '../three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../three.js-dev/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from '../three.js-dev/examples/jsm/utils/RoughnessMipmapper.js';

import { init_score } from './score_init.js';
import { init_paddles } from './paddles_init.js';
import { init_ball } from './ball_init.js';
import { init_arena } from './arena_init.js';



	//(FOV, Aspect Ratio, Début distance de rendu, fin)
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	//Renderer
	const renderer = new THREE.WebGLRenderer( { antialias: true } );
	const scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

//===================================================================================================================================================
const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const params = {
	exposure: 1,
	bloomStrength: 2,
	bloomThreshold: 0,
	bloomRadius: 0,
	scene: "Scene with Glow"
};

const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
const materials = {};

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild( renderer.domElement );

// const controls = new OrbitControls( camera, renderer.domElement );
// controls.maxPolarAngle = Math.PI * 0.5;
// controls.minDistance = 1;
// controls.maxDistance = 100;
// controls.addEventListener( 'change', render );

// scene.add( new THREE.AmbientLight( 0x404040 ) );

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

const mouse = new THREE.Vector2();

window.onresize = function () {

	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );

	bloomComposer.setSize( width / 2, height / 2);
	finalComposer.setSize( width, height );

	// render();

};

//=======================================================================================================================================================


			// var	Left_bar_pos_x = 0;
			// var	Left_bar_pos_z = 0;
			// var Right_bar_pos_x = 0;
			// var Right_bar_pos_z = 0;

			var M_PI = Math.PI;
			var M_2PI = 2 * Math.PI;
			var M_PI_2 = Math.PI / 2;
			var M_3PI_2 = 3 * (Math.PI / 2);


			var PosDiff = 0;
			var LeftScore = 0;
			var RightScore = 0;
			
			var Leftcol = 0x0ae0ff;
			var Rightcol = 0xff13a5;
			var Floorcol = 0x8108ff;
			var UnerFloor = 0x8108ff;
			
			var Barcol = 0xffffff;
			// var Barcol = 0xff8a14;

//Audio ==========================================================


var audiolist = [];
audiolist.unshift("../sounds/far-cry-3-blood-dragon-ost-power-core-track-07.mp3");
audiolist.unshift('../sounds/dryskill-burnout-dubstep-synthwave.mp3');
audiolist.unshift('../sounds/far-cry-3-blood-dragon-ost-omega-force-track-16.mp3');
audiolist.unshift('../sounds/far-cry-3-blood-dragon-ost-sloans-assault-track-10.mp3');
audiolist.unshift('../sounds/legend-of-zelda-theme-but-its-synthwave.mp3');
audiolist.unshift('../sounds/mdk-press-start-free-download.mp3');
audiolist.unshift('../sounds/main_song.mp3');
audiolist.unshift('../sounds/miami-nights-1984-accelerated.mp3');
audiolist.unshift('../sounds/powercyan-plutocracy-ephixa-remix-synthwave-dubstep.mp3');
audiolist.unshift('../sounds/skrillex-bangarang-feat-sirah-official-music-video.mp3');
audiolist.unshift('../sounds/skrillex-first-of-the-year-equinox.mp3');
audiolist.unshift('../sounds/waterflame-blast-processing.mp3');
audiolist.unshift('../sounds/dirty-androids-midnight-lady.mp3');

const fftSize = 32;

const audioListener = new THREE.AudioListener();
const audio = new THREE.Audio(audioListener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load(audiolist[Math.floor(Math.random() * audiolist.length)], (buffer) => {
    audio.setBuffer(buffer);
    audio.setLoop(true);
    audio.play();
});

// About fftSize https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
const analyser = new THREE.AudioAnalyser(audio, fftSize);

var data = analyser.getFrequencyData();
var averageFreq = analyser.getAverageFrequency();

var AudioMeshArray_Left = [];
var AudioMeshArray_Right = [];
var AudioMeshArray_outline_Left = [];
var AudioMeshArray_outline_Right = [];
const geometry_audio = new THREE.BoxGeometry(1, 1, 1);
const material_audio = new THREE.MeshBasicMaterial( { color: 0x000000 } );

const geometry_audio_outline = new THREE.BoxGeometry(1.2, 1.2, 1.2);

	var leftbar_loader = new THREE.TextureLoader();
	var leftbar_texture = leftbar_loader.load( 'textures/gradient_blue_pink.png' );

	const leftmaterial_audio_outline= new THREE.MeshPhongMaterial({
		side: THREE.BackSide,
		wireframe: false,
		emissive : 0xffffff,
		emissiveIntensity : 0.5,
		emissiveMap : leftbar_texture
    });

for (let i = 0, len = data.length; i < len; i++)
{
	AudioMeshArray_Left.unshift(new THREE.Mesh( geometry_audio, material_audio ));
	AudioMeshArray_Right.unshift(new THREE.Mesh( geometry_audio, material_audio ));
	AudioMeshArray_Left[0].position.z = i * 2.65 - 20;
	AudioMeshArray_Right[0].position.z = i * 2.65 - 20;
	AudioMeshArray_Left[0].position.x = -32;
	AudioMeshArray_Right[0].position.x = 32;
	AudioMeshArray_Left[0].position.y = -2;
	AudioMeshArray_Right[0].position.y = -2;

	AudioMeshArray_outline_Left.unshift(new THREE.Mesh( geometry_audio_outline, leftmaterial_audio_outline ));
	AudioMeshArray_outline_Right.unshift(new THREE.Mesh( geometry_audio_outline, leftmaterial_audio_outline ));
	AudioMeshArray_outline_Left[0].layers.enable( BLOOM_SCENE );
	AudioMeshArray_outline_Right[0].layers.enable( BLOOM_SCENE );
	AudioMeshArray_outline_Left[0].position.z = i * 2.65 - 20;
	AudioMeshArray_outline_Right[0].position.z = i * 2.65 - 20;
	AudioMeshArray_outline_Left[0].position.x = -32;
	AudioMeshArray_outline_Right[0].position.x = 32;
	AudioMeshArray_outline_Left[0].position.y = -2;
	AudioMeshArray_outline_Right[0].position.y = -2;

	scene.add( AudioMeshArray_Left[0], AudioMeshArray_Right[0], AudioMeshArray_outline_Left[0], AudioMeshArray_outline_Right[0]);
}

let	audio_s = {
	AudioMeshArray_L : AudioMeshArray_Left,
	AudioMeshArray_R : AudioMeshArray_Right,
	AudioMeshArray_OL : AudioMeshArray_outline_Left,
	AudioMeshArray_OR : AudioMeshArray_outline_Right,

	avgFreq : averageFreq,
	FrqData : data,
	calc : 0,
	calc_2 : 0,

	lowerHalfArray : 0,
	lowerAvg : 0,
	lowerAvgFr : 0,
	lowerMidArray : 0,
	lowerMidAvg : 0,
	lowerMidAvgFr : 0,
	upperMidArray : 0,
	upperMidAvg : 0,
	upperMidAvgFr : 0,
	upperHalfArray : 0,
	upperAvg : 0,
	upperAvgFr : 0
}

//Sun=========================================================================

	var SunMesh;

		var gltfloader = new GLTFLoader().setPath( 'models/' );
		
		gltfloader.load( 'SunFull.gltf', function ( gltf ) {
		gltf.scene.traverse( function ( child ) {
			if ( child.isMesh ) {
			child.material.emissiveIntensity = 0.3;
			child.position.set(0, 11, -24);
			}
		} );
		SunMesh = gltf.scene;
		scene.add( gltf.scene );
		} );

//Plane =========================================================================


var planeGeometry = new THREE.PlaneGeometry(600, 300, 40, 20);
	var planeMaterial = new THREE.MeshPhongMaterial({
		color: Floorcol,
		side: THREE.DoubleSide,
		wireframe: true,
		emissive : Floorcol,
		emissiveIntensity : 2.5,
	});
	var UnderplaneGeometry = new THREE.PlaneGeometry(700, 350, 2, 2);

    var loader = new THREE.TextureLoader();
    var texture = loader.load( 'textures/gradient_blue_pink.png' );

	var UnderplaneMaterial = new THREE.MeshPhongMaterial({
		side: THREE.DoubleSide,
		wireframe: false,
		emissive : Floorcol,
		emissiveIntensity : 0.085,
		emissiveMap : texture
    });

    
	var plane_msh = new THREE.Mesh(planeGeometry, planeMaterial);
    var Underplane_msh = new THREE.Mesh(UnderplaneGeometry, UnderplaneMaterial);
	plane_msh.rotation.x += M_PI_2;
	Underplane_msh.rotation.x += M_PI_2;
	plane_msh.position.set(0, -10, -100);
	Underplane_msh.position.set(0, -18, -100);
	scene.add(plane_msh, Underplane_msh);

	var plane_seed_rd = [];
	for(let i = 0; i < plane_msh.geometry.attributes.position.count; i++){
		plane_seed_rd.unshift(Math.random() * (1 + 1) - 1);
	}

	let plane_s = {
		plane : plane_msh,
		under_plane : Underplane_msh,
		plane_seed : plane_seed_rd,

		vertices : 0
	}

//Init fcts============================
let score_s = init_score(scene);
updateScore(0, 0, score_s);

let paddles_s = init_paddles(scene, Leftcol, Rightcol, BLOOM_SCENE);
let arena_s = init_arena(scene, BLOOM_SCENE);
let ball_s = init_ball(scene, BLOOM_SCENE);
//=====================================

	camera.position.z = 28;
	camera.position.y = 38;

	camera.rotation.x = -0.86;

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



function resetParams(x)
{
	ball_s.ball.position.x = 0;
	ball_s.ball.position.z = 0;
	ball_s.ball_outline.position.x = 0;
	ball_s.ball_outline.position.z = 0;
	ball_s.trainee_msh[0].material.color.setHex(0xffffff);
	ball_s.ball_outline.material.color.setHex(0xffffff);
	ball_s.light.color.setHex(0xffffff);
	ball_s.pos_history_x.unshift(0);
	ball_s.pos_history_z.unshift(0);
	ball_s.pos_history_x.pop();
	ball_s.pos_history_z.pop();
	paddles_s.bar_left.position.x = paddles_s.Lbar_pos_x;
	paddles_s.bar_left.position.z = 0;
	paddles_s.bar_left_out.position.x = paddles_s.bar_left.position.x;
	paddles_s.bar_left_out.position.z = paddles_s.bar_left.position.z;
	paddles_s.bar_right.position.x = paddles_s.Rbar_pos_x;
	paddles_s.bar_right.position.z = 0;
	paddles_s.bar_right_out.position.x = paddles_s.bar_right.position.x;
	paddles_s.bar_right_out.position.z = paddles_s.bar_right.position.z;
	if (x == 0)
		ball_s.BallAngle = Math.PI;
	else
		ball_s.BallAngle = M_2PI;
	ball_s.Speed = ball_s.BaseSpeed;
	ball_s.LeftHit = 0;
	ball_s.RightHit = 0;
}

			//====================================MOVE BALL==========================================
			//Faire plusieurs mesh et dessiner des carrés entre les points de l'historique
			//15 de profondeur = 14 carrés

			function moveBall()
			{
				ball_s.pos_history_x.unshift(ball_s.ball.position.x);
				ball_s.pos_history_z.unshift(ball_s.ball.position.z);
				ball_s.pos_history_x.pop();
				ball_s.pos_history_z.pop();

				if (ball_s.trainee_msh[ball_s.history_depth] != null)
				{
					scene.remove(ball_s.trainee_msh[ball_s.history_depth]);
					ball_s.trainee_msh.pop();
				}
				ball_s.trainee = new THREE.Shape();

				ball_s.trainee.moveTo(ball_s.pos_history_x[0], ball_s.pos_history_z[0] - 0.5);
					
				ball_s.trainee.lineTo(ball_s.pos_history_x[1], ball_s.pos_history_z[1] - 0.5);
				ball_s.trainee.lineTo(ball_s.pos_history_x[1], ball_s.pos_history_z[1] + 0.5);
				ball_s.trainee.lineTo(ball_s.pos_history_x[0], ball_s.pos_history_z[0] + 0.5);

				ball_s.old_trainee_pos_x = ball_s.pos_history_x[0 + 1];
				ball_s.old_trainee_pos_z = ball_s.pos_history_z[0 + 1] + 0.25;
				ball_s.trainee_geo = new THREE.ShapeGeometry(ball_s.trainee);
				ball_s.trainee_msh.unshift (new THREE.Mesh(ball_s.trainee_geo, ball_s.material_msh));
				ball_s.trainee_msh[0].rotation.x += M_PI_2;
				ball_s.trainee_msh[0].layers.enable( BLOOM_SCENE );
				scene.add(ball_s.trainee_msh[0]);

				
				ball_s.ball.position.x += Math.cos(ball_s.BallAngle) * ball_s.Speed;
				ball_s.ball.position.z += (Math.sin(ball_s.BallAngle) * -1) * ball_s.Speed;
				ball_s.ball_outline.position.x = ball_s.ball.position.x;
				ball_s.ball_outline.position.z = ball_s.ball.position.z;
				ball_s.light.position.x = ball_s.ball.position.x;
				ball_s.light.position.z = ball_s.ball.position.z;
				//  Est dans la barre de gauche en X                 (est dans la barre en Y)
				//Une barre fait 8 de hauteur
				if (ball_s.ball.position.x >= paddles_s.bar_left.position.x - 1 && ball_s.ball.position.x <= paddles_s.bar_left.position.x + 1 && (ball_s.ball.position.z - 0.5 <= paddles_s.bar_left.position.z + 4 && ball_s.ball.position.z + 0.5 >= paddles_s.bar_left.position.z - 4))
				{
					if (ball_s.LeftHit == 0)
					{
						ball_s.LeftHit = 1;
						PosDiff = ball_s.ball.position.z - paddles_s.bar_left.position.z;
						ball_s.BallAngle = Math.PI - ball_s.BallAngle - (PosDiff / 30);
						if (ball_s.BallAngle > M_2PI)
							ball_s.BallAngle -= M_2PI;
						else if (ball_s.BallAngle < 0)
							ball_s.BallAngle += M_2PI;
						if (ball_s.Speed < ball_s.SpeedLimit)
							ball_s.Speed += ball_s.SpeedIncrease;
						ball_s.trainee_msh[0].material.color.setHex(Leftcol);
						ball_s.ball_outline.material.color.setHex(Leftcol);
						ball_s.light.color.setHex(Leftcol);
					}
					ball_s.RightHit = 0;
				}

				if (ball_s.ball.position.x >= paddles_s.bar_right.position.x - 1 && ball_s.ball.position.x <= paddles_s.bar_right.position.x + 1 && (ball_s.ball.position.z - 0.5 <= paddles_s.bar_right.position.z + 4 && ball_s.ball.position.z + 0.5 >= paddles_s.bar_right.position.z - 4))
				{
					if (ball_s.RightHit == 0)
					{
					ball_s.RightHit = 1;
					PosDiff = ball_s.ball.position.z - paddles_s.bar_right.position.z;
					ball_s.BallAngle = Math.PI - ball_s.BallAngle + (PosDiff/30);
					if (ball_s.BallAngle > M_2PI)
						ball_s.BallAngle -= M_2PI;
					else if (ball_s.BallAngle < 0)
						ball_s.BallAngle += M_2PI;
					if (ball_s.Speed < ball_s.SpeedLimit)
						ball_s.Speed += ball_s.SpeedIncrease;
					ball_s.trainee_msh[0].material.color.setHex(Rightcol);
					ball_s.ball_outline.material.color.setHex(Rightcol);
					ball_s.light.color.setHex(Rightcol);
					}
					ball_s.LeftHit = 0;
				}

				if (ball_s.ball.position.z <= arena_s.top.position.z + 1 || ball_s.ball.position.z >= arena_s.bot.position.z - 1)
				{
					ball_s.BallAngle = M_2PI - ball_s.BallAngle;
					if (ball_s.BallAngle > M_2PI)
						ball_s.BallAngle -= M_2PI;
					else if (ball_s.BallAngle < 0)
						ball_s.BallAngle += M_2PI;
				}

				if (ball_s.ball.position.x <= arena_s.left.position.x + 1)
				{
					RightScore += 1;
					updateScore(LeftScore, RightScore, score_s);
					resetParams(0);
				}

				if (ball_s.ball.position.x >= arena_s.right.position.x - 1)
				{
					LeftScore += 1;
					updateScore(LeftScore, RightScore, score_s);
					resetParams(1);
				}
			}

			function updateAudioVisualizer()
			{
				let j = 0;
				for (let i = audio_s.FrqData.length - 1, len = 0; i >= len; i--)
				{
					audio_s.calc =  audio_s.avgFreq / 120 + audio_s.FrqData[j] / 40;
					audio_s.calc_2 = audio_s.calc / 2;
					audio_s.AudioMeshArray_L[i].scale.set(1, audio_s.calc, 1);
					audio_s.AudioMeshArray_L[i].position.y = audio_s.calc_2;
					audio_s.AudioMeshArray_R[i].scale.set(1, audio_s.calc, 1);
					audio_s.AudioMeshArray_R[i].position.y = audio_s.calc_2;
					audio_s.AudioMeshArray_OL[i].scale.set(1, audio_s.calc, 1);
					audio_s.AudioMeshArray_OL[i].position.y = audio_s.calc_2;
					audio_s.AudioMeshArray_OR[i].scale.set(1, audio_s.calc, 1);
					audio_s.AudioMeshArray_OR[i].position.y = audio_s.calc_2;
					j++;
				}
			}

		var IncreaseBrightness = true;

	function moveSun()
	{
		if (SunMesh)
		{
			SunMesh.traverse( function ( child ) {
				if ( child.isMesh )
				{
					if (IncreaseBrightness == true)
					{
						child.material.emissiveIntensity += 0.002;
						if (child.material.emissiveIntensity >= 0.75)
							IncreaseBrightness = false;
					}
					else
					{
						child.material.emissiveIntensity -= 0.002;
						if (child.material.emissiveIntensity <= 0.25)
							IncreaseBrightness = true;
					
					}
			}
		} );
		}
	}
	
function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

			//La game loop
	const animate = function ()
	{
		requestAnimationFrame( animate );
		moveBall();
		audio_s.FrqData = analyser.getFrequencyData();
		audio_s.avgFreq = analyser.getAverageFrequency();
		audio_s.lowerHalfArray = audio_s.FrqData.slice(0, (audio_s.FrqData.length/4) - 1);
		audio_s.lowerAvg = avg(audio_s.lowerHalfArray);
		audio_s.lowerAvgFr = audio_s.lowerAvg / audio_s.lowerHalfArray.length;
		audio_s.lowerMidArray = audio_s.FrqData.slice((audio_s.FrqData.length/4) - 1, (2 * audio_s.FrqData.length/4) - 1);
		audio_s.lowerMidAvg = avg(audio_s.lowerMidArray);
		audio_s.lowerMidAvgFr = audio_s.lowerMidAvg / audio_s.lowerMidArray.length;
		audio_s.upperMidArray = audio_s.FrqData.slice((2 * audio_s.FrqData.length/4) - 1, (3 * audio_s.FrqData.length/4) - 1);
		audio_s.upperMidAvg = avg(audio_s.upperMidArray);
		audio_s.upperMidAvgFr = audio_s.upperMidAvg / audio_s.upperMidArray.length;
      	audio_s.upperHalfArray = audio_s.FrqData.slice( (3 * audio_s.FrqData.length/4) - 1, audio_s.FrqData.length - 1);
		audio_s.upperAvg = avg(audio_s.upperHalfArray);
		audio_s.upperAvgFr = audio_s.upperAvg / audio_s.upperHalfArray.length;
		updateAudioVisualizer();
		moveSun();

		plane_s.vertices = plane_s.plane.geometry.attributes.position.array;
		//Lower Average = les basses (aka les traits du centre)
		for(let i = 0; i < plane_s.plane.geometry.attributes.position.count; i++){
			plane_s.vertices[ i * 3 + 2 ] = ((audio_s.upperAvgFr / 10) + (- audio_s.upperMidAvgFr / 16) + (- audio_s.lowerMidAvgFr / 14) + (audio_s.lowerAvgFr / 12)) * plane_s.plane_seed[i];
		}
		plane_s.plane.geometry.attributes.position.needsUpdate = true;
		plane_s.plane.geometry.verticesNeedUpdate = true;
		plane_s.plane.geometry.normalsNeedUpdate = true;
		plane_s.plane.geometry.computeVertexNormals();			
		if (controls.UpArrow == true)
		{
			if (paddles_s.bar_right.position.z - 4 > arena_s.top.position.z + 0.5)
			{
    	    	paddles_s.bar_right.position.z -= 0.5;
				paddles_s.bar_right_out.position.z = paddles_s.bar_right.position.z;
			}
		}
		if (controls.Wkey == true)
		{
			if (paddles_s.bar_left.position.z - 4 > arena_s.top.position.z + 0.5)
			{
    	    	paddles_s.bar_left.position.z -= 0.5;
				paddles_s.bar_left_out.position.z = paddles_s.bar_left.position.z;
			}
		}
		if (controls.DownArrow == true)
		{
			if (paddles_s.bar_right.position.z + 4 < arena_s.bot.position.z - 0.5)
    	    {
				paddles_s.bar_right.position.z += 0.5;
				paddles_s.bar_right_out.position.z = paddles_s.bar_right.position.z;
			}
		}
		if (controls.Skey == true)
		{
			if (paddles_s.bar_left.position.z + 4 < arena_s.bot.position.z - 0.5)
			{
				paddles_s.bar_left.position.z += 0.5;
				paddles_s.bar_left_out.position.z = paddles_s.bar_left.position.z;
			}
		}
		bloomComposer.render();
		finalComposer.render();
	};

	animate();