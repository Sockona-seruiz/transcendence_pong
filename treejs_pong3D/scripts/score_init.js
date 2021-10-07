import * as THREE from '../three.js-dev/build/three.module.js';

export function init_score(scene)
{
	const x = 0, y = 0;

	const rightrithcrystal = [];

	const crystalshape = new THREE.Shape();

	crystalshape.moveTo( x + 5, y );
	crystalshape.lineTo(x + 5 - 0.5, y - 0.5);
	crystalshape.lineTo(x + 0.5, y - 0.5);
	crystalshape.lineTo(0, 0);

	const ONcrystalmaterialleft = new THREE.MeshBasicMaterial( { color: 0x42e7ff } );
	const ONcrystalmaterialright = new THREE.MeshBasicMaterial( { color: 0xff5ec3 } );
	const OFFcrystalmaterial = new THREE.MeshBasicMaterial( { color: 0x040404 } );

	const crystalgeometry = new THREE.ShapeGeometry( crystalshape );
	const crystalmeshTop = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
	crystalmeshTop.position.set(0, 19.5, 10);
	rightrithcrystal.unshift(crystalmeshTop);

	const crystalmeshTopLeft = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
	crystalmeshTopLeft.rotation.z = Math.PI / 2;
	crystalmeshTopLeft.position.set(0, 14, 10);
	rightrithcrystal.unshift(crystalmeshTopLeft);

	const crystalmeshTopRight = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
	crystalmeshTopRight.rotation.z = -Math.PI / 2;
	crystalmeshTopRight.position.set(5, 19, 10);
	rightrithcrystal.unshift(crystalmeshTopRight);

	const crystalmeshBotLeft = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
	crystalmeshBotLeft.rotation.z = Math.PI / 2;
	crystalmeshBotLeft.position.set(0, 8, 10);
	rightrithcrystal.unshift(crystalmeshBotLeft);

	const crystalmeshBotRight = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
	crystalmeshBotRight.rotation.z = - Math.PI / 2;
	crystalmeshBotRight.position.set(5, 13, 10);
	rightrithcrystal.unshift(crystalmeshBotRight);

	const crystalmeshBot = new THREE.Mesh( crystalgeometry, OFFcrystalmaterial ) ;
	crystalmeshBot.rotation.z = Math.PI;
	crystalmeshBot.position.set(5, 7.5, 10);
	rightrithcrystal.unshift(crystalmeshBot);

	const midcrystalshape = new THREE.Shape();

	midcrystalshape.moveTo( x - 0.5, y - 0.5);
	midcrystalshape.lineTo(x, y);
	midcrystalshape.lineTo(x + 4, y);
	midcrystalshape.lineTo(x + 4.5, y - 0.5);
	midcrystalshape.lineTo(x + 4, y - 1);
	midcrystalshape.lineTo(x, y - 1);

	const midcrystalgeometry = new THREE.ShapeGeometry( midcrystalshape );
	const crystalmeshMid = new THREE.Mesh( midcrystalgeometry, OFFcrystalmaterial ) ;
	crystalmeshMid.position.set(0.5, 14, 10);
	rightrithcrystal.unshift(crystalmeshMid);

	var leftleftcrystal = [];
	var leftrightcrystal = [];
	var rightleftcrystal = [];

	for (let i = 0; i < rightrithcrystal.length; i++)
	{
		rightrithcrystal[i].position.x -= 2.5;
		leftleftcrystal[i] = rightrithcrystal[i].clone(rightrithcrystal[i], true);
		leftrightcrystal[i] = rightrithcrystal[i].clone(rightrithcrystal[i], true);
		rightleftcrystal[i] = rightrithcrystal[i].clone(rightrithcrystal[i], true);
		leftleftcrystal[i].position.x -= 26.5;
		leftrightcrystal[i].position.x -= 16.5;
		rightleftcrystal[i].position.x += 16.5;
		rightrithcrystal[i].position.x += 26.5;

		leftleftcrystal[i].position.z -= 30;
		leftrightcrystal[i].position.z -= 30;
		rightleftcrystal[i].position.z -= 30;
		rightrithcrystal[i].position.z -= 30;

		scene.add( leftleftcrystal[i], leftrightcrystal[i], rightleftcrystal[i], rightrithcrystal[i]);
	}

	let score_s = {
		crystals : [],
		ONmatleft : ONcrystalmaterialleft,
		ONmatright : ONcrystalmaterialright,
		OFFmat : OFFcrystalmaterial
	}
	score_s.crystals[0] = leftleftcrystal;
	score_s.crystals[1] = leftrightcrystal;
	score_s.crystals[2] = rightleftcrystal;
	score_s.crystals[3] = rightrithcrystal;
	return (score_s);
}