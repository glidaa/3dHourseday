import React, { useEffect, useState } from 'react';

// Three js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { WEBGL } from 'three/examples/jsm/WebGL';

// Images
import LongLoad from '../../assets/images/tp.jpg';

import {
  MAP_NAMES,
  getHeight,
  getWidth,
  getModelWidth,
  initialBackground,
  product3D,
} from '../../constants/preview-3d-ar';

// styling
import './index.css';

let camera;
let content;
let controls;
let el;
let threeD;
let renderer;
let requestID;
let scene;

///////////////
let splineCamera;
let cameraHelper;
let cameraEye;

let parent;
let tubeGeometry;
let mesho;

let cHelper;
let parentx = [];

const sampleClosedSplineX = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, - 40, - 40 ),
	new THREE.Vector3( 0, 40, - 40 ),
	new THREE.Vector3( 0, 140, - 40 ),
	new THREE.Vector3( 0, 40, 40 ),
	new THREE.Vector3( 0, - 40, 40 )
] );

const sampleClosedSpline = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, - 10, - 40 ),
	new THREE.Vector3( 0, 10, - 40 ),
	new THREE.Vector3( 0, 110, - 40 ),
	new THREE.Vector3( 0, 10, 40 ),
	new THREE.Vector3( 0, - 10, 40 )
] );

sampleClosedSpline.curveType = 'catmullrom';
sampleClosedSpline.closed = true;

const direction = new THREE.Vector3();
const binormal = new THREE.Vector3();
const normal = new THREE.Vector3();
const position = new THREE.Vector3();
const lookAt = new THREE.Vector3();

const material = new THREE.MeshLambertMaterial( { color: 0xff00ff } );
const wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.3, wireframe: true, transparent: true } );

const params = {
	spline: 'GrannyKnot',
	scale: 4,
	extrusionSegments: 100,
	radiusSegments: 3,
	closed: true,
	animationView: false,
	lookAhead: false,
	cameraHelper: true,
};

      //========== the curve points we copied from Blender
const nurbPoints = {
  NurbsPath: [
    [2.3726043701171875, 0.16313862800598145, 0.0] ,
    [0.8804702758789062, -0.4373791217803955, 0.0] ,
    [-0.6116642951965332, -1.0378968715667725, 0.0] ,
    [-2.1037991046905518, -1.6384148597717285, 0.0] ,
    [-14.531002044677734, -1.7901122570037842, 0.0] ,
    [-16.21105194091797, -0.050934016704559326, 0.0] ,
    [-10.231389999389648, 5.503215789794922, 0.0] ,
    [-5.546828746795654, 7.8875732421875, 0.0] ,
    [-3.779599189758301, 8.588854789733887, 0.0] ,
    [-2.152625799179077, 7.074086666107178, 0.0] ,
    [1.4897791147232056, 4.673894882202148, 0.0] ,
    [-3.4564337730407715, 4.421970844268799, 0.0] ,
    [-5.250966548919678, 2.3329668045043945, 0.0] ,
  ],
  NurbsPath001: [
    [4.56427001953125, 0.0, -1.2171752452850342] ,
    [1.0, 0.0, 0.0] ,
    [0.0, 0.0, 0.7580859065055847] ,
    [-1.0, 0.0, 0.8751471042633057] ,
    [-2.0056822299957275, -0.02234085090458393, 1.1814147233963013] ,
    [-3.011364459991455, -0.04468170180916786, 1.1814147233963013] ,
    [-4.017046928405762, -0.06702255457639694, 1.1814147233963013] ,
    [-5.02272891998291, -0.08936340361833572, 1.1814147233963013] ,
    [-6.028410911560059, -0.1117042601108551, 1.0322741270065308] ,
    [-7.034093379974365, -0.13404510915279388, 0.9453914165496826] ,
    [-8.039775848388672, -0.15638595819473267, 0.7735426425933838] ,
    [-12.081878662109375, -0.18908777832984924, 0.4924190640449524] ,
  ],
  NurbsPath002: [
    [-9.200872421264648, -0.18908777832984924, 0.4924190640449524] ,
    [-8.039775848388672, -0.15638595819473267, 0.7735426425933838] ,
    [-7.034093379974365, -0.13404510915279388, 0.9453914165496826] ,
    [-6.028410911560059, -0.1117042601108551, 1.0322741270065308] ,
    [-5.02272891998291, -0.08936340361833572, 1.1814147233963013] ,
    [-4.017046928405762, -0.06702255457639694, 1.1814147233963013] ,
    [-3.011364459991455, -0.04468170180916786, 1.1814147233963013] ,
    [-2.0056822299957275, -0.02234085090458393, 1.1814147233963013] ,
    [-1.0, 0.0, 0.8751471042633057] ,
    [0.0, 0.0, 0.7580859065055847] ,
    [1.0, 0.0, 0.0] ,
    [2.0, 0.0, -0.013510793447494507] ,
  ],
  NurbsPath003: [
    [-9.506277084350586, -0.18908774852752686, -0.6795058846473694] ,
    [-8.34518051147461, -0.15638592839241028, 0.7735426425933838] ,
    [-7.034093379974365, -0.13404510915279388, 0.9453914165496826] ,
    [-6.028410911560059, -0.1117042601108551, 1.0322741270065308] ,
    [-5.02272891998291, -0.08936340361833572, 1.1814147233963013] ,
    [-4.017046928405762, -0.06702255457639694, 1.1814147233963013] ,
    [-3.011364459991455, -0.04468170180916786, 1.1814147233963013] ,
    [-2.0056822299957275, -0.02234085090458393, 1.1814147233963013] ,
    [-1.0, 0.0, 0.8751471042633057] ,
    [0.0, 0.0, 0.7580859065055847] ,
    [1.0, 0.0, 0.0] ,
    [2.0, 0.0, -0.30558788776397705] ,
  ],
  NurbsPath004: [
    [-2.0, 0.0, -0.22694802284240723] ,
    [-1.0, 0.0, 0.0] ,
    [0.0, 0.0, 0.0] ,
    [1.0, 0.0, 0.0] ,
    [2.0, 0.0, -0.22694802284240723] ,
  ]
};



const LocThreeComponent = ({
  glbFile,
  containerHeight = getHeight(),
  containerWidth = getWidth(),
  onError,
}) => {

  const [finishedLoading, setFinishedLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Preparing model..');
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  // function that sets 3d model in position
  const frameArea = (sizeToFitOnScreen, boxSize, boxCenter) => {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.Math.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = new THREE.Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(-3, -2, 1))
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  };

  // setting up node material that will be used on texture encoding
  const mutateNodeMaterial = (material) => {
    return new THREE.MeshStandardMaterial({
      name: material.name,
      alphaMap: material.alphaMap,
      alphaTest: material.alphaTest,
      alphaToCoverage: material.alphaToCoverage,
      aoMap: material.aoMap,
      aoMapIntensity: material.aoMapIntensity,

      color: material.color,
      colorWrite: true,

      emissive: material.emissive,
      emissiveIntensity: material.emissiveIntensity,
      emissiveMap: material.emissiveMap,

      flatShading: material.flatShading,
      fog: material.fog,

      lightMap: material.lightMap,
      lightMapIntensity: material.lightMapIntensity,

      map: material.map,
      morphNormals: material.morphNormals,
      morphTargets: material.morphTargets,
      normalMap: material.normalMap,
      normalMapType: material.normalMapType,
      normalScale: material.normalScale,
      opacity: material.opacity,

      side: material.side,
      skinning: material.skinning,

      toneMapped: material.toneMapped,
      transparent: material.transparent,


      stencilMask: material.stencilMask,
      wrapAround: material.wrapAround,
      wrapRGB: material.wrapRGB,
    });
  };

  // main traverse loop for texture encoding extracted from zip file
  const traverseMaterials = (object, callback) => {
    object.traverse((node) => {
      let mutatedMaterials;
      let mutatedMaterial;

      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }

      if (node.isObject3D && !node.isMesh) {
        if (node.material) {
          console.log('[NODE isObject3D] ', node.material.name, node.material.type);
        }
        // addTubex(node);
      }


      if (!node.isMesh) {
        return;
      }

      if (Array.isArray(node.material)) {
        // console.log('[TRA1] ', node.material.name, node.material.type);
        mutatedMaterials = node.material.map(mat => mat.material.type === 'MeshStandardMaterial' ? mat : mutateNodeMaterial(mat));
      } else {
        // console.log('[TRA2] ', node.material.name, node.material.type);
        mutatedMaterial = node.material.type === 'MeshStandardMaterial' ? node.material : mutateNodeMaterial(node.material);
      }

      const materials = Array.isArray(node.material) ? mutatedMaterials : [mutatedMaterial];
      materials.forEach(callback);

      setTimeout(() => {
        setFinishedLoading(true);
        window.dispatchEvent(new Event('resize'));
      }, 5000);
    });
  };

  // clean up of existing scene and node object, traversing into MAP_NAMES
  const clear = () => {
    if (!content) return;
    scene.remove(content);
    // dispose geometry
    content.traverse((node) => {
      if (!node.isMesh) return;
      node.geometry.dispose();
    });

    traverseMaterials(content, (material) => {
      MAP_NAMES.forEach((map) => {
        if (material[map]) material[map].dispose();
      });
    });
  };

  // setting up default lights, that is used to light up the 3d model
  const setContent = (object) => {
    clear();
    object.updateMatrixWorld();

    const ambientIntensity = 0.3;
    const ambientColor = 0xffffff;
    const directIntensity = 0.8 * Math.PI; // TODO(#116)
    const directColor = 0xffffff;

    /*
    const hemiLight = new THREE.HemisphereLight(0xff0000, 0x080820, 10);
    hemiLight.name = 'hemi_light';
    scene.add(hemiLight);
    */

    const light1 = new THREE.AmbientLight(ambientColor, ambientIntensity);
    light1.name = 'ambient_light';
    camera.add(light1);

    const light2 = new THREE.DirectionalLight(directColor, directIntensity);
    light2.position.set(0.5, 0, 0.866); // ~60º
    light2.name = 'main_light';
    camera.add(light2);

    content = object;
  };

  const updateMaterial = (material) => {
    const encoding = THREE.sRGBEncoding;
    if (material.map) material.map.encoding = encoding;
    if (material.emissiveMap) material.emissiveMap.encoding = encoding;
    if (material.lightMap) material.lightMap.encoding = encoding;
    if (material.metalnessMap) material.metalnessMap.encoding = encoding;
    if (material.normalMap) material.normalMap.encoding = encoding;
    if (material.roughnessMap) material.roughnessMap.encoding = encoding;
    if (material.alphaMap) material.alphaMap.encoding = encoding;

    if (
      material.map ||
      material.aoMap ||
      material.lightMap ||
      material.emissiveMap ||
      material.metalnessMap ||
      material.normalMap ||
      material.roughnessMap ||
      material.alphaMap
    ) {
      material.needsUpdate = true;
    }
  };

  const traverseAlpha = (v) => {
    setLoadingText('Mapping textures');
    traverseMaterials(v, (material) => updateMaterial(material));
  };

	const render = () => {
    /*
    // animate camera along spline
  	const time = Date.now();
  	const looptime = 20 * 1000;
  	const t = ( time % looptime ) / looptime;

  	tubeGeometry.parameters.path.getPointAt( t, position );
  	position.multiplyScalar( params.scale );

  	// interpolation
  	const segments = tubeGeometry.tangents.length;
  	const pickt = t * segments;
  	const pick = Math.floor( pickt );
  	const pickNext = ( pick + 1 ) % segments;

  	binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
  	binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );

    // console.log('[DIRECTION] ', direction);

  	tubeGeometry.parameters.path.getTangentAt( t, direction );
  	const offset = 15;

  	normal.copy( binormal ).cross( direction );

  	// we move on a offset on its binormal
  	position.add( normal.clone().multiplyScalar( offset ) );

  	splineCamera.position.copy( position );
  	cameraEye.position.copy( position );

    // console.log('[POSITION] ', position);

  	// using arclength for stablization in look ahead
    // {x: -14.406819383910104, y: -8.55071914625047, z: 192.67662514057864}

  	// tubeGeometry.parameters.path.getPointAt( ( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1, lookAt );
    tubeGeometry.parameters.path.getPointAt( ( t + 5 / tubeGeometry.parameters.path.getLength() ) % 1, lookAt );
  	lookAt.multiplyScalar( params.scale );

  	// camera orientation 2 - up orientation via normal

  	if ( ! params.lookAhead ) lookAt.copy( position ).add( direction );

    splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
  	splineCamera.quaternion.setFromRotationMatrix( splineCamera.matrix );

  	cameraHelper.update();
    // cHelper.update();
    */

  	renderer.render( scene, params.animationView === true ? splineCamera : camera );

  }



  let mixer;
  const clock = new THREE.Clock();
  let mesh = null;

  // trigger to execute TLougLLMOhLD_fQQc26v0wuM3QP9C54MdO4vsl3x31g
  const startAnimationLoop = () => {
    if (scene) {
      const dt = clock.getDelta();
      if (mixer) mixer.update(dt);

      // const time = - performance.now() / 11; // 20
      // grid.position.z = (time) % 100;

      // make grass move
      // mesh.position.z = (time) % 100;
      if (scene && camera) {
        render();
      }
      requestID = window.requestAnimationFrame(startAnimationLoop);
    }
  };


	const addGeometry = (geometry) => {
		// 3D shape
		mesho = new THREE.Mesh(geometry, material);
		const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
		mesho.add( wireframe );
		parent.add(mesho);
	}

	const setScale = () => {
	   mesho.scale.set(params.scale, params.scale, params.scale);
   }

  // add tube
  const addTube = () => {
  	if (mesho !== undefined) {
  		parent.remove(mesho);
  		mesho.geometry.dispose();
    }

		const extrudePath = sampleClosedSpline;
		tubeGeometry = new THREE.TubeGeometry( extrudePath, params.extrusionSegments, 2, params.radiusSegments, params.closed );
		addGeometry(tubeGeometry);
		setScale();
  }

  // initialization of scene object; loading of DAE file using DAELoader
  const sceneSetup = async () => {
    /*
    const reportData = [
    {
      "clientType": "proposer",
      "nric": "S7845849F"
    },
    {
      "clientType": "mainLife",
      "nric": "S0643286G"
    },
    {
      "clientType": "thirdLife",
      "nric": "S0643286G"
    },
    {
      "clientType": "fourthlife",
      "nric": "S0643286G"
    }
  ];

  reportData.reduce((p, v) => {
    console.log('[p] ', p);
    console.log('[v] ', v);
    return p.nric > v.nric ? p : v
  });
  */

    scene = new THREE.Scene();
    scene.background = new THREE.Color(initialBackground.WHITE);

    camera = new THREE.PerspectiveCamera(
      45, // fov = field of view
      width / height, // aspect ratio
      0.01, // near plane
      1000, // far plane
    );

    scene.add(camera);


		// tube

    renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    if (!el || el === null) return;

    controls = new OrbitControls(camera, el);
    controls.autoRotate = false;
    controls.autoRotateSpeed = -10;
    controls.screenSpacePanning = true;
    controls.noPan = true;
    controls.update();

    el.appendChild(renderer.domElement);

    // gltf loader
    const gltfLoader = new GLTFLoader();
    gltfLoader.setCrossOrigin('anonymous');
    gltfLoader.setDRACOLoader(new DRACOLoader());
    gltfLoader.load(threeD.glb, (obj) => {

      /*
      parent = new THREE.Object3D();
  		scene.add(parent);

  		splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
  		parent.add(splineCamera);

  		cameraHelper = new THREE.CameraHelper(splineCamera);
  		scene.add(cameraHelper);

      addTube();

  		// debug camera
  		cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
  		parent.add(cameraEye);

  		cameraHelper.visible = params.cameraHelper;
  		cameraEye.visible = params.cameraHelper;
      */


			mixer = new THREE.AnimationMixer(obj.scene);

      console.log('[GLTF] ', obj);

      /*
      obj.scene.traverse((node) => {
        if (node.isCamera) {
          console.log('[CAMERA] ', node);
          scene.add(node);
    			cHelper = new THREE.CameraHelper(node);
    			scene.add(cHelper);
          cHelper.visible = true;
        }
      });
      */

      obj.scene.traverse((node) => {
        if (node.name.indexOf('Cube004') > -1) {
          var geometry = node.geometry;
          updateMaterial(node.material);
        }

        if (node.name.indexOf('NurbsPath') > -1) {
          console.log('[NURBS] ', node, node.name);
          const points = nurbPoints[node.name];
          //========== scale the curve to make it as large as you want
          const scale = 1;
          //========== Convert the array of points into vertices (in Blender the z axis is UP so we swap the z and y)
          for (var i = 0; i < points.length; i++) {
            var x = points[i][0] * scale;
            var y = points[i][1] * scale;
            var z = points[i][2] * scale;
            points[i] = new THREE.Vector3(x, z, -y);
          }
          //========== Create a path from the points
          var curvePath =  new THREE.CatmullRomCurve3(points);
          var radius = .25;
          //========== Create a tube geometry that represents our curve
          var geometry = new THREE.TubeGeometry( curvePath, 600, radius, 5, false );
          // var geometry = new THREE.TubeGeometry(curvePath, params.extrusionSegments, 2, params.radiusSegments, params.closed);

          // ========== add tube to the scene
          const materialz = new THREE.MeshBasicMaterial({
            vertexColors : THREE.FaceColors,
            side: THREE.DoubleSide,
            transparent:true,
            opacity: 1,
            color: 0xff00ff,
          });
          const tube = new THREE.Mesh( geometry, material );
          tube.position.set(
            node.position.x,
            node.position.y,
            node.position.z
          );

          tube.scale.set(
            node.scale.x,
            node.scale.y,
            node.scale.z
          );

          /*
          tube.position = new THREE.Vector3({
            x: 1549.513916015625,
            y: 149.96421813964844,
            z: -807.15673828125,
          });
          tube.scale = new THREE.Vector3({
            x: 128.0198211669922,
            y: 128.0198211669922,
            z: 128.0198211669922,
          });
          */
          scene.add( tube );
        }
      });



      /*
      obj.scene.traverse((node) => {
        if (node.name.indexOf('Camera') > -1 && node.type === 'Object3D') {
          console.log('[NODE] ', node, node.children);

          // obj.cameras
    			let splineCamera = node.children[0]; // new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
    			node.add(splineCamera);

    			let cameraHelper = new THREE.CameraHelper(splineCamera);
    			scene.add(cameraHelper);

    			// debug camera
    			let cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
    			node.add(cameraEye);

    			cameraHelper.visible = true; // params.cameraHelper;
    			cameraEye.visible = true; // params.cameraHelper;

        }
      });
      */


      // animations
      obj.animations.forEach((clip) => {mixer.clipAction(clip).play(); });

      /*
      obj.cameras.map(cam => {
        console.log('[CAMERA] ', cam);
        camera = cam;
        scene.add(cam);
        return cam;
      });



      const emotes = ['Gallop', 'Giddy Up', 'Jokey', 'Jump', 'Trot', 'Walk', 'iddle 01', 'iddle 02' ];
      */


        /*
      const actions = {};
      obj.animations.map(anim => {
				const clip = anim;
				const action = mixer.clipAction(clip);
				actions[clip.name] = action;

        if ( emotes.indexOf( clip.name ) >= 0) {
    			action.clampWhenFinished = true;
    			action.loop = THREE.LoopRepeat;
				}

        // action.play();
        return anim;
      });
      */


      // set default animation here
      // console.log('[ACTIONS] ', actions);

            /*
      if (Object.keys(actions).length > 0) {
        const activeAction = actions.["Camera|CameraAction"];
        activeAction.clampWhenFinished = true;
        activeAction.loop = THREE.LoopRepeat;
        activeAction
    			.reset()
    			.setEffectiveTimeScale(3)
    			.setEffectiveWeight(1)
    			.fadeIn(0.5)
    			.play();
      }


      traverseAlpha(obj.scene);
      setContent(obj.scene);

            */

      traverseAlpha(obj.scene);
      setContent(obj.scene);



      scene.add(obj.scene);

      obj.scene.position.set(2, 0, 0);
      camera.position.copy(product3D.cameraPosition);


      const box = new THREE.Box3().setFromObject(obj.scene);
      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());
      const modelWidth = getModelWidth(width, height);
      frameArea(modelWidth * 0.5, boxSize, boxCenter);

      controls.target.copy(boxCenter);
      controls.minDistance = 1300;
      controls.maxDistance = Infinity;
      controls.update();


      // TEMP
      // obj.rotation.copy(product3D.objectRotation);


      setTimeout(() => {
        setFinishedLoading(true);
        window.dispatchEvent(new Event('resize'));
      }, 5000);

    });


};

  useEffect(() => {
    threeD = {};
    threeD.glb = glbFile;
    threeD.textures = {};
    setHeight(containerHeight);
    setWidth(containerWidth);

    // timeoutId for debounce mechanism
    let timeoutId = null;

    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => {
        if (renderer) renderer.setSize(containerWidth, containerHeight);
        if (camera) {
          camera.aspect = containerWidth / containerHeight;
          camera.updateProjectionMatrix();
        }
        setHeight(containerHeight);
        setWidth(containerWidth);
      }, 150);
    };

    window.addEventListener('resize', resizeListener);

    sceneSetup();
    startAnimationLoop();

    return () => {
      threeD = {};
      threeD.textures = {};
      window.removeEventListener('resize', resizeListener);
      window.cancelAnimationFrame(requestID);
      if (controls) controls.dispose();
      if (renderer) renderer.dispose();
      scene = null;
    };
  }, []);

  if (!WEBGL.isWebGLAvailable) return <div>WebGL not supported.</div>

return (
    <>
      {!finishedLoading && (
        <div className="loading">
          <img src={LongLoad} className="longLoad" alt="" />
          <p style={{ color: '#fff' }}>{loadingText}</p>
        </div>
      )}

      <div
        className="modelContainer"
        style={{ opacity: finishedLoading ? 1 : 0 }}
        ref={(ref) => { el = ref }}
      />
    </>

  );
};

export default LocThreeComponent;
