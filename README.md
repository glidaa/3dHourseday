# Three Preview Component

Using React and threeJS.

## Initial Instructions

After cloning the repository, make sure to run `yarn` or `npm install` before running other npm/yarn scripts.

## Props

props | Default Value | Type
--- | --- | ---
**fbxFile** | `Horse FBX file` | *FBX file*
**groundTextureFile** | `Grass image` | *Texture File*
**containerHeight** | `document.body.clientHeight` | *Number*
**containerWidth** | `document.body.clientWidth` | *Number*
**onError** | `{}` | *{}*

## Blender script

When trying to get vertices array on blender, I usually use `curve-points.py` located
in blender-scripts/. Open up your blender from the terminal to get the logs of array
when executing the script in blender.

## What is going on

Right now, the model is loaded using GLTFLoader. animations, meshes are loaded except
some of the 3dObjects like NurbsPath and alike. Need to re-create the path with the PerspectiveCamera (Name: "Camera_Orientation") on it, that will sync with the timing
of animations.

View it on: http://localhost:3000/locations
It should show like in this video: http://localhost:3000/player
